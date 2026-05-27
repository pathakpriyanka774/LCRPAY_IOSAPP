// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   FlatList,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Theme from "./Theme";

// const ToBank = () => {
//     const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleAddAccountPress = () => {
//     navigation.navigate("NewBank");
//     console.log("Add a New Bank Account pressed");
//   };

//   const handleRecentTransactionPress = (transaction) => {
//     // Handle recent transaction press
//     console.log("Transaction pressed:", transaction);
//   };

//   const renderRecentTransaction = ({ item }) => (
//     <TouchableOpacity
//       style={styles.recentTransaction}
//       onPress={() => handleRecentTransactionPress(item)}
//     >
//       <View style={styles.accountInfo}>
//         <View style={styles.initialsCircle}>
//           <Text style={styles.initials}>{item.initials}</Text>
//         </View>
//         <View>
//           <Text style={styles.accountName}>{item.name}</Text>
//           <Text style={styles.accountDetails}>
//             {item.bank} A/c XX {item.accountNumber}
//           </Text>
//         </View>
//       </View>
//       <TouchableOpacity style={styles.editButton}>
//         <Image
//           source={require("../assets/Edit.png")}
//           style={styles.editIcon}
//         />
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.addNewAccount}
//         onPress={handleAddAccountPress}
//       >
//         <Image
//           source={require("../assets/bankkk.png")}
//           style={styles.bankBuildingIcon}
//         />
//         <View>
//           <Text style={styles.addNewAccountText}>Add a New Bank Account</Text>
//           <Text style={styles.addNewAccountTextt}>
//             Choose Bank or enter IFSC details
//           </Text>
//         </View>
//       </TouchableOpacity>

//       <View style={styles.recentTransactionsHeader}>
//         <Text style={styles.recentTransactionsLabel}>Recent Transaction</Text>
//         <TouchableOpacity>
//           <Text style={styles.seeAllLabel}>SEE ALL</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={recentTransactionsData}
//         renderItem={renderRecentTransaction}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// };

// const recentTransactionsData = [
//   {
//     id: "1",
//     initials: "DS",
//     name: "Durgesh Saini",
//     bank: "Canara Bank",
//     accountNumber: "6985",
//   },
//   {
//     id: "2",
//     initials: "S",
//     name: "Suraj",
//     bank: "Bank of India",
//     accountNumber: "3875",
//   },
//   {
//     id: "3",
//     initials: "N",
//     name: "Nitin",
//     bank: "Indian Overseas Bank",
//     accountNumber: "9688",
//   },
//   {
//     id: "4",
//     initials: "V",
//     name: "Vishal",
//     bank: "State Bank of India",
//     accountNumber: "8374",
//   },
//   {
//     id: "5",
//     initials: "A",
//     name: "Abhishek",
//     bank: "Punjab National Bank",
//     accountNumber: "9834",
//   },
//   {
//     id: "6",
//     initials: "P",
//     name: "Prasad",
//     bank: "Indian Overseas Bank",
//     accountNumber: "8394",
//   },
//   {
//     id: "7",
//     initials: "S",
//     name: "Shushant",
//     bank: "State Bank of India",
//     accountNumber: "3298",
//   },
//   {
//     id: "8",
//     initials: "R",
//     name: "Rajesh",
//     bank: "Indian Overseas Bank",
//     accountNumber: "8796",
//   },
// ];

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f8f8",
//   },
//   addNewAccount: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: Theme.colors.secondary,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   bankBuildingIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 15,
//   },
//   addNewAccountText: {
//     fontSize: 15,
//     color: Theme.colors.primary,
//   },
//   addNewAccountTextt: {
//     fontSize: 12,
//     color: Theme.colors.primary,
//   },
//   recentTransactionsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   recentTransactionsLabel: {
//     fontSize: 14,
//   },
//   seeAllLabel: {
//     color: Theme.colors.primary,
//     fontSize: 12,
//   },
//   recentTransaction: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 15,
//     backgroundColor: Theme.colors.secondary,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   accountInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   initialsCircle: {
//     backgroundColor: Theme.colors.primary,
//     width: 37,
//     height: 37,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   initials: {
//     fontSize: 18,
//     color: Theme.colors.secondary,
//     fontWeight: "bold",
//   },
//   accountName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   accountDetails: {
//     fontSize: 14,
//     color: Theme.colors.primary,
//   },
//   editIcon: {
//     width: 20,
//     height: 20,
//   },
// });

