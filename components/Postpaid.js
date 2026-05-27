import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "./Theme";

const Postpaid = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddAccountPress = () => {
    navigation.navigate("NewBank");
    console.log("Add a New Bank Account pressed");
  };

  const handleRecentTransactionPress = (transaction) => {
    // Handle recent transaction press
    console.log("Transaction pressed:", transaction);
  };

  const renderRecentTransaction = ({ item }) => (
    <TouchableOpacity
      style={styles.recentTransaction}
      onPress={() => handleRecentTransactionPress(item)}
    >
      <View style={styles.accountInfo}>
        <View style={styles.initialsCircle}>
          <Text style={styles.initials}>{item.initials}</Text>
        </View>
        <View>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.accountDetails}>
            {item.bank} A/c XX {item.accountNumber}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Image source={require("../assets/Edit.png")} style={styles.editIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addNewAccount}
        onPress={handleAddAccountPress}
      >
        <Image
          source={require("../assets/bankkk.png")}
          style={styles.bankBuildingIcon}
        />
        <View>
          <Text style={styles.addNewAccountText}>Add a New Bank Account</Text>
          <Text style={styles.addNewAccountTextt}>
            Choose Bank or enter IFSC details
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.recentTransactionsHeader}>
        <Text style={styles.recentTransactionsLabel}>Recent Transaction</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllLabel}>SEE ALL</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentTransactionsData}
        renderItem={renderRecentTransaction}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const recentTransactionsData = [
  {
    id: "1",
    initials: "DS",
    name: "Durgesh Saini",
    bank: "Canara Bank",
    accountNumber: "6985",
  },
  {
    id: "2",
    initials: "S",
    name: "Suraj",
    bank: "Bank of India",
    accountNumber: "3875",
  },
  {
    id: "3",
    initials: "N",
    name: "Nitin",
    bank: "Indian Overseas Bank",
    accountNumber: "9688",
  },
  {
    id: "4",
    initials: "V",
    name: "Vishal",
    bank: "State Bank of India",
    accountNumber: "8374",
  },
  {
    id: "5",
    initials: "A",
    name: "Abhishek",
    bank: "Punjab National Bank",
    accountNumber: "9834",
  },
  {
    id: "6",
    initials: "P",
    name: "Prasad",
    bank: "Indian Overseas Bank",
    accountNumber: "8394",
  },
  {
    id: "7",
    initials: "S",
    name: "Shushant",
    bank: "State Bank of India",
    accountNumber: "3298",
  },
  {
    id: "8",
    initials: "R",
    name: "Rajesh",
    bank: "Indian Overseas Bank",
    accountNumber: "8796",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  addNewAccount: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  bankBuildingIcon: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  addNewAccountText: {
    fontSize: 15,
    color: "#333",
  },
  addNewAccountTextt: {
    fontSize: 12,
    color: "green",
  },
  recentTransactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recentTransactionsLabel: {
    fontSize: 14,
    // fontWeight: "bold",
  },
  seeAllLabel: {
    color: "#4CAF50",
    fontSize: 12,
  },
  recentTransaction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  initialsCircle: {
    backgroundColor: "#4CAF50",
    width: 37,
    height: 37,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initials: {
    fontSize: 18,
    color: Theme.colors.secondary,
    fontWeight: "bold",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  accountDetails: {
    fontSize: 14,
    color: "#555",
  },
  editButton: {
    padding: 5,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
});

export default Postpaid;
