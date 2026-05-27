import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Theme from "../components/Theme";
const SearchTransactionScreen = () => {
  const [searchType, setSearchType] = useState("refId"); // "refId" | "mobile"
  const [refId, setRefId] = useState("");
  const [mobile, setMobile] = useState("");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [results, setResults] = useState([]);

  // Mock search function
  const handleSearch = () => {
    if (searchType === "refId" && !refId) {
      Alert.alert("Enter Ref ID");
      return;
    }
    if (searchType === "mobile" && (!mobile || !otpVerified)) {
      Alert.alert("Enter Mobile Number & Verify OTP");
      return;
    }

    // Mock response
    const mockResponse = [
      {
        agentId: "AGT123",
        amount: "500",
        billerName: "Electricity Board",
        txnDate: "2025-08-20 14:05",
        txnReferenceId: "TXN87654321",
        txnStatus: "SUCCESS",
      },
    ];
    setResults(mockResponse);
  };

  const sendOtp = () => {
    if (!mobile) {
      Alert.alert("Enter mobile number first");
      return;
    }
    Alert.alert("OTP Sent", `An OTP has been sent to ${mobile}`);
  };

  const verifyOtp = () => {
    if (otp === "1234") {
      setOtpVerified(true);
      Alert.alert("OTP Verified", "You can now search transactions");
    } else {
      Alert.alert("Invalid OTP", "Please try again");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Search Transaction</Text>

      {/* Search Type Selector */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          style={[styles.switchButton, searchType === "refId" && styles.active]}
          onPress={() => setSearchType("refId")}
        >
          <Text>By Ref ID</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.switchButton, searchType === "mobile" && styles.active]}
          onPress={() => setSearchType("mobile")}
        >
          <Text>By Mobile + Date</Text>
        </TouchableOpacity>
      </View>

      {/* Ref ID Input */}
      {searchType === "refId" && (
        <TextInput
          style={styles.input}
          placeholder="Enter B-Connect Transaction Ref ID"
          value={refId}
          onChangeText={setRefId}
        />
      )}

      {/* Mobile + Date Inputs */}
      {searchType === "mobile" && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Mobile Number"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />
          <View style={styles.dateRow}>
            <TouchableOpacity onPress={() => setShowFromPicker(true)}>
              <Text style={styles.dateBtn}>
                From: {fromDate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowToPicker(true)}>
              <Text style={styles.dateBtn}>
                To: {toDate.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
          </View>

          {showFromPicker && (
            <DateTimePicker
              value={fromDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowFromPicker(false);
                if (date) setFromDate(date);
              }}
            />
          )}

          {showToPicker && (
            <DateTimePicker
              value={toDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowToPicker(false);
                if (date) setToDate(date);
              }}
            />
          )}

          {/* OTP Section */}
          {!otpVerified ? (
            <>
              <View style={styles.otpRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter OTP"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity style={styles.otpBtn} onPress={sendOtp}>
                  <Text style={styles.otpText}>Send OTP</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.verifyBtn} onPress={verifyOtp}>
                <Text style={styles.otpText}>Verify OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.verifiedText}>✅ OTP Verified</Text>
          )}
        </>
      )}

      {/* Search Button */}
      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>

      {/* Results */}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.txnReferenceId}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              <Text>Agent ID: {item.agentId}</Text>
              <Text>Amount: ₹{item.amount}</Text>
              <Text>Biller: {item.billerName}</Text>
              <Text>Date: {item.txnDate}</Text>
              <Text>Txn Ref ID: {item.txnReferenceId}</Text>
              <Text>Status: {item.txnStatus}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  switchRow: { flexDirection: "row", marginBottom: 10 },
  switchButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    alignItems: "center",
  },
  active: { backgroundColor: "#d0e8ff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  dateRow: { flexDirection: "row", justifyContent: "space-between" },
  dateBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 5,
  },
  otpRow: { flexDirection: "row", alignItems: "center" },
  otpBtn: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: Theme.colors.primary,
    borderRadius: 6,
  },
  otpText: { color: "#fff" },
  verifyBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 6,
    alignItems: "center",
  },
  verifiedText: { color: "green", marginVertical: 10 },
  searchBtn: {
    marginTop: 20,
    backgroundColor: Theme.colors.primary,
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
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
  },
});

export default SearchTransactionScreen;
