import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Theme from "./Theme";

const Municiple = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = recentTransactionsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRecentTransaction = ({ item }) => (
    <TouchableOpacity style={styles.recentTransaction}>
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
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#aaa"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBox}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.recentTransactionsHeader}>
        <Text style={styles.recentTransactionsLabel}>Recent Transactions</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllLabel}>SEE ALL</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.colors.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchBox: {
    flex: 1,
    height: 40,
  },
  recentTransactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  recentTransactionsLabel: {
    fontSize: 14,
  },
  seeAllLabel: {
    color: Theme.colors.primary,
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
    backgroundColor: Theme.colors.primary,
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
    color: Theme.colors.primary,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
});

export default Municiple;
