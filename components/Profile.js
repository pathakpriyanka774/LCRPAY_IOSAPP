import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons"; // Eye Icon
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/MaterialIcons";

import {
  adharKycInitiate,
  genrateOtp,
  setOtpSent,
  testApi,
} from "../src/features/aadharKyc/AadharSlice";
import Theme from "./Theme";

const Profile = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    aadhaarNumber: "",
    confirmAadhaarNumber: "",
    isAadhaarVisible: false,
    isConfirmAadhaarVisible: false,
    frontImageUri: null,
    backImageUri: null,
    isAgreed: false,
    captchaText: "",
    aadhaarError: "",
    confirmAadhaarError: "",
    captchaError: "",
    agreementError: "",
  });

  const captchData = useSelector((state) => state.aadhar.captchData);
  const loading = useSelector((state) => state.aadhar.loading);
  const info = useSelector((state) => state.aadhar);

  const [refreshCaptcha, setRefreshCatpcha] = useState(false);

  useEffect(() => {
    setRefreshCatpcha(false);
    dispatch(adharKycInitiate());
  }, [refreshCaptcha]);

  useFocusEffect(
    useCallback(() => {
      if (info.otpSent) {
        dispatch(setOtpSent(false)); // Reset state before navigating
        navigation.replace("AadharOtp", {
          aadhaar_number: state.aadhaarNumber,
        });
      }
    }, [info.otpSent, navigation, dispatch, state.aadhaarNumber])
  );

  const toggleAadhaarVisibility = useCallback(() => {
    setState((prev) => ({ ...prev, isAadhaarVisible: !prev.isAadhaarVisible }));
  }, []);

  const toggleConfirmAadhaarVisibility = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isConfirmAadhaarVisible: !prev.isConfirmAadhaarVisible,
    }));
  }, []);

  const handleImageUpload = useCallback(async (setImageUri) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted) {
      const response = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!response.canceled) {
        setImageUri(response.assets[0].uri);
      }
    }
  }, []);

  const handleRemoveImage = useCallback((setImageUri) => {
    setImageUri(null);
  }, []);

  const validateForm = useCallback(() => {
    let isValid = true;

    const trimmedAadhaar = state.aadhaarNumber?.trim();
    const trimmedConfirmAadhaar = state.confirmAadhaarNumber?.trim();
    const trimmedCaptcha = state.captchaText?.trim();

    if (!trimmedAadhaar || trimmedAadhaar.length !== 12) {
      setState((prev) => ({
        ...prev,
        aadhaarError: "Check your Aadhar number and try again.",
      }));
      isValid = false;
    }

    if (!trimmedConfirmAadhaar || trimmedConfirmAadhaar.length !== 12) {
      setState((prev) => ({
        ...prev,
        confirmAadhaarError: "Please check your Aadhar number.",
      }));
      isValid = false;
    } else if (trimmedAadhaar !== trimmedConfirmAadhaar) {
      setState((prev) => ({
        ...prev,
        aadhaarError: "Aadhar numbers do not match.",
        confirmAadhaarError: "Aadhar numbers do not match.",
      }));
      isValid = false;
    }

    if (!trimmedCaptcha || trimmedCaptcha.length !== 5) {
      setState((prev) => ({
        ...prev,
        captchaError: "Please correct the captcha code.",
      }));
      isValid = false;
    }

    if (!state.isAgreed) {
      setState((prev) => ({
        ...prev,
        agreementError: "You must agree to the terms and conditions.",
      }));
      isValid = false;
    }

    return isValid;
  }, [
    state.aadhaarNumber,
    state.confirmAadhaarNumber,
    state.captchaText,
    state.isAgreed,
  ]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    console.log("Aadhaar Number:", state.aadhaarNumber);
    console.log("Front Image URI:", state.frontImageUri);
    console.log("Back Image URI:", state.backImageUri);
    console.log("Captcha:", state.captchaText);
    console.log("Is Agreed:", state.isAgreed);
    // dispatch(testApi());
    dispatch(
      genrateOtp({
        aadhaar_number: state.aadhaarNumber,
        captcha: state.captchaText,
      })
    );
  }, [
    validateForm,
    state.aadhaarNumber,
    state.frontImageUri,
    state.backImageUri,
    state.captchaText,
    state.isAgreed,
    dispatch,
  ]);

  const renderImageUploadSection = useCallback(
    (label, imageUri, setImageUri, removeImageUri) => (
      <>
        <Text style={styles.uploadLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleImageUpload(setImageUri)}
        >
          <Text style={styles.uploadButtonText}>Capture {label}</Text>
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveImage(removeImageUri)}
          >
            <Text style={styles.removeButtonText}>Remove {label} Image</Text>
          </TouchableOpacity>
        )}
      </>
    ),
    [handleImageUpload, handleRemoveImage]
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.stepTitle}>Aadhar Card Details</Text>
        <Text style={styles.stepDescription}>
          Please upload both the front and back of your Aadhar card and provide
          the Aadhar number to complete the KYC process.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Aadhar Number"
            maxLength={12}
            value={state.aadhaarNumber}
            onChangeText={(text) =>
              setState((prev) => ({ ...prev, aadhaarNumber: text }))
            }
            keyboardType="number-pad"
            secureTextEntry={!state.isAadhaarVisible}
          />
          <TouchableOpacity
            onPress={toggleAadhaarVisibility}
            style={styles.eyeIcon}
          >
            <Entypo
              name={state.isAadhaarVisible ? "eye" : "eye-with-line"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {state.aadhaarError && (
          <Text style={styles.errorText}>{state.aadhaarError}</Text>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Re-Enter Aadhar Number"
            value={state.confirmAadhaarNumber}
            maxLength={12}
            onChangeText={(text) =>
              setState((prev) => ({ ...prev, confirmAadhaarNumber: text }))
            }
            keyboardType="number-pad"
            secureTextEntry={!state.isConfirmAadhaarVisible}
          />
          <TouchableOpacity
            onPress={toggleConfirmAadhaarVisibility}
            style={styles.eyeIcon}
          >
            <Entypo
              name={state.isConfirmAadhaarVisible ? "eye" : "eye-with-line"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {state.confirmAadhaarError && (
          <Text style={styles.errorText}>{state.confirmAadhaarError}</Text>
        )}

        {/* {renderImageUploadSection(
          'Front',
          state.frontImageUri,
          setState,
          (prev) => ({ ...prev, frontImageUri: null })
        )}
        {renderImageUploadSection(
          'Back',
          state.backImageUri,
          setState,
          (prev) => ({ ...prev, backImageUri: null })
        )} */}

        <View style={styles.captchaContainer}>
          {captchData?.data?.data?.captcha ? (
            <Image
              style={styles.captchaImage}
              source={{
                uri: `data:image/png;base64,${captchData?.data?.data?.captcha}`,
              }}
            />
          ) : (
            <Image
              style={styles.captchaImage}
              source={require("../assets/CAPTCHA.jpg")}
            />
          )}
          <TouchableOpacity
            style={{ marginRight: 6 }}
            onPress={() => setRefreshCatpcha(true)}
          >
            <Icon name="refresh" size={30} color="green" />
          </TouchableOpacity>
          <TextInput
            style={styles.captchaInput}
            placeholder="Enter captcha code"
            onChangeText={(text) =>
              setState((prev) => ({ ...prev, captchaText: text }))
            }
          />
        </View>
        {state.captchaError && (
          <Text style={styles.errorText}>{state.captchaError}</Text>
        )}

        <View style={styles.agreementContainer}>
          <TouchableOpacity
            onPress={() =>
              setState((prev) => ({ ...prev, isAgreed: !prev.isAgreed }))
            }
          >
            <View
              style={[
                styles.checkbox,
                state.isAgreed && styles.checkedCheckbox,
              ]}
            >
              {state.isAgreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
          <Text style={styles.agreementText}>
            I hereby agree that the above documents belong to me and voluntarily
            give my consent to Lucreway Pay Pvt Ltd to
            utilize them as my address proof for KYC.
          </Text>
        </View>
        {state.agreementError && (
          <Text style={styles.errorText}>{state.agreementError}</Text>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            size="small"
            color={Theme.colors.primary}
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#F8F8F8", padding: 20 },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  stepDescription: { fontSize: 14, color: "#666", marginBottom: 15 },
  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: { flex: 1, padding: 10 },
  eyeIcon: { padding: 10 },
  uploadLabel: { fontSize: 14, color: "#333", marginBottom: 10 },
  uploadButton: {
    backgroundColor: "#5F259F",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButtonText: { color: "#fff", fontWeight: "bold" },
  captchaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  captchaImage: {
    width: 100,
    height: 40,
    resizeMode: "contain",
    marginRight: 10,
  },
  captchaInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    width: "60%",
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#blue",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "white",
  },
  checkedCheckbox: { backgroundColor: "green" },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  agreementText: {
    fontSize: 12,
    lineHeight: 20,
    flexWrap: "wrap",
    flex: 1,
    color: "#333",
  },
  errorText: { color: "red", fontSize: 12, marginTop: -10, marginBottom: 10 },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  removeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  removeButtonText: { color: "#fff", fontWeight: "bold" },
});

export default Profile;
