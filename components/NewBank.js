import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import Theme from "./Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const NewBank = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankAccountsData, setBankAccountsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBankData();
  }, []);

  // Fetch bank list from API
  const fetchBankData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error("Token is missing!");
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        "https://api.bharatconnectapi.com/getallbanks",
        { headers }
      );

      console.log("API Response:", response.data); // 🔹 Debug API response

      // ✅ Extract the 'records' array properly
      const bankData = response.data.records || []; // Ensure it's an array

      if (Array.isArray(bankData)) {
        setBankAccountsData(bankData); // ✅ Correctly setting state
      } else {
        console.warn("Invalid API response format", response.data);
        setBankAccountsData([]); // ✅ Prevents crashes
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setBankAccountsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle bank selection
  const handleBankAccountPress = (account) => {
    setSelectedBank(account);
  };

  // Filter banks based on search text
  const filteredBanks = Array.isArray(bankAccountsData)
    ? bankAccountsData.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add New Account</Text>

      {/* Show Loader While Fetching Data */}
      {loading && (
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      )}

      {/* Search & Bank List */}
      {!selectedBank && !loading && (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Bank"
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredBanks}
            keyExtractor={(item) => item.bankName.toString()} // Ensure key is a string
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.bankAccount}
                onPress={() => handleBankAccountPress(item)}
              >
                <View style={styles.accountInfo}>
                  {item.bankImage ? (
                    <Image
                      source={{ uri: item.bankImage }}
                      style={styles.bankIcon}
                    />
                  ) : (
                    <Image
                      source={{ uri: "https://via.placeholder.com/40" }} // Fallback Image
                      style={styles.bankIcon}
                    />
                  )}
                  <Text style={styles.accountName}>{item.bankName}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Selected Bank Display and Input Fields */}
      {selectedBank && (
        <>
          <View style={styles.selectedBankContainer}>
            <Image
              source={{
                uri:
                  selectedBank.bankImage || "https://via.placeholder.com/100",
              }}
              style={styles.selectedBankIcon}
            />
            <Text style={styles.selectedBankName}>{selectedBank.bankName}</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter Bank Account Number"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Re-enter Bank Account Number"
            value={reEnterAccountNumber}
            onChangeText={setReEnterAccountNumber}
            keyboardType="numeric"
          />
          <View style={styles.ifscContainer}>
            <TextInput
              style={styles.ifscInput}
              placeholder="Enter IFSC Code"
              value={ifscCode}
              onChangeText={setIfscCode}
            />
            <TouchableOpacity style={styles.findIfscButton}>
              <Text style={styles.findIfscButtonText}>Find IFSC</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Account Holder Name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
          />
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Theme.colors.secondary,
  },
  selectedBankContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 8,
  },
  selectedBankIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  selectedBankName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: Theme.colors.secondary,
  },
  ifscContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ifscInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Theme.colors.secondary,
  },
  findIfscButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  findIfscButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: Theme.colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bankAccount: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: Theme.colors.primary,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bankIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  accountName: {
    fontSize: 16,
    color: Theme.colors.primary,
    fontWeight: "bold",
  },
});

export default NewBank;
