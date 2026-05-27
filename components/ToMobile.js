import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import Theme from "./Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import {SafeAreaView} from 'react-native-safe-area-context';

const countryCodes = [
  { label: "+91", value: "+91" },
  { label: "+1", value: "+1" },
  { label: "+44", value: "+44" },
];

const ToMobile = () => {
  const navigation = useNavigation();
  const [recipientNumber, setRecipientNumber] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [error, setError] = useState("");

  const handleRecipientChange = (text) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, "");
    setRecipientNumber(numericText);
    setError("");

    if (numericText.length === 10) {
      fetchMobileNumber(numericText);
    } else if (showSearchResult) {
      setShowSearchResult(false);
    }
  };

  const handleSelectNumber = () => {
    if (recipientNumber.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (showSearchResult && name) {
      setShowSearchResult(false);

      navigation.navigate("ChatScreen", {
        recipientNumber,
        recipientName: name || "New Contact",
      });
    } else {
      setError("User not exist");
    }
  };

  const fetchMobileNumber = async (mobileNumber) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error("Token is missing!");
        setError("Authentication error. Please login again.");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${BASE_URL}/misc/check_mobile_number_peer?mobile=${mobileNumber}`,
        { headers }
      );

      if (response.status === 200 && response.data) {
        if (response.data.data) {
          setName(response.data.data[0]);
          console.log("Name:", response.data.data[0]);
          setShowSearchResult(true);
        } else {
          setName("New User");
          setShowSearchResult(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Failed to verify number. Please try again.");
      setName(null);
      setShowSearchResult(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Theme.colors.background}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Send Money</Text>
          <Text style={styles.subHeader}>Enter recipient's mobile number</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.countryCodeContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedCountryCode(value)}
                items={countryCodes}
                value={selectedCountryCode}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
              />
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={recipientNumber}
              onChangeText={handleRecipientChange}
              maxLength={10}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Theme.colors.primary} />
              <Text style={styles.loadingText}>Verifying number...</Text>
            </View>
          ) : showSearchResult && name ? (
            <TouchableOpacity
              style={styles.searchResult}
              onPress={handleSelectNumber}
              activeOpacity={0.7}
            >
              <View style={styles.resultIcon}>
                <Text style={styles.iconText}>
                  {name === "New User" ? "+" : "✓"}
                </Text>
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultTitle}>{name || "New User"}</Text>
                <Text style={styles.resultNumber}>
                  {selectedCountryCode} {recipientNumber}
                </Text>
                <Text style={styles.tapToSelect}>Tap to continue</Text>
              </View>
            </TouchableOpacity>
          ) : recipientNumber.length > 0 ? (
            <Text style={styles.instructionText}>
              Enter a 10-digit mobile number to continue
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.continueButton,
              (!showSearchResult || loading) && styles.continueButtonDisabled,
            ]}
            onPress={handleSelectNumber}
            disabled={!showSearchResult || loading}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background || "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background || "#f8f9fa",
  },
  headerContainer: {
    padding: 20,
    backgroundColor: Theme.colors.primary || "#1a73e8",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    height: 56,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  countryCodeContainer: {
    width: 80,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    paddingRight: 10,
    height: "100%",
    justifyContent: "center",
  },
  phoneInput: {
    flex: 1,
    height: "100%",
    paddingLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#d9534f",
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Theme.colors.primary || "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultNumber: {
    fontSize: 15,
    color: "#666",
    marginTop: 2,
  },
  tapToSelect: {
    fontSize: 14,
    color: Theme.colors.primary || "#1a73e8",
    marginTop: 5,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: Theme.colors.primary || "#1a73e8",
    borderRadius: 10,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#333",
    paddingRight: 30,
    textAlign: "center",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#333",
    paddingRight: 30,
    textAlign: "center",
  },
  iconContainer: {
    top: 12,
    right: 10,
  },
});

export default ToMobile;
