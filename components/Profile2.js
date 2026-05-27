import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Theme from "./Theme";

const Profile2 = ({ route, navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const { step1Completed } = route.params || { step1Completed: false };
  const [step2Completed, setStep2Completed] = useState(false);

  const handleImageUpload = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaType: ImagePicker.MediaTypeOptions.Photo,
      });
      if (!response.cancelled) {
        setImageUri(response.uri);
      }
    }
  };

  const handleSubmit = () => {
    console.log("Image URI:", imageUri);
    console.log("Is Agreed:", isAgreed);

    setStep2Completed(true);
    navigation.navigate("Profile3", { step2Completed: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressStep, step1Completed && styles.activeStep]}
        >
          <Text style={styles.progressStepText}>1</Text>
        </View>

        <View
          style={[styles.progressLine, step1Completed && styles.activeLine]}
        />

        <View style={[styles.progressStep, styles.activeStep]}>
          <Text style={styles.progressStepText}>2</Text>
        </View>

        <View
          style={[styles.progressLine, step2Completed && styles.activeLine]}
        />

        <View style={styles.progressStep}>
          <Text style={styles.progressStepText}>3</Text>
        </View>
        <View style={styles.progressStep}>
          <Text style={styles.progressStepText}>4</Text>
        </View>
        <View style={styles.progressStep}>
          <Text style={styles.progressStepText}>5</Text>
        </View>
        <View style={styles.progressStep}>
          <Text style={styles.progressStepText}>6</Text>
        </View>
      </View>

      <Text style={styles.stepTitle}>Aadhaar Card (Back)</Text>

      <Text style={styles.stepDescription}>
        Please upload your Aadhaar card back below for completing your first
        step of KYC.
      </Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadButtonText}>Upload +</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <View style={styles.agreementContainer}>
        <TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
          <View style={[styles.checkbox, isAgreed && styles.checkedCheckbox]}>
            {isAgreed && <View style={styles.checkboxCheck} />}
          </View>
        </TouchableOpacity>
        <Text style={styles.agreementText}>
          I hereby agree that the above document belongs to me and voluntarily
          give my consent to Fourdegreewater Capital Pvt Ltd (Win Wealth) to
          utilize it as my address proof for KYC on Punjab only.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={!isAgreed}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

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
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  activeStep: {
    backgroundColor: Theme.colors.primary,
    borderColor: "black",
  },
  progressStepText: {
    color: Theme.colors.secondary,
  },
  progressLine: {
    width: 50,
    height: 2,
    backgroundColor: Theme.colors.primary,
    marginLeft: -20,
  },
  activeLine: {
    backgroundColor: Theme.colors.primary,
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
  uploadButton: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  uploadButtonText: {
    color: Theme.colors.secondary,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: 15,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: Theme.colors.secondary,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: "#FF5722",
  },
  checkboxCheck: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: Theme.colors.secondary,
  },
  agreementContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  agreementText: {
    fontSize: 12,
    color: "#666",
  },
});

export default Profile2;
