import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Theme from "../components/Theme";
const ComplaintTrackingScreen = () => {
  const [complaintId, setComplaintId] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    if (!complaintId) {
      Alert.alert("Enter Complaint ID");
      return;
    }

    // Mock API response
    const mockResponse = {
      complaintId: complaintId,
      status: "In Progress",
      registeredDate: "2025-08-15 10:30",
      resolvedDate: null,
      remarks: "Your complaint is being reviewed by the support team.",
    };

    setResult(mockResponse);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Complaint Tracking</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Complaint ID"
        value={complaintId}
        onChangeText={setComplaintId}
      />

      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.searchText}>Track</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>
            Complaint ID: {result.complaintId}
          </Text>
          <Text style={styles.resultText}>Status: {result.status}</Text>
          <Text style={styles.resultText}>
            Registered Date: {result.registeredDate}
          </Text>
          <Text style={styles.resultText}>
            Resolved Date: {result.resolvedDate || "Pending"}
          </Text>
          <Text style={styles.resultText}>Remarks: {result.remarks}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  searchBtn: {
    backgroundColor: Theme.colors.primary, // changed to purple
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  searchText: { color: "#fff", fontWeight: "bold" },
  resultCard: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    backgroundColor: "#f9f9f9",
  },
  resultText: { marginBottom: 6 },
});

export default ComplaintTrackingScreen;
