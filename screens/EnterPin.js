import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "../components/Theme";

const EnterPin = () => {
  const predefinedPin = "123456";
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigation = useNavigation();

  const handlePinChange = (index, value) => {
    const newPin = [...pin];
    newPin[index] = value;

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    setPin(newPin);
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && index > 0 && pin[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const enteredPin = pin.join("");
    Keyboard.dismiss();

    if (enteredPin === predefinedPin) {
      navigation.navigate("HomeScreen");
    } else {
      Alert.alert("Error", "Incorrect PIN. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Welcome back Ramaera!</Text>
      <Text style={styles.message}>Please enter your last PIN</Text>

      <View style={styles.pinInputContainer}>
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.pinInput}
            keyboardType="numeric"
            maxLength={1}
            secureTextEntry={true}
            onChangeText={(value) => handlePinChange(index, value)}
            onKeyPress={({ nativeEvent: { key } }) =>
              handleKeyPress(index, key)
            }
            value={digit}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.forgotPinButton}>
        <Text style={styles.forgotPinButtonText}>Forgot PIN?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.colors.secondary,
    justifyContent: "flex-start",
    paddingTop: "10%",
  },
  welcomeMessage: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    marginBottom: 30,
  },
  pinInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  pinInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 24,
  },
  forgotPinButton: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotPinButtonText: {
    color: "blue",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: Theme.colors.secondary,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EnterPin;
