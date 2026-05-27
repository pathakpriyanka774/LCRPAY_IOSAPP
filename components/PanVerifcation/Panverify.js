import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import Theme from "../Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../utils/config";

const SECONDARY_COLOR = "#4b5563"; // Subtle gray

const Panverify = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    panName: "",
    panNumber: "",
    imageUri: null,
  });
  const [loading, setLoading] = useState(false);

  const isValidPan = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim());

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "panNumber" ? value.toUpperCase().trim() : value,
    }));
  };

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        alert("Camera permission is required to capture PAN card image");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setFormData((prev) => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      alert("Failed to capture image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!formData.panName.trim()) {
      alert("Please enter your name as per PAN card");
      return;
    }

    if (!formData.panNumber || !isValidPan(formData.panNumber)) {
      alert("Please enter a valid PAN number (e.g., ABCDE1234F)");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found.");
      }

      const uploadData = new FormData();

      if (formData.imageUri) {
        const frontImage = {
          uri: formData.imageUri,
          type: "image/jpeg",
          name: "pan_front.jpg",
        };
        uploadData.append("pan_front", frontImage);
      } else {
        throw new Error("Front image is missing.");
      }

      uploadData.append("name", formData.panName);
      uploadData.append("pan_no", formData.panNumber);

      console.log(formData);

      // const ntoken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MzIzOTE4ODg5IiwidXNlcklkIjoiNTEiLCJleHAiOjQ4OTM0OTk5MzR9.5OEqxf6tch_-odUXiRnfGTa-SId3wsnSffLZ15bCly8`

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        `${BASE_URL}/pankyc/`,
        uploadData,
        { headers }
      );
      setLoading(false);

      console.log("Server Response:", response.data);

      if (response.status === 200) {
        Alert.alert("Success", "PAN Verification submitted successfully!");
        navigation.navigate("Profile4");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error submitting PAN verification:", error);
      Alert.alert(
        "Error",
        "Failed to submit PAN verification. Please try again."
      );
      setLoading(false);
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
            <Entypo name="credit-card" size={32} color={Theme.colors.primary} />
          </View>
          <Text style={styles.title}>PAN Verification</Text>
          <Text style={styles.description}>
            Please provide your PAN card details for verification
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Name as per PAN Card</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={formData.panName}
                onChangeText={(text) => handleInputChange("panName", text)}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>PAN Card Number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChangeText={(text) => handleInputChange("panNumber", text)}
                maxLength={10}
                autoCapitalize="characters"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.label}>PAN Card Image</Text>
            <TouchableOpacity
              style={[
                styles.uploadButton,
                formData.imageUri && styles.uploadButtonWithImage,
              ]}
              onPress={handleImageUpload}
            >
              {formData.imageUri ? (
                <Image
                  source={{ uri: formData.imageUri }}
                  style={styles.imagePreview}
                />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Entypo
                    name="camera"
                    size={32}
                    color={Theme.colors.primary}
                  />
                  <Text style={styles.uploadText}>Tap to Capture PAN Card</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
              <Text style={styles.submitButtonText}>Verify PAN</Text>
            ) : (
              ""
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate("Profile4")}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Need help? Contact us on WhatsApp for assistance
          </Text>
        </View>

        {/* {loading && (
                    <View style={styles.loadingOverlay}>
                        <View style={styles.loadingCard}>
                            <ActivityIndicator size="large" color={Theme.colors.primary} />
                            <Text style={styles.loadingText}>Verifying PAN details...</Text>
                        </View>
                    </View>
                )} */}
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
    backgroundColor: "#ecfdf5",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  imageSection: {
    marginTop: 8,
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
  submitButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  skipButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButtonText: {
    color: SECONDARY_COLOR,
    fontSize: 16,
    fontWeight: "500",
  },
  helpText: {
    fontSize: 14,
    color: SECONDARY_COLOR,
    textAlign: "center",
    marginTop: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
  },
});

export default Panverify;
