import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyAadharOtp,
  setOtpSent,
  testApi,
} from "../src/features/aadharKyc/AadharSlice";
import Theme from "../components/Theme";

const AadharOtp = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loading = useSelector((state) => state.aadhar.loading);
  const otpSent = useSelector((state) => state.aadhar.otpSent);
  const error = useSelector((state) => state.aadhar.error);
  const AadharData = useSelector((state) => state.aadhar.AadharData);
  const { aadhaar_number } = route.params;

  const [code, setCode] = useState(Array(6).fill(""));
  const [inputError, setInputError] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (AadharData?.success) {
      console.log(
        "Addhar Data succes now  navigating to the----> AadharDetails"
      );
      navigation.replace("AadhaarDetailsWb");
      dispatch(setOtpSent(false)); // Reset otpSent after navigation
    }
  }, [AadharData]);

  const handleCodeChange = (index, text) => {
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = text;
      return newCode;
    });

    if (text && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && code[index] === "") {
      if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };


  console.log("AadharData",AadharData)

  const handleOtpSubmit = () => {
    const enteredOtp = code.join("");
    if (enteredOtp.length === 6) {
      setInputError(false);
      dispatch(
        verifyAadharOtp({ otp: enteredOtp, aadhar_number: aadhaar_number })
      );
      // dispatch(testApi());
    } else {
      setInputError(true);
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
    }
  };

  const handleResendCode = () => {
    Alert.alert("Code Resent", `A new OTP has been sent to Mobile no link with Aadhaar ${aadhaar_number}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>We just sent an OTP</Text>
      <Text style={styles.description}>
        Enter the security code we sent to Mobile no link with Aadhaar {aadhaar_number}
      </Text>

      <View style={styles.codeInputContainer}>
        {code.map((value, index) => (
          <TextInput
            key={index}
            ref={(input) => (inputsRef.current[index] = input)}
            style={[styles.codeInput, inputError ? styles.errorBorder : null]}
            maxLength={1}
            keyboardType="number-pad"
            value={value}
            onChangeText={(text) => handleCodeChange(index, text)}
            onKeyPress={({ nativeEvent: { key } }) =>
              handleKeyPress(index, key)
            }
          />
        ))}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.resendContainer}>
        <Text style={styles.resendLeft}>Didn't get the code? </Text>
        <TouchableOpacity onPress={handleResendCode}>
          <Text style={styles.resendLink}>Resend it</Text>
        </TouchableOpacity>
        <Text style={styles.timer}> 45s</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>

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
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F0F0F0" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  description: { marginBottom: 20, color: "#888" },
  codeInputContainer: { flexDirection: "row", justifyContent: "space-between" },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  resendLeft: { flex: 1 },
  resendRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  resendLink: { color: "green" },
  disabledText: { color: "#aaa" },
  timerContainer: { flexDirection: "row", alignItems: "center" },
  timer: { marginLeft: 5 },
  timerCircleContainer: { marginLeft: 5 },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 18 },
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

  errorText:{
    color:"red",
    marginTop:15
  }
});

export default AadharOtp;
