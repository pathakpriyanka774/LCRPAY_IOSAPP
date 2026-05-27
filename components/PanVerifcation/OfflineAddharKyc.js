import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import Theme from "../Theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Path, Rect } from "react-native-svg";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import { BASE_URL } from "../../utils/config";

const { width, height } = Dimensions.get("window");

const SECONDARY_COLOR = "#4b5563"; // Subtle gray

const OfflineAddharKyc = () => {
  // Here calander data come here
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const OpenDate = () => {
    setShowCalendar(true);
  };

  // const onDateSelect = (date) => {
  //     const formattedDate = moment(date.dateString).format("YYYY-MM-DD");
  //     setSelectedDate(formattedDate);
  //     setShowCalendar(false);
  // };

  const onDateSelect = (selectedDate) => {
    console.log(selectedDate); // Logs the selected date object
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    console.log(formattedDate); // Logs the formatted date (YYYY-MM-DD)
    setSelectedDate(formattedDate);
  };

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [formDataState, setState] = useState({
    aadhaarNumber: "",
    confirmAadhaarNumber: "",
    name: "",
    district: "",
    address: "",
    frontImageUri: null,
    backImageUri: null,
    isAgreed: false,
  });

  const handleofflinekyc = async () => {
    validateForm();

    setLoading(true); // Start loading

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found.");
      }

      const formData = new FormData();

      if (formDataState.frontImageUri) {
        const frontImage = {
          uri: formDataState.frontImageUri,
          type: "image/jpeg", // Adjust the type based on the file
          name: "aadhar_front.jpg", // Choose an appropriate name
        };
        formData.append("aadhar_front", frontImage);
      } else {
        throw new Error("Front image is missing.");
      }

      if (formDataState.backImageUri) {
        const backImage = {
          uri: formDataState.backImageUri,
          type: "image/jpeg", // Adjust the type based on the file
          name: "aadhar_back.jpg", // Choose an appropriate name
        };
        formData.append("aadhar_back", backImage);
      } else {
        throw new Error("Back image is missing.");
      }
      // Append other form fields
      formData.append("name", formDataState.name);
      formData.append("dob", selectedDate.toString());
      formData.append("district", formDataState.district);
      formData.append("address", formDataState.address);
      formData.append("aadhar_no", formDataState.aadhaarNumber);

      // const ntoken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MzIzOTE4ODg5IiwidXNlcklkIjoiNTEiLCJleHAiOjQ4OTM0OTk5MzR9.5OEqxf6tch_-odUXiRnfGTa-SId3wsnSffLZ15bCly8`
      console.log("FormData:", formData);
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      // Make POST request
      const response = await axios.post(
        `${BASE_URL}/offlineKyc/`,
        formData,
        { headers }
      );

      console.log("Server Response:", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "KYC submitted successfully!");
        navigation.navigate("Panverify");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 404) {
          Alert.alert("Error", "Requested resource not found (404)");
        }
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Error", "Something went wrong!");
      }
    }
  };

  const [errors, setErrors] = useState({
    aadhaarNumber: "",
    confirmAadhaarNumber: "",
    name: "",
    dob: "",
    district: "",
    address: "",
    agreement: "",
  });

  const [showAadhaar, setShowAadhaar] = useState({
    primary: false,
    confirm: false,
  });

  const handleInputChange = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = useCallback(async (side) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera permissions to take photos"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setState((prev) => ({
          ...prev,
          [`${side}ImageUri`]: result.assets?.[0]?.uri || result.uri,
        }));
      }
    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (
      !formDataState.aadhaarNumber ||
      !/^\d{12}$/.test(formDataState.aadhaarNumber)
    ) {
      newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";
    }

    if (formDataState.aadhaarNumber !== formDataState.confirmAadhaarNumber) {
      newErrors.confirmAadhaarNumber = "Aadhaar numbers do not match";
    }

    // if (!formDataState.dob) {
    //     newErrors.dob = 'Date of birth is required';
    // }
    if (!selectedDate) {
      newErrors.dob = "Date of birth is required";
    }
    if (!formDataState.name) {
      newErrors.dob = "Name  is  required";
    }

    if (!formDataState.district) {
      newErrors.district = "District is required";
    }

    if (!formDataState.address) {
      newErrors.address = "Address is required";
    }

    if (!formDataState.frontImageUri) {
      newErrors.frontImage = "Front image is required";
    }

    if (!formDataState.backImageUri) {
      newErrors.backImage = "Back image is required";
    }

    if (!formDataState.isAgreed) {
      newErrors.agreement = "You must agree to the terms and conditions";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  }, [formDataState]);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Entypo name="shield" size={32} color={Theme.colors.primary} />
          </View>
          <Text style={styles.title}>KYC Verification</Text>
          <Text style={styles.description}>
            Complete your identity verification by providing the required
            details below
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Aadhar Details</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Aadhar Number</Text>
            <View
              style={[
                styles.inputContainer,
                errors.aadhaarNumber && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter 12-digit Aadhaar number"
                value={formDataState.aadhaarNumber}
                onChangeText={(text) =>
                  handleInputChange("aadhaarNumber", text)
                }
                keyboardType="number-pad"
                maxLength={12}
                secureTextEntry={!showAadhaar.primary}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() =>
                  setShowAadhaar((prev) => ({
                    ...prev,
                    primary: !prev.primary,
                  }))
                }
                style={styles.eyeIcon}
              >
                <Entypo
                  name={showAadhaar.primary ? "eye" : "eye-with-line"}
                  size={24}
                  color={SECONDARY_COLOR}
                />
              </TouchableOpacity>
            </View>
            {errors.aadhaarNumber && (
              <Text style={styles.errorText}>{errors.aadhaarNumber}</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Aadhaar Number</Text>
            <View
              style={[
                styles.inputContainer,
                errors.confirmAadhaarNumber && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Confirm your Aadhaar number"
                value={formDataState.confirmAadhaarNumber}
                onChangeText={(text) =>
                  handleInputChange("confirmAadhaarNumber", text)
                }
                keyboardType="number-pad"
                maxLength={12}
                secureTextEntry={!showAadhaar.confirm}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                onPress={() =>
                  setShowAadhaar((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                style={styles.eyeIcon}
              >
                <Entypo
                  name={showAadhaar.confirm ? "eye" : "eye-with-line"}
                  size={24}
                  color={SECONDARY_COLOR}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmAadhaarNumber && (
              <Text style={styles.errorText}>
                {errors.confirmAadhaarNumber}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name (as per your Addhar)</Text>
            <View
              style={[styles.inputContainer, errors.name && styles.inputError]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter Name As Per your Addhar"
                value={formDataState.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity
            onPress={() => setOpen(true)}
            // onPress={OpenDate}
            style={[
              styles.input,
              { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10 },
            ]}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                top: 10,
              }}
            >
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 20 20"
              >
                <Rect width="20" height="20" fill="none" />
                <Path
                  fill="gray"
                  d="M5.673 0a.7.7 0 0 1 .7.7v1.309h7.517v-1.3a.7.7 0 0 1 1.4 0v1.3H18a2 2 0 0 1 2 1.999v13.993A2 2 0 0 1 18 20H2a2 2 0 0 1-2-1.999V4.008a2 2 0 0 1 2-1.999h2.973V.699a.7.7 0 0 1 .7-.699M1.4 7.742v10.259a.6.6 0 0 0 .6.6h16a.6.6 0 0 0 .6-.6V7.756zm5.267 6.877v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zm-8.333-3.977v1.666H5v-1.666zm4.166 0v1.666H9.167v-1.666zm4.167 0v1.666h-1.667v-1.666zM4.973 3.408H2a.6.6 0 0 0-.6.6v2.335l17.2.014V4.008a.6.6 0 0 0-.6-.6h-2.71v.929a.7.7 0 0 1-1.4 0v-.929H6.373v.92a.7.7 0 0 1-1.4 0z"
                />
              </Svg>
              <View>
                <Text style={{ color: "gray" }}>
                  {selectedDate || "select Date YYYY-MM-DD"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>District</Text>
            <View
              style={[
                styles.inputContainer,
                errors.district && styles.inputError,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Enter your district"
                value={formDataState.district}
                onChangeText={(text) => handleInputChange("district", text)}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.district && (
              <Text style={styles.errorText}>{errors.district}</Text>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Address</Text>
            <View
              style={[
                styles.inputContainer,
                errors.address && styles.inputError,
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                placeholder="Enter your full address"
                value={formDataState.address}
                onChangeText={(text) => handleInputChange("address", text)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Document Upload</Text>
          <Text style={styles.uploadDescription}>
            Please capture clear photos of your Aadhaar card
          </Text>

          <View style={styles.imageGrid}>
            <View style={styles.imageContainer}>
              <Text style={styles.label}>Front Side</Text>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  formDataState.frontImageUri && styles.uploadButtonWithImage,
                ]}
                onPress={() => handleImageUpload("front")}
              >
                {formDataState.frontImageUri ? (
                  <Image
                    source={{ uri: formDataState.frontImageUri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Entypo
                      name="camera"
                      size={32}
                      color={Theme.colors.primary}
                    />
                    <Text style={styles.uploadText}>Tap to Capture</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.frontImage && (
                <Text style={styles.errorText}>{errors.frontImage}</Text>
              )}
            </View>

            <View style={styles.imageContainer}>
              <Text style={styles.label}>Back Side</Text>
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  formDataState.backImageUri && styles.uploadButtonWithImage,
                ]}
                onPress={() => handleImageUpload("back")}
              >
                {formDataState.backImageUri ? (
                  <Image
                    source={{ uri: formDataState.backImageUri }}
                    style={styles.imagePreview}
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Entypo
                      name="camera"
                      size={32}
                      color={Theme.colors.primary}
                    />
                    <Text style={styles.uploadText}>Tap to Capture</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.backImage && (
                <Text style={styles.errorText}>{errors.backImage}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              handleInputChange("isAgreed", !formDataState.isAgreed)
            }
          >
            <View
              style={[
                styles.checkbox,
                formDataState.isAgreed && styles.checkboxChecked,
              ]}
            >
              {formDataState.isAgreed && (
                <Entypo name="check" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the terms and conditions
            </Text>
          </TouchableOpacity>
          {errors.agreement && (
            <Text style={styles.errorText}>{errors.agreement}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              !formDataState.isAgreed && styles.submitButtonDisabled,
            ]}
            onPress={handleofflinekyc}
            disabled={!formDataState.isAgreed}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="white"
                style={{ transform: [{ scale: 1 }] }}
              />
            ) : (
              ""
            )}
            {!loading ? (
              <Text style={styles.submitButtonText}>Submit Verification</Text>
            ) : (
              ""
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* {showCalendar && ( */}

      {/* {showCalendar && (
                <Modal
                    visible={showCalendar}
                    transparent={true}
                    animationType="fade"
                    onDismiss={() => setShowCalendar(false)}
                    contentContainerStyle={{
                        padding: 20,
                        backgroundColor: "white",
                        marginHorizontal: 20,
                        borderRadius: 10,
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.calendarWrapper}>
                            <Calendar
                                onDayPress={onDateSelect}
                                markedDates={{ [selectedDate]: { selected: true, selectedColor: Theme.colors.primary } }}
                            />

                        </View>
                    </View>
                </Modal>
            )} */}
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
          onDateSelect(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      {/* )} */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dim background
  },
  calendarWrapper: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: width * 0.85, // Adjust width based on screen size
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: SECONDARY_COLOR,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  uploadDescription: {
    fontSize: 14,
    color: SECONDARY_COLOR,
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  eyeIcon: {
    padding: 12,
  },
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  imageContainer: {
    flex: 1,
  },
  uploadButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    overflow: "hidden",
    height: 160,
  },
  uploadButtonWithImage: {
    borderStyle: "solid",
    borderColor: Theme.colors.primary,
  },
  uploadPlaceholder: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: SECONDARY_COLOR,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  footer: {
    marginTop: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Theme.colors.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: SECONDARY_COLOR,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default OfflineAddharKyc;
