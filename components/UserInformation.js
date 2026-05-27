import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, ActivityIndicator, Dimensions, Alert, Modal, Platform, KeyboardAvoidingView, } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { User, Mail, MapPin, Building2, Map, Users, Save, X, Camera, Phone, Calendar, Edit, Share2, } from "lucide-react-native";
import Theme from "./Theme";
import { formatDate } from "../utils";
import { userData } from "../src/features/userRegister/RegisterSlice";
import { signInWithGoogle, userLogout } from './auth/FirebaseAuthUtils';
import { useFirebaseUser } from "./auth/useFirebaseUser";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../utils/config";
const { width } = Dimensions.get("window");

const toText = (val) => {
  if (val == null) return "";
  return typeof val === "string" ? val : JSON.stringify(val);
};


const UserInformation = () => {

  // States for edit, loading, error, referral, OTP modal, etc.
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [referralId, setReferralId] = useState(user?.user?.introducer_id)
  const [emailAddress, setEmailAddress] = useState(user?.user?.Email)

  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalReferral, setModalReferral] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const inputRefs = useRef([]);

  const { AadharDetail } = useSelector((state) => state.aadhar);
  const user = useSelector((state) => state.register.user);


  const dispatch = useDispatch();

  const refreshUser = async () => {
    const res = await dispatch(userData());
    console.log(res)
  }

  useEffect(() => {
    refreshUser();
  }, [referralId])



  // Load user data and referral info
  useEffect(() => {
    if (user?.user?.introducer_id) {

      setReferralId(user?.user?.introducer_id)
      setEmailAddress(user?.user?.Email)
    }
    setLoading(false);
  }, [user?.user?.Email, user?.user?.introducer_id, isInitialized]);





  // Open OTP modal for email or referral
  // open the modal
  const openOtpModal = (field, value = "") => {
    setEditField(field);
    if (field === 'email') setModalEmail(value || "");
    if (field === 'referral') setModalReferral(value || "");
    setOtp(new Array(6).fill(""));
    setShowOtpModal(true);
  };


  // OTP input change logic (auto focus next)
  const handleOtpChange = (index, text) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, "").slice(0, 1);
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // If delete, go to previous
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // OTP backspace key logic
  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // OTP verification logic (with email field)
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter a 6-digit OTP");
      return;
    }

    if (editField === "email") {
      if (!modalEmail || !modalEmail.includes("@")) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }
    }

    setOtpLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      // Example API call:
      // const response = await axios.post("YOUR_OTP_VERIFY_ENDPOINT", {
      //   otp: otpCode,
      //   email: editField === "email" ? modalEmail : undefined,
      //   field: editField
      // }, { headers: { Authorization: `Bearer ${token}` } });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const successMessage = editField === "email"
        ? `OTP verified successfully for ${modalEmail}!`
        : `OTP verified successfully!`;

      Alert.alert("Success", successMessage);
      setShowOtpModal(false);
      setOtp(new Array(6).fill(""));
      setModalEmail("");
      setModalReferral("")
    } catch (error) {
      Alert.alert("Error", "OTP verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Editable field renderer
  const EditableField = useCallback(
    ({ icon: Icon, label, value, onChangeText, editable = true, showEditIcon = false }) => {
      return (
        <View style={styles.detailRow}>
          <View style={styles.iconContainer}>
            <Icon size={20} color={Theme.colors.primary} strokeWidth={2} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{label}</Text>
            {isEditing && editable ? (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={setModalEmail}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            ) : (
              <View style={styles.valueWrapper}>
                <Text style={styles.detailValue}>{value || "Not provided"}</Text>
                {showEditIcon && (
                  label === "Email" ? (
                    <TouchableOpacity
                      onPress={handleGoogleAuth}
                      style={styles.editIconInside}
                    >
                      <Edit size={18} color={Theme.colors.primary} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => openOtpModal(label.toLowerCase(), value)}
                      style={styles.editIconInside}
                    >
                      <Edit size={18} color={Theme.colors.primary} />
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>
        </View>
      );
    },
    [isEditing]
  );

  // ===============================================================================
  // Handdle Authentication Via Firebase 
  // ===============================================================================
  // const [emailOtpSent, setOtpSent] = useState(false);

  const [emailUpdating, setEmailUpdating] = useState(false);
  const inFlightRef = useRef(false);

  const { userInformation } = useFirebaseUser()
  console.log(userInformation)

  // ✅ Single-button flow: Google auth -> call API -> logout -> update UI
  const handleGoogleAuth = async () => {
    if (inFlightRef.current) return;      // prevent double taps
    inFlightRef.current = true;
    setEmailUpdating(true);

    try {
      // If already signed in (some devices cache), clear first
      // await handleLogout(); // optional pre-clean

      const cred = await signInWithGoogle();
      const newEmail =
        cred?.user?.email ||
        cred?.additionalUserInfo?.profile?.email ||
        null;

      if (!newEmail) {
        Alert.alert("Google Sign-In", "Could not read email from Google account.");
        return;
      }

      // If it’s the same, just logout and skip network
      if (newEmail === (user?.user?.Email || emailAddress)) {
        await handleLogout();
        Alert.alert("Info", "This email is already on your profile.");
        return;
      }

      // Call your backend with the new email
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Auth token missing");

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("==================================>Email",newEmail)

      // TODO: change endpoint/body to your real API
      const resp = await axios.post(
        `${BASE_URL}/register/update_email`,
        { email: newEmail },
        { headers }
      );

      console.log("===========================================>resp",resp)

      // Success UX: update UI + refresh user from server
      setEmailAddress(newEmail);
      try { await refreshUser(); } catch { }

      // Immediately disconnect from Google (you’re only using it to fetch email)
      await handleLogout();

      Alert.alert("Success", "Email updated successfully.");
    } catch (e) {
      console.log("[GSIGN] flow error ->", e?.message, e);
      Alert.alert("Error", e?.message || "Failed to update email via Google.");
      // try to logout anyway so we don’t keep a Google session
      try { await handleLogout(); } catch { }
    } finally {
      setEmailUpdating(false);
      inFlightRef.current = false;
    }
  };


  // ✅ Fix your logout helper (your catch block used wrong variable names)
  const handleLogout = async () => {
    try {
      await userLogout(); // logs out Firebase + Google (from your utils)
    } catch (e) {
      console.log("[GSIGN] logout error ->", e?.message, e);
    }
  };


  // ===============================================================================
  // Handdle Send and Verify Otp For Referrral Updation 
  // ===============================================================================
  const [referral, setRefferal] = useState(null);
  const [isValidate, setisValidate] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [ReferralLoader, setReferralLoader] = useState(false)
  const [apimessage, setApiMessage] = useState(null)

  const ValidateReferral = async () => {
    setReferralLoader(true)
    if (!modalReferral.trim()) {
      setReferralLoader(false);  // <- add this
      setErrorMessage("Please enter a referral code");
      return;
    }
    setErrorMessage("");

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setReferralLoader(false);
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${BASE_URL}/referral/validate-referral?member_id=${modalReferral.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 1) {
        setRefferal({
          mobileNumber: response.data.user.MobileNumber,
          memberId: response.data.user.member_id,
        });
        setisValidate(true)
        setReferralLoader(false);
      } else {
        setErrorMessage(response.data.detail || "Invalid referral code");
        setReferralLoader(false);
      }
    } catch (error) {
      setReferralLoader(false);
      console.error("Validation error:", error);
      setErrorMessage(
        error.response?.data?.detail || "Failed to validate referral code"
      );
    } finally {
      setReferralLoader(false);
    }
  };

  const updateReferral = async () => {
    setReferralLoader(true);
    setErrorMessage("");

    if (!isValidate) {
      setReferralLoader(false);
      setErrorMessage("Please Validate Sponser First")
      return; // <- return here
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        setReferralLoader(false);
        throw new Error("Authentication token not found");
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Step 1: Register the referral relationship
      const response = await axios.post(
        `${BASE_URL}/register/update-referal/`,
        {
          refererID: modalReferral
        },
        { headers }
      );
      setReferralLoader(false);


      console.log(response.data)
      setReferralId(response?.data?.introducer_id)
      setApiMessage(response?.data?.message)
    } catch (error) {
      setReferralLoader(false);

      console.error("Referral submission error:", error);

      let errorMessage = "Something went wrong";
      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "Network error - please check your connection";
      } else {
        // Other errors
        errorMessage = error.message || "Failed to process referral";
      }

      setErrorMessage(errorMessage);

      // Optionally show an alert for critical errors
      if (!error?.response || error?.response?.status >= 500) {
        setReferralLoader(false);
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setReferralLoader(false);
    }
  };




  // =================================================================================

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Main UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Theme.colors.primary }} edges={['bottom']}>
    <View style={styles.container}>
      {/* Purple header section with profile image */}
      <View style={styles.purpleSection}>
        <View style={styles.backgroundDecor}>
          <View style={[styles.blob, styles.blob1]} />
          <View style={[styles.blob, styles.blob2]} />
        </View>

        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={AadharDetail?.aadhar_details ? { uri: `data:image/jpeg;base64,${AadharDetail?.aadhar_details?.photo}` } : require("../assets/Profilee.png")}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{AadharDetail?.aadhar_details?.name || "User Name"}</Text>
          <TouchableOpacity  >
            <Text style={styles.userStatus}>
              {user?.user?.prime_status ? "Prime Member" : "Normal Member"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Card with user details */}
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardContent}
      >
        <EditableField
          icon={User}
          label="Full Name"
          value={AadharDetail?.aadhar_details?.name || "Not Provided"}
          editable={false}
        />
        <EditableField
          icon={Mail}
          label="Email"

          value={emailAddress || "Not Provided"}
          onChangeText={(text) => handleTextChange("userEmail", text)}
          showEditIcon={true}
        />
        <EditableField
          icon={Phone}
          label="Phone"
          value={user?.user?.MobileNumber}
          editable={false}
        />
        <EditableField
          icon={Calendar}
          label="Date Joined"
          value={formatDate(user?.user?.CreatedAt)}
          editable={false}
        />
        <EditableField
          icon={MapPin}
          label="Address"
          value={
            AadharDetail?.aadhar_details?.address
              ? `${AadharDetail?.aadhar_details?.address.house || ""} ${AadharDetail?.aadhar_details?.address.street || ""} ${AadharDetail?.aadhar_details?.address.landmark || ""} ${AadharDetail?.aadhar_details?.address.vtc || ""}  ${AadharDetail?.aadhar_details?.address.district || ""} ,${AadharDetail?.aadhar_details?.address.pin || ""} `.trim()
              : "Not Available"
          }
          editable={false}
        />
        <EditableField
          icon={Building2}
          label="City"
          value={AadharDetail ? AadharDetail?.aadhar_details?.address.district : "Not Provided"}
          editable={false}
        />
        <EditableField
          icon={Map}
          label="State"
          value={AadharDetail ? AadharDetail?.aadhar_details?.address.state : "Not Provided"}
          editable={false}
        />
        <EditableField
          icon={Users}
          label="Referral"
          value={referralId || "Not Provided"}
          // value={referalName}
          editable={false}
          showEditIcon={referralId === "LCR00000001" ? true : false}
        />
      </ScrollView>


      {/* =================================================================================== */}
      {/* OTP Verification Modal */}
      {/* ========================================================================================== */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editField === "email" ? "Update Email" : "Update Referral"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowOtpModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            {/* =============================================================== */}
            {/*=========== Referral Code Updation========= */}
            {/* =============================================================== */}


            {editField !== "email" && (
              <View style={styles.emailInputContainer}>
                <View style={styles.emailIconWrapper}>
                  <Share2 size={20} color={Theme.colors.primary} />
                </View>
                <TextInput
                  style={styles.emailInput}
                  value={modalReferral}
                  onChangeText={setModalReferral}
                  placeholder="Enter your Referral Code"
                  placeholderTextColor="#999"
                  keyboardType="default"
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
            )}

            {/* OTP Input Fields */}
            {editField === "email" && (
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(index, text)}
                    onKeyPress={({ nativeEvent: { key } }) =>
                      handleKeyPress(index, key)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}




              </View>
            )}




            {/* Error (only for referral flow) */}
            {editField !== "email" && !!errorMessage && (
              <Text style={{ color: "red", marginBottom: 8 }}>
                {toText(errorMessage)}
              </Text>
            )}

            {/* Valid introducer badge */}
            {editField !== "email" && !errorMessage && referral?.memberId && (
              <Text style={styles.validSponser}>Valid Introducer</Text>
            )}

            {/* API success/info message */}
            {editField !== "email" && !errorMessage && !!apimessage && (
              <Text style={styles.validSponser}>
                {toText(apimessage)}
              </Text>
            )}



            <TouchableOpacity
              style={styles.verifyButton}
              onPress={editField === "email" ? handleVerifyOtp : (isValidate ? updateReferral : ValidateReferral)}
              disabled={otpLoading || ReferralLoader}
            >
              {otpLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.verifyButtonText}>{editField === "email" ? (otpLoading ? "" : "Verify OTP") : (isValidate ? "Update Referral" : "Validate Referral")}</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  purpleSection: {
    backgroundColor: Theme.colors.primary,
    paddingBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  blob1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#fff',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  blob2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: '#fff',
    bottom: -width * 0.2,
    left: -width * 0.25,
  },
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 4,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profileImage: {
    width: width < 375 ? 90 : 100,
    height: width < 375 ? 90 : 100,
    borderRadius: width < 375 ? 45 : 50,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
  },
  userName: {
    fontSize: width < 375 ? 18 : 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    textAlign: 'center',
  },
  userStatus: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -2,
    overflow: 'hidden',
  },
  cardContent: {
    paddingTop: 20,
    paddingHorizontal: width < 375 ? 12 : 16,
    paddingBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: width < 375 ? 10 : 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  iconContainer: {
    width: width < 375 ? 36 : 40,
    height: width < 375 ? 36 : 40,
    backgroundColor: "#F3F0FF",
    borderRadius: width < 375 ? 18 : 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: width < 375 ? 10 : 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: width < 375 ? 11 : 12,
    color: "#666666",
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: width < 375 ? 14 : 16,
    color: "#1A1A1A",
    fontWeight: "600",
  },
  input: {
    fontSize: width < 375 ? 14 : 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  editIconButton: {
    padding: 8,
    marginLeft: 8,
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  editIconInside: {
    padding: 4,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: width < 375 ? 20 : 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: width < 375 ? 18 : 20,
    fontWeight: "700",
    color: Theme.colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalDescription: {
    fontSize: width < 375 ? 13 : 14,
    color: "#666666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    borderRadius: 12,
    marginBottom: 24,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },
  emailIconWrapper: {
    marginRight: 10,
  },
  emailInput: {
    flex: 1,
    fontSize: width < 375 ? 14 : 16,
    color: '#1A1A1A',
    paddingVertical: width < 375 ? 12 : 14,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: width < 375 ? 0 : 10,
  },
  otpInput: {
    width: width < 375 ? 40 : 45,
    height: width < 375 ? 45 : 50,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    borderRadius: 10,
    textAlign: "center",
    fontSize: width < 375 ? 18 : 20,
    fontWeight: "600",
    color: "#1A1A1A",
    backgroundColor: '#F9F9F9',
  },
  verifyButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: width < 375 ? 12 : 14,
    borderRadius: 12,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: width < 375 ? 15 : 16,
    fontWeight: "600",
  },
  validSponser: {
    color: "green",
    marginBottom: 10,
  }
});

export default UserInformation;

/*
--------------------------
Code Explanation (Comments)
--------------------------
- User profile screen with editable fields.
- OTP modal supports email field for verification.
- Profile image upload/camera.
- Referral, email, phone, address, city, state, etc.
- Responsive design and animated blobs.
- OTP input: auto focus, backspace logic, only numbers.
*/