import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux"; // ✅ Added useSelector
import {
  emailGenerateOtp,
  resetOtpState,
} from "../src/features/userRegister/RegisterSlice";
import Theme from "./Theme";

const Profile4 = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const dispatch = useDispatch();

  const info = useSelector((state) => state.register);
  const loading = useSelector((state) => state.register.loading);

  useEffect(() => {
    if (info.otpSent) {
      dispatch(resetOtpState());
      navigation.navigate("EmailVerification", { email });
    }
  }, [info.otpSent, dispatch, navigation]); // ✅ Added dependencies

  const handleSubmit = () => {
    if (!email || !confirmEmail) {
      Alert.alert("Error", "Please enter and confirm your email.");
      return;
    }

    if (email !== confirmEmail) {
      Alert.alert("Error", "Emails do not match.");
      return;
    }

    console.log("Email:", email);
    console.log("Re-Entered Email:", confirmEmail);

    dispatch(emailGenerateOtp(email));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Email Verification</Text>

      <Text style={styles.stepDescription}>
        Please enter your Email Address.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Re-Enter Email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      )}

      <Text style={styles.helpText}>
        If you are facing any difficulties, please get in touch with us on
        WhatsApp.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
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
});

export default Profile4;
