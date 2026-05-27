import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { panVerification } from "../src/features/aadharKyc/AadharSlice";
import { ActivityIndicator } from "react-native-paper";
import Theme from "./Theme";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const Profile3 = ({ navigation }) => {
  const dispatch = useDispatch();
  const info = useSelector((state) => state.aadhar);

  const [panNumber, setPanNumber] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidPan = useMemo(() => PAN_REGEX.test(panNumber), [panNumber]);

  // Navigate when PAN verification says true & not loading
  useEffect(() => {
    if (info.PanData === true && info.loading === false) {
      // navigation.replace("PanDetailsWb", { phoneNumber: "1234567890" });

      navigation.replace("PanDetailsWb");
    }
  }, [info.PanData, info.loading, navigation]);

  // --- Input handlers ---
  const handlePanNumberChange = (text) => {
    // Uppercase, remove anything that's not A–Z or 0–9, clamp to 10 chars
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setPanNumber(cleaned);
  };

  const handlePanBlur = () => setTouched(true);

  const handleSubmit = () => {
    setTouched(true);
    if (!isValidPan) return; // button stays disabled anyway
    dispatch(panVerification({ pan_number: panNumber }));
  };



  // UI state
  const showError = touched && panNumber.length === 10 && !isValidPan;
  const showHelper = !touched || panNumber.length < 10;
  const inputStyle = [
    styles.input,
    showError && styles.inputError,
    isValidPan && panNumber.length === 10 && styles.inputSuccess,
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>PAN Card</Text>
      <Text style={styles.stepDescription}>
        Please enter your PAN card number.
      </Text>

      {/* PAN Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={inputStyle}
          placeholder="ABCDE1234F"
          placeholderTextColor="#9AA0A6"
          value={panNumber}
          onChangeText={handlePanNumberChange}
          onBlur={handlePanBlur}
          maxLength={10}
          autoCapitalize="characters"
          autoCorrect={false}
          keyboardType="visible-password" // avoids email/phone keyboards
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          accessibilityLabel="PAN Number"
        />
        {panNumber.length > 0 && (
          <TouchableOpacity
            onPress={() => setPanNumber("")}
            style={styles.clearChip}
            accessibilityLabel="Clear PAN"
          >
            <Text style={styles.clearChipText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Helper / Error */}
      {showHelper && (
        <Text style={styles.helperText}>
          Format: <Text style={{ fontFamily: "monospace" }}>AAAAA9999A</Text>
        </Text>
      )}
      {showError && (
        <Text style={styles.errorText}>
          Invalid PAN. Expected format like ABCDE1234F.
        </Text>
      )}
      {isValidPan && panNumber.length === 10 && (
        <Text style={styles.successText}>Looks good ✅</Text>
      )}



      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitButton, !isValidPan && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!isValidPan || info.loading}
      >
        <Text style={styles.submitButtonText}>
          {info.loading ? "Verifying..." : "Submit"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.helpText}>
        If you face any difficulty, please reach us on WhatsApp.
      </Text>

      {info.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", padding: 20 },
  stepTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#1F2937" },
  stepDescription: { fontSize: 14, color: "#6B7280", marginBottom: 16 },

  inputRow: { position: "relative", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    letterSpacing: 1,
  },
  inputError: { borderColor: "#EF4444", shadowColor: "#EF4444" },
  inputSuccess: { borderColor: "#10B981" },

  helperText: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  errorText: { fontSize: 12, color: "#DC2626", marginBottom: 8 },
  successText: { fontSize: 12, color: "#059669", marginBottom: 8 },

  clearChip: {
    position: "absolute",
    right: 8,
    top: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  clearChipText: { fontSize: 12, color: "#4B5563", fontWeight: "600" },

  uploadButton: {
    backgroundColor: Theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 14,
  },
  uploadButtonText: { color: "#fff", fontWeight: "700" },

  imagePreview: { width: "100%", height: 200, borderRadius: 10, marginBottom: 14 },

  submitButton: {
    backgroundColor: Theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: "#fff", fontWeight: "700" },

  helpText: { fontSize: 12, color: "#6B7280", marginTop: 12 },

  loadingOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default Profile3;
