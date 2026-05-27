import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Theme from "../components/Theme";
import { userVerifyOtp } from "../src/features/userRegister/RegisterSlice";

const ForgotPasswordScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const info = useSelector((state) => state.register);

  // Timer for resending OTP
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendCode = () => {
    if (canResend) {
      console.log("Resend code");
      setTimer(45);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleOtpChange = (text, index) => {
    if (!/^\d*$/.test(text)) return; // Only allow numeric input

    const newOtp = [...otp];
    newOtp[index] = text;

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setOtp(newOtp);
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (otp.some((digit) => digit === "")) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const cleanPhoneNumber = phoneNumber.replace(/^\+91/, "");
    const otpCode = otp.join(""); // Convert array to string

    dispatch(userVerifyOtp({ phoneNumber: cleanPhoneNumber, otp: otpCode }))
      .then(() => setIsSubmitting(false))
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (!info.loading && isSubmitting) {
      if (info.Register?.status === "success") {
        const user = info.Register?.UserID || info.Register?.user;

        if (user?.PasswordHash) {
          navigation.navigate("SetForgotPassword");
        } else {
          navigation.navigate("SetForgotPassword");
        }
      } else {
        setError(info.error || "Invalid OTP. Please try again.");
      }

      setIsSubmitting(false);
    }
  }, [info, isSubmitting, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.description}>
        Please enter the code sent to {phoneNumber}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleOtpKeyPress(e, index)}
          />
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't get the code?</Text>
        <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
          <Text style={[styles.resendLink, !canResend && styles.disabledText]}>
            Resend it
          </Text>
        </TouchableOpacity>
        <Text style={styles.timer}>{timer > 0 ? ` ${timer}s` : ""}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Verifying..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  description: { marginBottom: 20, color: "#888", textAlign: "center" },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  errorText: { color: "red", marginBottom: 10 },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  resendText: { marginRight: 5 },
  resendLink: { color: "#007bff" },
  disabledText: { color: "#aaa" },
  timer: { marginLeft: 5 },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: Theme.colors.secondary,
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
