// screens/FileComplaint.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Theme from "../components/Theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {SafeAreaView} from 'react-native-safe-area-context';

const FileComplaint = ({ navigation }) => {
  const [problem, setProblem] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  const [complaintType, setComplaintType] = useState("transaction");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null); // will store selected value
  const [items, setItems] = useState([
    {
      label: "Transaction Successful, Amount Debited but services not received",
      value: "Transaction Successful, Amount Debited but services not received",
    },
    {
      label:
        "Transaction Successful, Amount Debited but Service Disconnected or Service Stopped",
      value:
        "Transaction Successful, Amount Debited but Service Disconnected or Service Stopped",
    },
    {
      label:
        "Transaction Successful, Amount Debited but Late Payment Surcharge Charges add in next bill",
      value:
        "Transaction Successful, Amount Debited but Late Payment Surcharge Charges add in next bill",
    },
    {
      label: "Erroneously paid in wrong account",
      value: "Erroneously paid in wrong account",
    },
    { label: "Duplicate Payment", value: "Duplicate Payment" },
    {
      label: "Erroneously paid the wrong amount",
      value: "Erroneously paid the wrong amount",
    },
    {
      label:
        "Payment information not received from Biller or Delay in receiving payment information from the Biller",
      value:
        "Payment information not received from Biller or Delay in receiving payment information from the Biller",
    },
    {
      label: "Bill Paid but Amount not adjusted or still showing due amount",
      value: "Bill Paid but Amount not adjusted or still showing due amount",
    },
    { label: "Other, Provide detail in description", value: "Other" },
  ]);

  const [bConnectId, setBConnectId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleUploadScreenshot = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setScreenshot(result.assets[0].uri);
    }
  };

  const handleSendRequest = () => {
    if (!value) {
      Alert.alert("Error", "Please select a problem type.");
      return;
    }
    if (!problem) {
      Alert.alert("Error", "Please enter your problem in brief.");
      return;
    }

    // ✅ Instead of only alert, navigate to ComplaintSuccessScreen
    navigation.navigate("ComplaintSuccessScreen", {
      txnRefId: "CC015896DGBR36547855",
      complaintId: "CC0154896525485",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={24}
        extraHeight={Platform.OS === "android" ? 120 : 0}
      >
        {/* Radio Group */}
        <Text style={styles.label}>Type of Complaint</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setComplaintType("transaction")}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.radioOuter,
                complaintType === "transaction" && styles.radioOuterSelected,
              ]}
            >
              {complaintType === "transaction" && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.radioLabel}>Transaction Type</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown */}
        <Text style={styles.label}>Select Problem Type</Text>
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={open}
            value={value} // ✅ selected value is tracked here
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Choose an issue"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            listItemLabelStyle={styles.listItemLabel}
            textStyle={styles.textStyle}
            listMode={Platform.OS === "android" ? "MODAL" : "SCROLLVIEW"}
            zIndex={3000}
            zIndexInverse={1000}
            renderListItem={({ label, value: itemValue, index, isSelected }) => {
              const backgroundColor = index % 2 === 0 ? "#ffffff" : "#f5f5f5";
              const finalBg = isSelected ? "#d1e7ff" : backgroundColor;

              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: finalBg,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                  }}
                  onPress={() => {
                    setValue(itemValue); // ✅ correctly set the selected value
                    setOpen(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: isSelected ? "#0a58ca" : "#333",
                      fontWeight: isSelected ? "600" : "400",
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Extra Inputs */}
        <Text style={styles.label}>B-Connect Transaction ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Transaction ID"
          value={bConnectId}
          onChangeText={setBConnectId}
        />

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number"
          keyboardType="phone-pad"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          maxLength={15}
        />

        {/* Date Pickers */}
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowStartPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ color: startDate ? "#000" : "#888" }}>
            {startDate ? formatDate(startDate) : "Select Start Date"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowEndPicker(true)}
          activeOpacity={0.8}
        >
          <Text style={{ color: endDate ? "#000" : "#888" }}>
            {endDate ? formatDate(endDate) : "Select End Date"}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}

        {/* Problem Description */}
        <Text style={styles.label}>Problem in brief</Text>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          placeholder="Describe your problem"
          value={problem}
          onChangeText={setProblem}
          multiline
          textAlignVertical="top"
        />

        {/* Screenshot Upload */}
        <Text style={styles.label}>Upload Screenshot *</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUploadScreenshot}
          activeOpacity={0.8}
        >
          <Ionicons name="cloud-upload-outline" size={22} color="orange" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
        {screenshot && (
          <Image source={{ uri: screenshot }} style={styles.previewImage} />
        )}

        {/* Submit */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendRequest}>
          <Text style={styles.sendButtonText}>File Complaint</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f9f9f9" },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  radioGroup: { flexDirection: "row", marginBottom: 20 },
  radioButton: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioOuterSelected: { borderColor: Theme?.colors?.primary || "#3b82f6" },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Theme?.colors?.primary || "#3b82f6",
  },
  radioLabel: { fontSize: 14, color: "#333" },

  dropdownWrapper: { zIndex: 3000, elevation: 3, marginBottom: 15 },
  dropdown: { borderColor: "#ccc", borderRadius: 8 },
  dropdownContainer: { borderColor: "#ccc" },
  listItemLabel: { fontSize: 14, color: "#333", flexWrap: "wrap" },
  textStyle: { fontSize: 14, color: "#333" },

  label: { fontSize: 15, fontWeight: "500", color: "#333", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  uploadButton: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  uploadButtonText: { fontSize: 16, color: "orange", marginLeft: 6 },
  previewImage: {
    width: width * 0.85,
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: "center",
  },
  sendButton: {
    backgroundColor: Theme?.colors?.primary || "#3b82f6",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default FileComplaint;