// export default ToBank;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Theme from "./Theme";

const TransferMoneyScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("Bank Accounts");

  const bankAccounts = [
    // {
    //   id: "1",
    //   name: "Dummy Place 1",
    //   bank: "Axis ••XXXX",
    //   sent: "₹500",
    //   date: "30 Jan 2025",
    //   logo: require("../assets/Axis.png"),
    // },
    // {
    //   id: "2",
    //   name: "Dummy Place 2",
    //   bank: "Bandhan Bank ••XXXX",
    //   sent: "₹3,200",
    //   date: "01 Feb 2025",
    //   logo: require("../assets/bandhan.png"),
    // },
    // {
    //   id: "3",
    //   name: "Dummy Place 3",
    //   bank: "Bank Of Baroda ••0521",
    //   sent: "₹36,000",
    //   date: "12 Nov 2024",
    //   logo: require("../assets/bob.png"),
    // },
    // {
    //   id: "4",
    //   name: "Dummy Place 4",
    //   bank: "CitiBank ••8270",
    //   sent: "₹5,500",
    //   date: "15 Dec 2024",
    //   logo: require("../assets/citibank.png"),
    // },
  ];

  const upiIds = [
    // { id: "5", name: "Dummy User 1", upi: "XXXXXXXXXX@okaxis" },
    // { id: "6", name: "Dummy User 2", upi: "XXXXXXXXXX@axl" },
    // { id: "7", name: "Dummy User 3", upi: "XXXXXXXXXX@oksbi" },
    // { id: "8", name: "Dummy User 4", upi: "XXXXXXXXXX@icici" },
  ];

  const filteredData =
    selectedTab === "Bank Accounts"
      ? bankAccounts.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : upiIds.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Bank Account, UPI ID"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      </View>

      <View style={styles.toggleContainer}>
        {["Bank Accounts", "UPI ID"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.toggleButton}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.toggleText,
                selectedTab === tab && styles.activeText,
              ]}
            >
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.underline} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ListEmptyComponent={
          <View style={styles.noDataFound}>
            <Image
              source={
                selectedTab === "Bank Accounts"
                  ? require("../assets/FundTransferFeature.jpg")
                  : require("../assets/upiTransfer.jpeg")
              }
            />
          </View>
        }
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {selectedTab === "Bank Accounts" ? (
              <Image source={item.logo} style={styles.bankLogo} />
            ) : (
              <View style={styles.upiAvatar}>
                <Text style={styles.upiAvatarText}>{item.name.charAt(0)}</Text>
              </View>
            )}

            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>
                {selectedTab === "Bank Accounts" ? item.bank : item.upi}
              </Text>
              {selectedTab === "Bank Accounts" && (
                <>
                  <Text style={styles.itemAmount}>{item.sent}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </>
              )}
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (selectedTab === "UPI ID") {
            navigation.navigate("AddUpiScreen");
          } else if (selectedTab === "Bank Accounts") {
            navigation.navigate("NewBank");
          }
        }}
      >
        <Text style={styles.fabText}>+ Add {selectedTab}</Text>
      </TouchableOpacity>

      <Image
        source={require("../assets/LogoN.png")}
        style={styles.bottomImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  searchBar: { flex: 1, paddingVertical: 10 },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  toggleButton: { flex: 1, alignItems: "center", paddingVertical: 10 },
  toggleText: { fontSize: 16, fontWeight: "bold", color: "#555" },
  activeText: { color: Theme.colors.primary },
  underline: {
    height: 3,
    backgroundColor: Theme.colors.primary,
    width: "100%",
    marginTop: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemDetails: { marginLeft: 15, flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: "bold" },
  itemSubtitle: { fontSize: 14, color: "#555" },
  itemAmount: { fontSize: 14, color: "green", fontWeight: "bold" },
  itemDate: { fontSize: 12, color: "#888" },
  bankLogo: { width: 40, height: 40, borderRadius: 20 },
  upiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  upiAvatarText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: "10%",
    alignSelf: "center",
    width: "80%",
    backgroundColor: Theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    elevation: 5,
  },
  fabText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  bottomImage: {
    width: "100%",
    height: 70,
    position: "absolute",
    bottom: "0.1%",
    alignSelf: "center",
    resizeMode: "contain",
  },

  noDataFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TransferMoneyScreen;
