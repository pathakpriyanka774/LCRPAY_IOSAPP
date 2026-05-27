import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import Theme from "../Theme";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Landmark } from "lucide-react-native";

const { width } = Dimensions.get("window");
const THEME_COLOR = Theme.colors.primary;
const DEFAULT_OTP = "123456";

const AddBankAccount = () => {
  const navigation = useNavigation();

  const inputRefs = useRef([]);
  const [state, setState] = useState({
    fullName: "",
    mobileNumber: "",
    isOtpSent: false,
    timer: 30,
    errors: {
      fullName: "",
      mobileNumber: "",
      otp: "",
    },
  });

  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (state.isOtpSent && state.timer > 0) {
      interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timer: prev.timer - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isOtpSent, state.timer]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // If user pastes a full OTP
      const otpArray = value.slice(0, 6).split("");
      setOtpValues(otpArray.concat(new Array(6 - otpArray.length).fill("")));
      return;
    }

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && index > 0 && otpValues[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateForm = useCallback(() => {
    const errors = {};

    if (!state.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!state.mobileNumber || state.mobileNumber.length !== 10) {
      errors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    setState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  }, [state.fullName, state.mobileNumber]);

  const handleSendOtp = useCallback(() => {
    // if (validateForm()) {
    //     setState(prev => ({
    //         ...prev,
    //         isOtpSent: true,
    //         timer: 30
    //     }));
    //     setOtpValues(['', '', '', '', '', '']);
    SendOTP();
    // }
  }, [validateForm]);

  const handleVerifyOtp = useCallback(() => {
    const enteredOtp = otpValues.join("");

    if (enteredOtp.length !== 6) {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, otp: "Please enter complete OTP" },
      }));
      return;
    }

    if (enteredOtp === DEFAULT_OTP) {
      setState((prev) => ({
        ...prev,
        isOtpSent: false,
        fullName: "",
        mobileNumber: "",
        errors: {},
      }));
      setOtpValues(["", "", "", "", "", ""]);
      // alert('Bank account linked successfully!');
    } else {
      setState((prev) => ({
        ...prev,
        errors: { ...prev.errors, otp: "Invalid OTP. Please try again." },
      }));
    }
  }, [otpValues]);

  const handleInputChange = useCallback((field, value) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: "" },
    }));
  }, []);

  // ================================================================================================================
  // Send OTP
  // ================================================================================================================
  const [loading, setLoading] = useState(false);
  const SendOTP = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Ensure correct format
      };

      const requestData = {
        phone_number: state.mobileNumber,
        full_name: state.fullName,
      };

      const response = await axios.post(
        `${BASE_URL}/payments/send_otp_phone_number`,
        requestData,
        { headers }
      );

      console.log("response is", response.data);
      if (response.data.status === true) {
        navigation.navigate("ToSelf", { insID: response.data.insID });
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
            <Landmark
              size={24}
              color={Theme.colors.primary}
              style={styles.icon}
            />
          </View>
          <Text style={styles.title}>Link Bank Account</Text>
          <Text style={styles.subtitle}>
            Securely connect your bank account for seamless transactions
          </Text>
        </View>

        <View style={styles.formCard}>
          {!state.isOtpSent ? (
            <>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <View
                  style={[
                    styles.inputContainer,
                    state.errors.fullName && styles.inputError,
                  ]}
                >
                  <MaterialIcons name="person" size={24} color="#9ca3af" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={state.fullName}
                    onChangeText={(text) => handleInputChange("fullName", text)}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {state.errors.fullName && (
                  <Text style={styles.errorText}>{state.errors.fullName}</Text>
                )}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Mobile Number</Text>
                <View
                  style={[
                    styles.inputContainer,
                    state.errors.mobileNumber && styles.inputError,
                  ]}
                >
                  <MaterialIcons name="phone" size={24} color="#9ca3af" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 10-digit mobile number"
                    keyboardType="numeric"
                    maxLength={10}
                    value={state.mobileNumber}
                    onChangeText={(text) =>
                      handleInputChange("mobileNumber", text)
                    }
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                {state.errors.mobileNumber && (
                  <Text style={styles.errorText}>
                    {state.errors.mobileNumber}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSendOtp}
              >
                <Text style={styles.submitButtonText}>Send OTP</Text>
                <MaterialIcons name="arrow-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.otpContainer}>
              <Text style={styles.otpTitle}>Verify OTP</Text>
              <Text style={styles.otpDescription}>
                Enter the 6-digit code sent to {state.mobileNumber}
              </Text>

              <View style={styles.otpInputContainer}>
                {otpValues.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      state.errors.otp && styles.otpInputError,
                      value && styles.otpInputFilled,
                    ]}
                    keyboardType="numeric"
                    maxLength={6}
                    value={value}
                    onChangeText={(text) => handleOtpChange(index, text)}
                    onKeyPress={({ nativeEvent: { key } }) =>
                      handleKeyPress(index, key)
                    }
                  />
                ))}
              </View>
              {state.errors.otp && (
                <Text style={styles.errorText}>{state.errors.otp}</Text>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleVerifyOtp}
              >
                <Text style={styles.submitButtonText}>Verify OTP</Text>
                <MaterialIcons name="verified-user" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.resendButton,
                  state.timer > 0 && styles.resendButtonDisabled,
                ]}
                onPress={state.timer === 0 ? handleSendOtp : null}
                disabled={state.timer > 0}
              >
                <Text
                  style={[
                    styles.resendButtonText,
                    state.timer > 0 && styles.resendButtonTextDisabled,
                  ]}
                >
                  Resend OTP {state.timer > 0 ? `(${state.timer}s)` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.securityInfo}>
          <MaterialIcons name="security" size={20} color="#4b5563" />
          <Text style={styles.securityText}>
            Your information is encrypted and secure with us
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 24,
  },
  formCard: {
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
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    width: "100%",
    paddingHorizontal: 16,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fff",
    color: "#1f2937",
  },
  otpInputError: {
    borderColor: "#ef4444",
  },
  otpInputFilled: {
    borderColor: THEME_COLOR,
    backgroundColor: "#f0f9ff",
  },
  submitButton: {
    paddingHorizontal: 25,
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  otpContainer: {
    alignItems: "center",
  },
  otpTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  otpDescription: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 24,
    textAlign: "center",
  },
  resendButton: {
    marginTop: 16,
    padding: 8,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    color: THEME_COLOR,
    fontSize: 14,
    fontWeight: "500",
  },
  resendButtonTextDisabled: {
    color: "#9ca3af",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  securityText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4b5563",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AddBankAccount;
