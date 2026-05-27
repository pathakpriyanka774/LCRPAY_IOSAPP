import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function FingerPrint() {
  const navigation = useNavigation();
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const alertComponent = (title, message, buttonText, buttonFunc) => {
    return Alert.alert(title, message, [
      {
        text: buttonText,
        onPress: buttonFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    if (!isBiometricAvailable) {
      return alertComponent(
        "Please enter your password",
        "Biometric auth not supported",
        "OK",
        () => console.log("Fallback to password")
      );
    }

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

    if (!savedBiometrics) {
      return alertComponent(
        "Biometric record not found",
        "Please login with your password",
        "OK",
        () => console.log("Fallback to password")
      );
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login using Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (biometricAuth.success) {
      navigation.replace("HomeScreen"); // Redirect after successful authentication
    }
  };

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Welcome to My App</Text>
        <Text style={styles.subtitleText}>
          {isBiometricSupported
            ? "Your device supports Biometrics"
            : "Face or Fingerprint scanner is not available on this device"}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => console.log("Login with Password")}
        >
          <Text style={styles.loginButtonText}>Login with Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleBiometricAuth}
          style={styles.fingerprintButton}
        >
          <Entypo name="fingerprint" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  titleContainer: {
    marginBottom: 48,
  },
  titleText: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#2D3748", // gray-800
  },
  subtitleText: {
    textAlign: "center",
    fontSize: 16,
    color: "#718096", // gray-600
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  loginButton: {
    borderRadius: 8,
    backgroundColor: "#3182CE", // blue-600
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  fingerprintButton: {
    borderRadius: 50,
    padding: 16,
    backgroundColor: "#3182CE", // blue-600
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
