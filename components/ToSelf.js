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
  Alert,
} from "react-native";
import Theme from "./Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useAppStore } from "../zustand/Store";
import StatePopup from "./ToSelf/StatePopup";
import { useNavigation, useRoute } from "@react-navigation/native";

const ToSelf = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { insID } = route.params; // Accessing insID

  const { selecedIFSC, setSelectedIFSC } = useAppStore();
  const { AllBankData, setAllBankData } = useAppStore();

  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIfscCode(selecedIFSC.ifsc_code);
    setBranchName(selecedIFSC.branch);
  }, [selecedIFSC]);

  useEffect(() => {
    if (!AllBankData || AllBankData.length === 0) {
      fetchBankData();
    }
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
        setAllBankData(bankData); // ✅ Correctly setting state
      } else {
        console.warn("Invalid API response format", response.data);
        setAllBankData([]); // ✅ Prevents crashes
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setAllBankData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle bank selection
  const handleBankAccountPress = (account) => {
    setSelectedBank(account);
    setSelectedIFSC("");
    setIfscCode();
  };

  // Filter banks based on search text
  const filteredBanks = Array.isArray(AllBankData)
    ? AllBankData.filter((bank) =>
        bank.bankName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  // ===============================================================================
  // Popup Screen
  // ===============================================================================
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState({});

  const handleBranchSelect = (Branch) => {
    console.log("selected branch", Branch);
    setSelectedBranch(Branch);
    setModalVisible(false);
  };

  // ===============================================================================
  // Add new Bank Account
  // ===============================================================================
  const AddNewBank = async () => {
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

      const data = {
        accountHolder: accountHolderName,
        bankInsID: insID,
        BankName: selectedBank.bankName,
        IFSC: ifscCode,
        accountNumber: accountNumber,
        confirmAccountNumber: reEnterAccountNumber,
      };

      console.log("this is user Data----> ", data);

      const response = await axios.post(
        `${BASE_URL}/payments/add_new_bank`,
        data,
        { headers }
      );

      console.log("Add New Bank:", response.data);
      Alert.alert(
        "Success",
        "Bank Added Successfully",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("BankDetails"), // Replace "Toself" with your actual screen name
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Axios Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 404) {
          Alert.alert("Error", "Requested resource not found (404)");
        }
      } else {
        console.error("Unexpected Error:", error);
        Alert.alert("Error", "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
            <TouchableOpacity
              style={styles.findIfscButton}
              onPress={() => {
                setSelectedIFSC("");
                setIfscCode();
                setModalVisible(true);
              }}
            >
              <Text style={styles.findIfscButtonText}>Find IFSC</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ color: "green", paddingBottom: 9 }}>{branchName}</Text>

          {/* For the Popup Screen */}
          <StatePopup
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSelectBranch={handleBranchSelect}
            selectedBank={selectedBank}
          />
          <TextInput
            style={styles.input}
            placeholder="Account Holder Name"
            value={accountHolderName}
            onChangeText={setAccountHolderName}
          />
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => AddNewBank()}
          >
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
    width: "85%",
    fontSize: 16,
    color: Theme.colors.primary,
    fontWeight: "bold",
  },
});

export default ToSelf;
