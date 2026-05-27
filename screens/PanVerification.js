import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import Theme from "../components/Theme";

const PanVerification = () => {
  const route = useRoute();
  const { phoneNumber } = route.params;
  const navigation = useNavigation();
  const predefinedOtp = "123456";
  const [code, setCode] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef([]);

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

  const handleCodeChange = (index, text) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
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

  const handleOtpSubmit = () => {
    const enteredOtp = code.join("");
    if (enteredOtp === predefinedOtp) {
      navigation.navigate("Profile4");
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      console.log("Resend code to:", phoneNumber);
      setTimer(45);
      setCanResend(false);
    }
  };

  const circleLength = 2 * Math.PI * 15;
  const dashOffset = circleLength * (1 - timer / 45);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>We just sent an OTP</Text>
      <Text style={styles.description}>
        Enter the security code we sent to {phoneNumber}
      </Text>
      <View style={styles.codeInputContainer}>
        {code.map((value, index) => (
          <TextInput
            key={index}
            ref={(input) => (inputsRef.current[index] = input)}
            style={styles.codeInput}
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
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't get the code?</Text>
        <View style={styles.resendRight}>
          <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
            <Text
              style={[styles.resendLink, !canResend && styles.disabledText]}
            >
              Resend it
            </Text>
          </TouchableOpacity>
          {timer > 0 && (
            <View style={styles.timerContainer}>
              <Text style={styles.timer}>{timer}s</Text>
              <Svg width={25} height={25} viewBox="0 0 50 50">
                <Circle
                  cx="25"
                  cy="25"
                  r="15"
                  stroke="#e6e6e6"
                  strokeWidth="4"
                  fill="transparent"
                />
                <Circle
                  cx="25"
                  cy="25"
                  r="15"
                  stroke="#8A2BE2"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circleLength}
                  strokeDashoffset={dashOffset}
                />
              </Svg>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
        <Text style={styles.buttonText}>Done</Text>
      </TouchableOpacity>
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
    borderColor: Theme.colors.primary,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resendText: { flex: 1 },
  resendRight: { flexDirection: "row", alignItems: "center" },
  resendLink: { color: Theme.colors.primary },
  disabledText: { color: "#aaa" },
  timerContainer: { flexDirection: "row", alignItems: "center", marginLeft: 5 },
  timer: { marginLeft: 5 },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: Theme.colors.secondary,
    textAlign: "center",
    fontSize: 18,
  },
});

export default PanVerification;
