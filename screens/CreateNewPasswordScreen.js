import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSetPassword,
  userPassword,
} from "../src/features/userRegister/RegisterSlice";
import Theme from "../components/Theme";

const CreateNewPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [error, setError] = useState("");
  const [Username, setUserName] = useState("");

  const navigation = useNavigation();
  const setPassword = useSelector((state) => state.register.setPassword);
  const dispatch = useDispatch();

  useEffect(() => {
    if (setPassword === "success") {
      dispatch(resetSetPassword());
      navigation.navigate("VerificationCompleted");
    }
  }, [setPassword, navigation]);

  // Toggle Password Visibility
  const togglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setIsConfirmPasswordVisible((prev) => !prev);
  }, []);

  // Handle Password Input Change
  const handlePasswordChange = (text) => {
    setNewPassword(text);
    setError(""); // Clear error dynamically
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setError(""); // Clear error dynamically
  };

  // Handle Continue Button Click
  const handleContinue = () => {
    if (
      newPassword.length < 8 ||
      !/\d/.test(newPassword) ||
      !/[a-zA-Z]/.test(newPassword)
    ) {
      setError(
        "Password must be at least 8 characters, including a letter and a number."
      );
      return;
    }
    if (Username.length < 2) {
      setError("Name should be at least 3 character.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    } else {
      data = {
        password: newPassword,
        fname: Username,
      };

      dispatch(userPassword(data));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create new password</Text>

      {/* New Password Input */}
      <Text style={styles.label}>User Name</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { height: 45 }]}
          placeholder="Enter the Name"
          value={Username}
          onChangeText={setUserName}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        ></TouchableOpacity>
      </View>
      <Text style={styles.label}>Enter Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your new password"
          secureTextEntry={!isPasswordVisible}
          value={newPassword}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={!isPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <Text style={styles.label}>Confirm password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry={!isConfirmPasswordVisible}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
        <TouchableOpacity
          onPress={toggleConfirmPasswordVisibility}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={!isConfirmPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.passwordRequirements}>
        At least 8 characters, containing a letter and a number
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleContinue}
        disabled={setPassword === "pending"}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {setPassword !== "pending" ? (
            <Text style={styles.buttonText}>Continue</Text>
          ) : (
            <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  passwordRequirements: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
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

export default CreateNewPasswordScreen;
