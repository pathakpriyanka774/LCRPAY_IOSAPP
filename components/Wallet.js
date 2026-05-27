// // import React, { useState, useRef, useEffect } from "react";
// // import {
// //   StyleSheet,
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   ScrollView,
// //   Dimensions,
// //   Image,
// //   Animated,
// //   Platform,
// // } from "react-native";
// // import { useNavigation } from "@react-navigation/native";
// // import * as ImagePicker from "expo-image-picker";
// // import * as Clipboard from "expo-clipboard";
// // import { Feather } from "@expo/vector-icons";
// // import Theme from "./Theme";
// // import { handlePayment } from "./payment/PhonepePayment";
// // import { useUserStore } from "../zustand/Store";
// // import { useDispatch, useSelector } from "react-redux";
// // import { creditAmount, history } from "../src/features/wallet/walletSlice";
// // import { ActivityIndicator } from "react-native";

// // const { width, height } = Dimensions.get("window");

// // const TransactionRow = ({ transaction, onCopy }) => {
// //   const fadeAnim = useRef(new Animated.Value(0)).current;

// //   useEffect(() => {
// //     Animated.timing(fadeAnim, {
// //       toValue: 1,
// //       duration: 500,
// //       useNativeDriver: true,
// //     }).start();
// //   }, []);

// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("en-IN", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   };

// //   const truncateText = (text, maxLength) => {
// //     return text?.length > maxLength
// //       ? text.substring(0, maxLength) + "..."
// //       : text;
// //   };

// //   // const handleMoneyViaUpi = async()=>{

// //   //   const data = {
// //   //     amount:100,
// //   //     client_txn_id:"ODER12345",
// //   //     p_info:"BlueHills store",
// //   //     redirect_url:"https://www.google.com",
// //   //     key:"2288d274-6574-4e0d-bf69-259c387cb2e1",
// //   //     customer_name:"lauda lehsun"
// //   //   }

// //   //   const res = await axios.post("https://api.ekqr.in/api/create_oder",data)

// //   //   if(res?.data?.data){

// //   //   }
// //   // }

// //   return (
// //     <Animated.View style={[styles.transactionRow, { opacity: fadeAnim }]}>
// //       <View style={styles.transactionCell}>
// //         <Text style={styles.transactionText}>
// //           {formatDate(transaction.transaction_date)}
// //         </Text>
// //       </View>
// //       <View style={styles.transactionCell}>
// //         <Text style={styles.transactionText}>
// //           {truncateText(transaction.reference_id, 8)}
// //         </Text>
// //       </View>
// //       <View style={styles.transactionCell}>
// //         <Text style={[styles.transactionText, styles.amountText]}>
// //           ₹{transaction.transaction_amount}
// //         </Text>
// //       </View>
// //       <View style={[styles.transactionCell, styles.utrCell]}>
// //         <Text style={styles.transactionText}>
// //           {truncateText(transaction.utr_no, 8)}
// //         </Text>
// //         <TouchableOpacity
// //           onPress={() => onCopy(transaction.utr_no)}
// //           style={styles.copyButton}
// //         >
// //           <Feather name="copy" size={16} color={Theme.colors.primary} />
// //         </TouchableOpacity>
// //       </View>
// //       <View style={styles.transactionCell}>
// //         <View
// //           style={[
// //             styles.statusBadge,
// //             {
// //               backgroundColor:
// //                 transaction.status === "success" ? "#e6f4ea" : "#fce8e6",
// //             },
// //           ]}
// //         >
// //           <Text
// //             style={[
// //               styles.statusText,
// //               {
// //                 color: transaction.status === "success" ? "#34a853" : "#ea4335",
// //               },
// //             ]}
// //           >
// //             {transaction.status}
// //           </Text>
// //         </View>
// //       </View>
// //     </Animated.View>
// //   );
// // };

// // const Wallet = () => {
// //   const [customerId, setCustomerId] = useState("");
// //   const [amount, setAmount] = useState("");
// //   const [selectedOption, setSelectedOption] = useState("Online");
// //   const [utrNumber, setUtrNumber] = useState("");
// //   const [showHistory, setShowHistory] = useState(false);
// //   const [screenshot, setScreenshot] = useState(null);
// //   const [submitted, setSubmitted] = useState(false);

// //   const navigation = useNavigation();
// //   const dispatch = useDispatch();
// //   const info = useSelector((state) => state.wallet);
// //   const { mobileNumber, balance, setBalance } = useUserStore();

// //   useEffect(() => {
// //     dispatch(history());
// //     console.log(`===========================?`, info);
// //   }, [dispatch, screenshot]);

// //   const handleOfflineSubmit = () => {
// //     if (!amount || !utrNumber || !screenshot) {
// //       alert("Please fill in all fields: Amount, UTR Number, and Screenshot.");
// //       return;
// //     }

// //     const utrPattern = /^[A-Za-z0-9]+$/;
// //     if (!utrPattern.test(utrNumber)) {
// //       alert("Invalid UTR Number. Please enter a valid UTR number.");
// //       return;
// //     }

// //     const data = {
// //       transaction_amount: amount,
// //       utr_no: utrNumber,
// //       remark: "Adding funds to wallet",
// //       payment_screenshot: screenshot,
// //     };

// //     setSubmitted(true);
// //     dispatch(creditAmount(data))
// //       .then(() => {
// //         setAmount("");
// //         setUtrNumber("");
// //         setScreenshot(null);
// //       })
// //       .catch((error) => {
// //         console.error("Error submitting offline payment:", error);
// //       });
// //   };

// //   const handleScreenshotUpload = async () => {
// //     try {
// //       let result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         quality: 1,
// //       });

// //       if (!result.canceled && result.assets?.length > 0) {
// //         setScreenshot(result.assets[0].uri);
// //       }
// //     } catch (error) {
// //       console.error("Error uploading screenshot:", error);
// //       alert("Failed to upload screenshot. Please try again.");
// //     }
// //   };

// //   const handleAmountSelection = (value) => {
// //     setAmount(value.toString());
// //   };

// //   const handleAddWallet = async () => {
// //     if (!amount) {
// //       alert("Please enter an amount");
// //       return;
// //     }

// //     try {
// //       const response = await handlePayment(amount, mobileNumber);

// //       if (response === "SUCCESS") {
// //         const numericAmount = parseFloat(amount);
// //         const handleOnlineData = {
// //           transaction_mode: selectedOption,
// //           transaction_amount: amount,
// //           transaction_type: "credit",
// //           utr_no: "UTR" + Math.floor(1000000000 + Math.random() * 9000000000),
// //           purpose: "Wallet Recharge",
// //           remark: "Adding funds to wallet",
// //         };

// //         await dispatch(creditAmount(handleOnlineData));
// //         setBalance(balance + numericAmount);
// //         setAmount("");
// //         navigation.navigate("PaymentStatus", {
// //           message: "Payment Successful",
// //           statusColor: "green",
// //           amount: amount,
// //         });
// //       } else {
// //         navigation.navigate("PaymentStatus", {
// //           message: "Payment Failed",
// //           statusColor: "red",
// //           amount: amount,
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Payment error:", error);
// //       alert("Payment failed. Please try again.");
// //     }
// //   };

// //   const copyToClipboard = async (text) => {
// //     try {
// //       await Clipboard.setStringAsync(text);
// //       alert("Copied to clipboard");
// //     } catch (error) {
// //       console.error("Failed to copy:", error);
// //     }
// //   };

// //   const renderTransactionHistory = () => {
// //     if (!info?.transactionHistory?.transactions?.length) {
// //       return (
// //         <View style={styles.emptyState}>
// //           <Feather name="inbox" size={48} color="#ccc" />
// //           <Text style={styles.emptyStateText}>No transactions yet</Text>
// //         </View>
// //       );
// //     }

// //     return (
// //       <ScrollView style={styles.transactionTable}>
// //         <View style={styles.transactionHeader}>
// //           <Text style={styles.headerCell}>Date</Text>
// //           <Text style={styles.headerCell}>Trans ID</Text>
// //           <Text style={styles.headerCell}>Amount</Text>
// //           <Text style={styles.headerCell}>UTR</Text>
// //           <Text style={styles.headerCell}>Status</Text>
// //         </View>
// //         <View style={styles.transactionList}>
// //           {info.transactionHistory.transactions.map((transaction) => (
// //             <TransactionRow
// //               key={transaction.id}
// //               transaction={transaction}
// //               onCopy={copyToClipboard}
// //             />
// //           ))}
// //         </View>
// //       </ScrollView>
// //     );
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container}>
// //       <View style={styles.header}>
// //         {/* <View style={styles.balanceContainer}>
// //           <Text style={styles.balanceLabel}>Available Balance</Text>
// //           <Text style={styles.balanceAmount}>₹{info?.transactionHistory === null ? 0 : info?.transactionHistory?.final_amount}</Text>
// //         </View> */}
// //       </View>

// //       <View style={styles.mainContent}>
// //         <View style={styles.tabContainer}>
// //           <TouchableOpacity
// //             style={[
// //               styles.tab,
// //               selectedOption === "Online" && styles.selectedTab,
// //             ]}
// //             onPress={() => setSelectedOption("Online")}
// //           >
// //             <Text
// //               style={[
// //                 styles.tabText,
// //                 selectedOption === "Online" && styles.selectedTabText,
// //               ]}
// //             >
// //               Online
// //             </Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             style={[
// //               styles.tab,
// //               selectedOption === "Offline" && styles.selectedTab,
// //             ]}
// //             onPress={() => setSelectedOption("Offline")}
// //           >
// //             <Text
// //               style={[
// //                 styles.tabText,
// //                 selectedOption === "Offline" && styles.selectedTabText,
// //               ]}
// //             >
// //               Offline
// //             </Text>
// //           </TouchableOpacity>
// //         </View>

// //         {selectedOption === "Online" ? (
// //           <View style={styles.onlineSection}>
// //             <Text style={styles.sectionTitle} onPress={()=>{
// //               handleMoneyViaUpi
// //             }}>Add Money to Wallet</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter Amount"
// //               keyboardType="numeric"
// //               value={amount}
// //               onChangeText={setAmount}
// //             />
// //             <View style={styles.quickAmounts}>
// //               {[100, 500, 1000, 2000].map((value) => (
// //                 <TouchableOpacity
// //                   key={value}
// //                   style={styles.quickAmountButton}
// //                   onPress={() => handleAmountSelection(value)}
// //                 >
// //                   <Text style={styles.quickAmountText}>₹{value}</Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //             <TouchableOpacity
// //               style={styles.addButton}
// //               onPress={handleAddWallet}
// //               disabled={!amount}
// //             >
// //               <Text style={styles.addButtonText}>Add Money</Text>
// //             </TouchableOpacity>
// //           </View>
// //         ) : (
// //           <View style={styles.offlineSection}>
// //             <View style={styles.bankDetails}>
// //               <View style={styles.bankRow}>
// //                 <Text style={styles.bankLabel}>Bank Name</Text>
// //                 <View style={styles.bankValue}>
// //                   <Text style={styles.bankText}>Kotak</Text>
// //                   <TouchableOpacity onPress={() => copyToClipboard("Kotak")}>
// //                     <Feather
// //                       name="copy"
// //                       size={18}
// //                       color={Theme.colors.primary}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //               <View style={styles.bankRow}>
// //                 <Text style={styles.bankLabel}>Account Number</Text>
// //                 <View style={styles.bankValue}>
// //                   <Text style={styles.bankText}>9048406560</Text>
// //                   <TouchableOpacity
// //                     onPress={() => copyToClipboard("9048406560")}
// //                   >
// //                     <Feather
// //                       name="copy"
// //                       size={18}
// //                       color={Theme.colors.primary}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //               <View style={styles.bankRow}>
// //                 <Text style={styles.bankLabel}>IFSC Code</Text>
// //                 <View style={styles.bankValue}>
// //                   <Text style={styles.bankText}>KKBK0000180</Text>
// //                   <TouchableOpacity
// //                     onPress={() => copyToClipboard("KKBK0000180")}
// //                   >
// //                     <Feather
// //                       name="copy"
// //                       size={18}
// //                       color={Theme.colors.primary}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //               <View style={styles.bankRow}>
// //                 <Text style={styles.bankLabel}>Account Holder</Text>
// //                 <View style={styles.bankValue}>
// //                   <Text style={[styles.bankText, { width: 130 }]}>
// //                     HBA LIFECARE SERVICES PRIVATE LIMITED
// //                   </Text>
// //                   <TouchableOpacity
// //                     onPress={() =>
// //                       copyToClipboard("HBA LIFECARE SERVICES PRIVATE LIMITED")
// //                     }
// //                   >
// //                     <Feather
// //                       name="copy"
// //                       size={18}
// //                       color={Theme.colors.primary}
// //                     />
// //                   </TouchableOpacity>
// //                 </View>
// //               </View>
// //             </View>

// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter Amount"
// //               keyboardType="numeric"
// //               value={amount}
// //               onChangeText={setAmount}
// //             />

// //             <TextInput
// //               style={styles.input}
// //               placeholder="Enter UTR Number"
// //               value={utrNumber}
// //               onChangeText={setUtrNumber}
// //             />

// //             <TouchableOpacity
// //               style={styles.uploadButton}
// //               onPress={handleScreenshotUpload}
// //             >
// //               <Feather
// //                 name="upload"
// //                 size={20}
// //                 color="#fff"
// //                 style={styles.uploadIcon}
// //               />
// //               <Text style={styles.uploadButtonText}>
// //                 {screenshot ? "Change Screenshot" : "Upload Payment Screenshot"}
// //               </Text>
// //             </TouchableOpacity>

// //             {screenshot && (
// //               <Image
// //                 source={{ uri: screenshot }}
// //                 style={styles.screenshotPreview}
// //               />
// //             )}

// //             <TouchableOpacity
// //               style={[
// //                 styles.submitButton,
// //                 (!amount || !utrNumber || !screenshot) && styles.disabledButton,
// //               ]}
// //               onPress={handleOfflineSubmit}
// //               disabled={!amount || !utrNumber || !screenshot || submitted}
// //             >
// //               {info.loading ? (
// //                 <ActivityIndicator size="small" color="#fff" />
// //               ) : (
// //                 <Text style={styles.submitButtonText}>Submit Payment</Text>
// //               )}
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         <View style={styles.transactionSection}>
// //           <View style={styles.sectionHeader}>
// //             <Text style={styles.sectionTitle}>Recent Transactions</Text>
// //             <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
// //               <Text style={styles.viewAllText}>
// //                 {showHistory ? "Hide" : "View All"}
// //               </Text>
// //             </TouchableOpacity>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             {showHistory ? renderTransactionHistory() : ""}
// //           </View>
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flexGrow: 1,
// //     backgroundColor: "#f8f9fa",
// //   },
// //   header: {
// //     backgroundColor: Theme.colors.primary,
// //     paddingTop: Platform.OS === "ios" ? 60 : 40,
// //     paddingBottom: 30,
// //     borderBottomLeftRadius: 20,
// //     borderBottomRightRadius: 20,
// //   },
// //   balanceContainer: {
// //     alignItems: "center",
// //   },
// //   balanceLabel: {
// //     color: "rgba(255, 255, 255, 0.8)",
// //     fontSize: 16,
// //     marginBottom: 8,
// //   },
// //   balanceAmount: {
// //     color: "#fff",
// //     fontSize: 32,
// //     fontWeight: "600",
// //   },
// //   mainContent: {
// //     flex: 1,
// //     marginTop: -20,
// //     backgroundColor: "#f8f9fa",
// //     borderTopLeftRadius: 20,
// //     borderTopRightRadius: 20,
// //     paddingHorizontal: 16,
// //     paddingTop: 20,
// //   },
// //   tabContainer: {
// //     flexDirection: "row",
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     padding: 4,
// //     marginBottom: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   tab: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     alignItems: "center",
// //     borderRadius: 8,
// //   },
// //   selectedTab: {
// //     backgroundColor: Theme.colors.primary,
// //   },
// //   tabText: {
// //     fontSize: 16,
// //     color: "#666",
// //     fontWeight: "500",
// //   },
// //   selectedTabText: {
// //     color: "#fff",
// //   },
// //   onlineSection: {
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //     color: "#333",
// //     marginBottom: 16,
// //   },
// //   input: {
// //     backgroundColor: "#f8f9fa",
// //     borderRadius: 8,
// //     padding: 12,
// //     fontSize: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: "#e9ecef",
// //   },
// //   quickAmounts: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 20,
// //   },
// //   quickAmountButton: {
// //     backgroundColor: "#f8f9fa",
// //     paddingVertical: 8,
// //     paddingHorizontal: 16,
// //     borderRadius: 8,
// //     borderWidth: 1,
// //     borderColor: "#e9ecef",
// //   },
// //   quickAmountText: {
// //     fontSize: 14,
// //     color: "#666",
// //     fontWeight: "500",
// //   },
// //   addButton: {
// //     backgroundColor: Theme.colors.primary,
// //     borderRadius: 8,
// //     padding: 16,
// //     alignItems: "center",
// //   },
// //   addButtonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// //   offlineSection: {
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   bankDetails: {
// //     backgroundColor: "#f8f9fa",
// //     borderRadius: 8,
// //     padding: 16,
// //     marginBottom: 20,
// //   },
// //   bankRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#e9ecef",
// //   },
// //   bankLabel: {
// //     fontSize: 14,
// //     color: "#666",
// //   },
// //   bankValue: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 8,
// //   },
// //   bankText: {
// //     fontSize: 14,
// //     color: "#333",
// //     fontWeight: "500",
// //   },
// //   uploadButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     backgroundColor: Theme.colors.primary,
// //     borderRadius: 8,
// //     padding: 16,
// //     marginBottom: 16,
// //   },
// //   uploadIcon: {
// //     marginRight: 8,
// //   },
// //   uploadButtonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "500",
// //   },
// //   screenshotPreview: {
// //     width: "100%",
// //     height: 200,
// //     borderRadius: 8,
// //     marginBottom: 16,
// //   },
// //   submitButton: {
// //     backgroundColor: Theme.colors.primary,
// //     borderRadius: 8,
// //     padding: 16,
// //     alignItems: "center",
// //   },
// //   disabledButton: {
// //     opacity: 0.6,
// //   },
// //   submitButtonText: {
// //     color: "#fff",
// //     fontSize: 16,
// //     fontWeight: "600",
// //   },
// //   transactionSection: {
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   sectionHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   viewAllText: {
// //     color: Theme.colors.primary,
// //     fontSize: 14,
// //     fontWeight: "500",
// //   },
// //   transactionTable: {
// //     borderRadius: 8,
// //     overflow: "hidden",
// //     borderWidth: 1,
// //     borderColor: "#e9ecef",
// //   },
// //   transactionHeader: {
// //     flexDirection: "row",
// //     backgroundColor: "#f8f9fa",
// //     paddingVertical: 12,
// //     paddingHorizontal: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#e9ecef",
// //   },
// //   headerCell: {
// //     flex: 1,
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: "#666",
// //     textAlign: "center",
// //   },
// //   transactionList: {
// //     maxHeight: 300,
// //   },
// //   transactionRow: {
// //     flexDirection: "row",
// //     paddingVertical: 12,
// //     paddingHorizontal: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#f0f0f0",
// //     backgroundColor: "#fff",
// //   },
// //   transactionCell: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   utrCell: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 4,
// //   },
// //   transactionText: {
// //     fontSize: 13,
// //     color: "#333",
// //   },
// //   amountText: {
// //     fontWeight: "600",
// //     color: Theme.colors.primary,
// //   },
// //   copyButton: {
// //     padding: 4,
// //   },
// //   statusBadge: {
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     minWidth: 70,
// //   },
// //   statusText: {
// //     fontSize: 12,
// //     fontWeight: "500",
// //     textAlign: "center",
// //   },
// //   emptyState: {
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingVertical: 32,
// //   },
// //   emptyStateText: {
// //     marginTop: 8,
// //     color: "#666",
// //     fontSize: 14,
// //   },
// // });

// // export default Wallet;

// import React, { useState, useRef, useEffect } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Dimensions,
//   Image,
//   Animated,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
// import * as Clipboard from "expo-clipboard";
// import { Feather } from "@expo/vector-icons";
// import Theme from "./Theme";
// import { handlePayment } from "./payment/PhonepePayment";
// import { useUserStore } from "../zustand/Store";
// import { useDispatch, useSelector } from "react-redux";
// import { creditAmount, history } from "../src/features/wallet/walletSlice";
// import { ActivityIndicator } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const { width, height } = Dimensions.get("window");

// const TransactionRow = ({ transaction, onCopy }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const truncateText = (text, maxLength) => {
//     return text?.length > maxLength
//       ? text.substring(0, maxLength) + "..."
//       : text;
//   };

//   // const handleMoneyViaUpi = async()=>{

//   //   const data = {
//   //     amount:100,
//   //     client_txn_id:"ODER12345",
//   //     p_info:"BlueHills store",
//   //     redirect_url:"https://www.google.com",
//   //     key:"2288d274-6574-4e0d-bf69-259c387cb2e1",
//   //     customer_name:"lauda lehsun"
//   //   }

//   //   const res = await axios.post("https://api.ekqr.in/api/create_oder",data)

//   //   if(res?.data?.data){

//   //   }
//   // }

//   return (
//     <Animated.View style={[styles.transactionRow, { opacity: fadeAnim }]}>
//       <View style={styles.transactionCell}>
//         <Text style={styles.transactionText}>
//           {formatDate(transaction.transaction_date)}
//         </Text>
//       </View>
//       <View style={styles.transactionCell}>
//         <Text style={styles.transactionText}>
//           {truncateText(transaction.reference_id, 8)}
//         </Text>
//       </View>
//       <View style={styles.transactionCell}>
//         <Text style={[styles.transactionText, styles.amountText]}>
//           ₹{transaction.transaction_amount}
//         </Text>
//       </View>
//       <View style={[styles.transactionCell, styles.utrCell]}>
//         <Text style={styles.transactionText}>
//           {truncateText(transaction.utr_no, 8)}
//         </Text>
//         <TouchableOpacity
//           onPress={() => onCopy(transaction.utr_no)}
//           style={styles.copyButton}
//         >
//           <Feather name="copy" size={16} color={Theme.colors.primary} />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.transactionCell}>
//         <View
//           style={[
//             styles.statusBadge,
//             {
//               backgroundColor:
//                 transaction.status === "success" ? "#e6f4ea" : "#fce8e6",
//             },
//           ]}
//         >
//           <Text
//             style={[
//               styles.statusText,
//               {
//                 color: transaction.status === "success" ? "#34a853" : "#ea4335",
//               },
//             ]}
//           >
//             {transaction.status}
//           </Text>
//         </View>
//       </View>
//     </Animated.View>
//   );
// };

// const Wallet = () => {
//   const [customerId, setCustomerId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [selectedOption, setSelectedOption] = useState("Online");
//   const [utrNumber, setUtrNumber] = useState("");
//   const [showHistory, setShowHistory] = useState(false);
//   const [screenshot, setScreenshot] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const info = useSelector((state) => state.wallet);
//   const { mobileNumber, balance, setBalance } = useUserStore();

//   useEffect(() => {
//     dispatch(history());
//     // console.log(`===========================?`, info);
//   }, [dispatch, screenshot]);

//   // const filterData = info?.transactionHistory?.transactions.filter((val)=> val.purpose==="Wallet Recharge")

//   const filteredTransactions = info?.transactionHistory?.transactions?.filter(
//   (item) => item.purpose == "Wallet Recharge" &&item.transaction_mode=="online"
// );

//  console.log(`===========================?`, filteredTransactions);

//   const handleOfflineSubmit = () => {
//     if (!amount || !utrNumber || !screenshot) {
//       alert("Please fill in all fields: Amount, UTR Number, and Screenshot.");
//       return;
//     }

//     const utrPattern = /^[A-Za-z0-9]+$/;
//     if (!utrPattern.test(utrNumber)) {
//       alert("Invalid UTR Number. Please enter a valid UTR number.");
//       return;
//     }

//     const data = {
//       transaction_amount: amount,
//       utr_no: utrNumber,
//       remark: "Adding funds to wallet",
//       payment_screenshot: screenshot,
//     };

//     setSubmitted(true);
//     dispatch(creditAmount(data))
//       .then(() => {
//         setAmount("");
//         setUtrNumber("");
//         setScreenshot(null);
//       })
//       .catch((error) => {
//         console.error("Error submitting offline payment:", error);
//       });
//   };

//   const handleScreenshotUpload = async () => {
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         quality: 1,
//       });

//       if (!result.canceled && result.assets?.length > 0) {
//         setScreenshot(result.assets[0].uri);
//       }
//     } catch (error) {
//       console.error("Error uploading screenshot:", error);
//       alert("Failed to upload screenshot. Please try again.");
//     }
//   };

//   const handleAmountSelection = (value) => {
//     setAmount(value.toString());
//   };

//   // const handleAddWallet = async () => {
//   //   if (!amount) {
//   //     alert("Please enter an amount");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await handlePayment(amount, mobileNumber);

//   //     if (response === "SUCCESS") {
//   //       const numericAmount = parseFloat(amount);
//   //       const handleOnlineData = {
//   //         transaction_mode: selectedOption,
//   //         transaction_amount: amount,
//   //         transaction_type: "credit",
//   //         utr_no: "UTR" + Math.floor(1000000000 + Math.random() * 9000000000),
//   //         purpose: "Wallet Recharge",
//   //         remark: "Adding funds to wallet",
//   //       };

//   //       await dispatch(creditAmount(handleOnlineData));
//   //       setBalance(balance + numericAmount);
//   //       setAmount("");
//   //       navigation.navigate("PaymentStatus", {
//   //         message: "Payment Successful",
//   //         statusColor: "green",
//   //         amount: amount,
//   //       });
//   //     } else {
//   //       navigation.navigate("PaymentStatus", {
//   //         message: "Payment Failed",
//   //         statusColor: "red",
//   //         amount: amount,
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error("Payment error:", error);
//   //     alert("Payment failed. Please try again.");
//   //   }
//   // };

//   const handleAddWallet = async () => {
//     if (!amount) {
//       alert("Please enter an amount");
//       return;
//     }
//     const token = await AsyncStorage.getItem("access_token");
//     try {

//       const headers = {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       };

//       // const res = await axios.post("https://bbpslcrapi.lcrpay.com/recharge/add-money-to-wallet",{"amount":amount},{headers})

//       const res = await axios.post("https://bbpslcrapi.lcrpay.com/recharge/add-money-to-wallet", { "amount": amount }, { headers });

//       // console.log("-------------> res.data", res.data);
//       const qr = res.data.data.payment_url

//       if (res.data?.data) {
//         navigation.navigate("PaymentQR", { qrCode: qr })
//       }

//     } catch (error) {
//       console.error("Payment error:", error);
//       alert("Payment failed. Please try again.");
//     }
//   };

//   const copyToClipboard = async (text) => {
//     try {
//       await Clipboard.setStringAsync(text);
//       alert("Copied to clipboard");
//     } catch (error) {
//       console.error("Failed to copy:", error);
//     }
//   };

//   const renderTransactionHistory = () => {
//  const transactionsToShow =
//   selectedOption === "Online"
//     ? info?.transactionHistory?.transactions?.filter(
//         (item) =>
//           item.purpose === "Wallet Recharge" &&
//           item.transaction_mode?.toLowerCase() === "online"
//       )
//     : info?.transactionHistory?.transactions?.filter(
//         (item) =>
//           item.purpose === "Wallet Recharge" &&
//           item.transaction_mode?.toLowerCase() === "offline"
//       );
//   if (!transactionsToShow?.length) {
//     return (
//       <View style={styles.emptyState}>
//         <Feather name="inbox" size={48} color="#ccc" />
//         <Text style={styles.emptyStateText}>No transactions yet</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView horizontal style={{ flexGrow: 0, borderRadius: 8, borderWidth: 1, borderColor: "#e9ecef" }}>
//   <View style={{ minWidth: 550 /* 110 * 5 columns */ }}>
//     <View style={styles.transactionHeader}>
//       <Text style={styles.headerCell}>Date</Text>
//       <Text style={styles.headerCell}>Trans ID</Text>
//       <Text style={styles.headerCell}>Amount</Text>
//       <Text style={styles.headerCell}>UTR</Text>
//       <Text style={styles.headerCell}>Status</Text>
//     </View>
//     <View style={styles.transactionList}>
//       {transactionsToShow.map((transaction) => (
//         <TransactionRow
//           key={transaction.id}
//           transaction={transaction}
//           onCopy={copyToClipboard}
//         />
//       ))}
//     </View>
//   </View>
// </ScrollView>
//   );
// };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.header}>
//         {/* <View style={styles.balanceContainer}>
//           <Text style={styles.balanceLabel}>Available Balance</Text>
//           <Text style={styles.balanceAmount}>₹{info?.transactionHistory === null ? 0 : info?.transactionHistory?.final_amount}</Text>
//         </View> */}
//       </View>

//       <View style={styles.mainContent}>
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               selectedOption === "Online" && styles.selectedTab,
//             ]}
//             onPress={() => setSelectedOption("Online")}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 selectedOption === "Online" && styles.selectedTabText,
//               ]}
//             >
//               Online
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               selectedOption === "Offline" && styles.selectedTab,
//             ]}
//             onPress={() => setSelectedOption("Offline")}
//           >
//             <Text
//               style={[
//                 styles.tabText,
//                 selectedOption === "Offline" && styles.selectedTabText,
//               ]}
//             >
//               offline
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {selectedOption === "Online" ? (
//           <View style={styles.onlineSection}>
//             <Text style={styles.sectionTitle} onPress={() => {
//               handleMoneyViaUpi
//             }}>Add Money to Wallet</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Amount"
//               keyboardType="numeric"
//               value={amount}
//               onChangeText={setAmount}
//             />
//             <View style={styles.quickAmounts}>
//               {[100, 500, 1000, 2000].map((value) => (
//                 <TouchableOpacity
//                   key={value}
//                   style={styles.quickAmountButton}
//                   onPress={() => handleAmountSelection(value)}
//                 >
//                   <Text style={styles.quickAmountText}>₹{value}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={handleAddWallet}
//               disabled={!amount}
//             >
//               <Text style={styles.addButtonText}>Add Money</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={styles.offlineSection}>
//             <View style={styles.bankDetails}>
//               <View style={styles.bankRow}>
//                 <Text style={styles.bankLabel}>Bank Name</Text>
//                 <View style={styles.bankValue}>
//                   <Text style={styles.bankText}>Union Bank of India</Text>
//                   <TouchableOpacity onPress={() => copyToClipboard("Union Bank of India")}>
//                     <Feather
//                       name="copy"
//                       size={18}
//                       color={Theme.colors.primary}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <View style={styles.bankRow}>
//                 <Text style={styles.bankLabel}>Account Number</Text>
//                 <View style={styles.bankValue}>
//                   <Text style={styles.bankText}>617501010050444</Text>
//                   <TouchableOpacity
//                     onPress={() => copyToClipboard("617501010050444")}
//                   >
//                     <Feather
//                       name="copy"
//                       size={18}
//                       color={Theme.colors.primary}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <View style={styles.bankRow}>
//                 <Text style={styles.bankLabel}>IFSC Code</Text>
//                 <View style={styles.bankValue}>
//                   <Text style={styles.bankText}>UBIN0561754</Text>
//                   <TouchableOpacity
//                     onPress={() => copyToClipboard("UBIN0561754")}
//                   >
//                     <Feather
//                       name="copy"
//                       size={18}
//                       color={Theme.colors.primary}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//               <View style={styles.bankRow}>
//                 <Text style={styles.bankLabel}>Account Holder</Text>
//                 <View style={styles.bankValue}>
//                   <Text style={[styles.bankText, { width: 100 }]}>
//                     Lucreway pay private limited
//                   </Text>
//                   <TouchableOpacity
//                     onPress={() =>
//                       copyToClipboard("Lucreway pay private limited")
//                     }
//                   >
//                     <Feather
//                       name="copy"
//                       size={18}
//                       color={Theme.colors.primary}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>

//             <TextInput
//               style={styles.input}
//               placeholder="Enter Amount"
//               keyboardType="numeric"
//               value={amount}
//               onChangeText={setAmount}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Enter UTR Number"
//               value={utrNumber}
//               onChangeText={setUtrNumber}
//             />

//             <TouchableOpacity
//               style={styles.uploadButton}
//               onPress={handleScreenshotUpload}
//             >
//               <Feather
//                 name="upload"
//                 size={20}
//                 color="#fff"
//                 style={styles.uploadIcon}
//               />
//               <Text style={styles.uploadButtonText}>
//                 {screenshot ? "Change Screenshot" : "Upload Payment Screenshot"}
//               </Text>
//             </TouchableOpacity>

//             {screenshot && (
//               <Image
//                 source={{ uri: screenshot }}
//                 style={styles.screenshotPreview}
//               />
//             )}

//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 (!amount || !utrNumber || !screenshot) && styles.disabledButton,
//               ]}
//               onPress={handleOfflineSubmit}
//               disabled={!amount || !utrNumber || !screenshot || submitted}
//             >
//               {info.loading ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit Payment</Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         )}

//         <View style={styles.transactionSection}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Recent Transactions</Text>
//             <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
//               <Text style={styles.viewAllText}>
//                 {showHistory ? "Hide" : "View All"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           <View style={{ flex: 1 }}>
//             {showHistory ? renderTransactionHistory() : ""}
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   header: {
//     backgroundColor: Theme.colors.primary,
//     paddingTop: Platform.OS === "ios" ? 60 : 40,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   balanceContainer: {
//     alignItems: "center",
//   },
//   balanceLabel: {
//     color: "rgba(255, 255, 255, 0.8)",
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   balanceAmount: {
//     color: "#fff",
//     fontSize: 32,
//     fontWeight: "600",
//   },
//   mainContent: {
//     flex: 1,
//     marginTop: -20,
//     backgroundColor: "#f8f9fa",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   selectedTab: {
//     backgroundColor: Theme.colors.primary,
//   },
//   tabText: {
//     fontSize: 16,
//     color: "#666",
//     fontWeight: "500",
//   },
//   selectedTabText: {
//     color: "#fff",
//   },
//   onlineSection: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 16,
//   },
//   input: {
//     backgroundColor: "#f8f9fa",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//   },
//   quickAmounts: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   quickAmountButton: {
//     backgroundColor: "#f8f9fa",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//   },
//   quickAmountText: {
//     fontSize: 14,
//     color: "#666",
//     fontWeight: "500",
//   },
//   addButton: {
//     backgroundColor: Theme.colors.primary,
//     borderRadius: 8,
//     padding: 16,
//     alignItems: "center",
//   },
//   addButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   offlineSection: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   bankDetails: {
//     backgroundColor: "#f8f9fa",
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 20,
//   },
//   bankRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e9ecef",
//   },
//   bankLabel: {
//     fontSize: 14,
//     color: "#666",
//   },
//   bankValue: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   bankText: {
//     fontSize: 14,
//     color: "#333",
//     fontWeight: "500",
//   },
//   uploadButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Theme.colors.primary,
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   uploadIcon: {
//     marginRight: 8,
//   },
//   uploadButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   screenshotPreview: {
//     width: "100%",
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   submitButton: {
//     backgroundColor: Theme.colors.primary,
//     borderRadius: 8,
//     padding: 16,
//     alignItems: "center",
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   // -------------------------------
//   // Transaction Table styles start
//   // -------------------------------
//   transactionSection: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   viewAllText: {
//     color: Theme.colors.primary,
//     fontSize: 14,
//     fontWeight: "500",
//   },

//   transactionTable: {
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//   },
//   transactionHeader: {
//     flexDirection: "row",
//     backgroundColor: "#f8f9fa",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e9ecef",
//   },
//   headerCell: {
//     width: 110,              // Fixed width for columns
//     paddingVertical: 12,
//     borderRightWidth: 1,
//     borderRightColor: "#e9ecef",
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#666",
//     textAlign: "center",
//   },
//   transactionList: {
//     maxHeight: 300,
//   },
//   transactionRow: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e9ecef",
//   },
//   transactionCell: {
//     width: 110,              // Same fixed width as header for alignment
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderRightWidth: 1,
//     borderRightColor: "#e9ecef",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   transactionText: {
//     fontSize: 13,
//     color: "#333",
//   },
//   amountText: {
//     fontWeight: "600",
//     color: Theme.colors.primary,
//   },
//   utrCell: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 110,
//   },
//   // Remove borderRight on last cell for cleaner edge (optional)
//   lastCell: {
//     borderRightWidth: 0,
//   },

//   emptyState: {
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 32,
//   },
//   emptyStateText: {
//     marginTop: 8,
//     color: "#666",
//     fontSize: 14,
//   },
// });

// export default Wallet;

// SabPaisaPaymentScreen.js
// import React, { useState } from "react";
// import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from "react-native";
// import axios from "axios";
// import { WebView } from "react-native-webview";

// const SabPaisaPaymentScreen = () => {
//   const [payerName, setPayerName] = useState("");
//   const [payerEmail, setPayerEmail] = useState("");
//   const [payerMobile, setPayerMobile] = useState("");
//   const [amount, setAmount] = useState("");
//   const [formHTML, setFormHTML] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);

//   const initiatePayment = async () => {
//     // Basic input validation
//     if (!payerName || !payerEmail || !payerMobile || !amount) {
//       Alert.alert("Error", "Please fill in all required fields.");
//       return;
//     }

//     if (!/^\d{10}$/.test(payerMobile)) {
//       Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
//       return;
//     }

//     if (!/^\d+(\.\d{1,2})?$/.test(amount) || parseFloat(amount) <= 0) {
//       Alert.alert("Error", "Please enter a valid amount.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new URLSearchParams();
//       formData.append("payerName", payerName);
//       formData.append("payerEmail", payerEmail);
//       formData.append("payerMobile", payerMobile);
//       formData.append("amount", amount);

//       const response = await axios.post(
//         "https://bbpslcrapi.lcrpay.com/recharge/create-payment",  // Updated to live URL
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );

//       const { encData, clientCode, paymentUrl } = response.data;
//       console.log("Response from backend:", response.data);

//       const html = `
//         <html>
//         <head>
//           <meta http-equiv="Content-Type" content="application/x-www-form-urlencoded;charset=UTF-8" />
//         </head>
//         <body>
//           <form id="sabForm" method="post" action="${paymentUrl}">
//             <input type="hidden" name="encData" value="${encData}" />
//             <input type="hidden" name="clientCode" value="${clientCode}" />
//           </form>
//           <script>document.getElementById('sabForm').submit();</script>
//         </body>
//         </html>
//       `;

//       setFormHTML(html);
//       setLoading(false);
//       console.log("Form HTML being submitted:", html);
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//       setLoading(false);
//       Alert.alert("Error", "Failed to initiate payment. Please check if the backend server is running and the endpoint is correct.");
//     }
//   };

//   const handleNavigationStateChange = (navState) => {
//     const { url } = navState;
//     console.log("WebView navigation state:", url);
//     if (url.includes("sabpaisa/callback")) {
//       // Payment completed, determine status
//       if (url.includes("statusCode=0000")) {
//         setPaymentStatus("Success");
//         Alert.alert("Payment Successful", "Your payment was completed successfully!");
//       } else if (url.includes("statusCode=0300")) {
//         setPaymentStatus("Failed");
//         Alert.alert("Payment Failed", "Your payment failed. Please try again.");
//       } else {
//         setPaymentStatus("Unknown");
//         Alert.alert("Payment Status Unknown", "Please check your transaction status.");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {!formHTML ? (
//         <>
//           <Text style={styles.label}>Payer Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your name"
//             value={payerName}
//             onChangeText={setPayerName}
//           />
//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your email"
//             value={payerEmail}
//             onChangeText={setPayerEmail}
//             keyboardType="email-address"
//           />
//           <Text style={styles.label}>Mobile Number</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your mobile number"
//             value={payerMobile}
//             onChangeText={setPayerMobile}
//             keyboardType="numeric"
//             maxLength={10}
//           />
//           <Text style={styles.label}>Amount</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter amount"
//             value={amount}
//             onChangeText={setAmount}
//             keyboardType="numeric"
//           />
//           <Button
//             title={loading ? "Processing..." : "Make Payment"}
//             onPress={initiatePayment}
//             disabled={loading}
//           />
//         </>
//       ) : paymentStatus ? (
//         <View style={styles.statusContainer}>
//           <Text style={styles.statusText}>Payment Status: {paymentStatus}</Text>
//           <Button
//             title="Try Again"
//             onPress={() => {
//               setFormHTML(null);
//               setPaymentStatus(null);
//             }}
//           />
//         </View>
//       ) : (
//         <WebView
//           originWhitelist={["*"]}
//           source={{ html: formHTML }}
//           javaScriptEnabled
//           style={{ flex: 1 }}
//           onNavigationStateChange={handleNavigationStateChange}
//         />
//       )}
//       {loading && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color="#0000ff" />
//           <Text>Preparing payment...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(255, 255, 255, 0.8)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   statusContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   statusText: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
// });

// export default SabPaisaPaymentScreen;

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  Animated,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Theme from "./Theme";
import { useDispatch, useSelector } from "react-redux";
import { creditAmount, history } from "../src/features/wallet/walletSlice";
import { BASE_URL } from "../utils/config";

const { width, height } = Dimensions.get("window");

const TransactionRow = ({ transaction, onCopy }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Animated.View style={[styles.transactionRow, { opacity: fadeAnim }]}>
      <View style={styles.transactionCell}>
        <Text style={styles.transactionText}>
          {formatDate(transaction.transaction_date)}
        </Text>
      </View>
      <View style={styles.transactionCell}>
        <Text style={styles.transactionText}>
          {truncateText(transaction.reference_id, 8)}
        </Text>
      </View>
      <View style={styles.transactionCell}>
        <Text style={[styles.transactionText, styles.amountText]}>
          ₹{transaction.transaction_amount}
        </Text>
      </View>
      <View style={[styles.transactionCell, styles.utrCell]}>
        <Text style={styles.transactionText}>
          {truncateText(transaction.utr_no, 8)}
        </Text>
        <TouchableOpacity
          onPress={() => onCopy(transaction.utr_no)}
          style={styles.copyButton}
        >
          <Feather name="copy" size={16} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.transactionCell}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                transaction.status === "success" ? "#e6f4ea" : "#fce8e6",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: transaction.status === "success" ? "#34a853" : "#ea4335",
              },
            ]}
          >
            {transaction.status}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const Wallet = () => {
  const [payerName, setPayerName] = useState("");
  const [payerEmail, setPayerEmail] = useState("");
  const [payerMobile, setPayerMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedOption, setSelectedOption] = useState("Online");
  const [utrNumber, setUtrNumber] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formHTML, setFormHTML] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [balance, setBalance] = useState(0);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const info = useSelector((state) => state.wallet);

  useEffect(() => {
    dispatch(history());
  }, [dispatch, screenshot]);

  const handleOfflineSubmit = () => {
    if (!amount || !utrNumber || !screenshot) {
      Alert.alert(
        "Error",
        "Please fill in all fields: Amount, UTR Number, and Screenshot."
      );
      return;
    }

    const utrPattern = /^[A-Za-z0-9]+$/;
    if (!utrPattern.test(utrNumber)) {
      Alert.alert(
        "Error",
        "Invalid UTR Number. Please enter a valid UTR number."
      );
      return;
    }

    const data = {
      transaction_amount: amount,
      utr_no: utrNumber,
      remark: "Adding funds to wallet",
      payment_screenshot: screenshot,
    };

    setSubmitted(true);
    dispatch(creditAmount(data))
      .then(() => {
        setAmount("");
        setUtrNumber("");
        setScreenshot(null);
        setSubmitted(false);
      })
      .catch((error) => {
        console.error("Error submitting offline payment:", error);
        setSubmitted(false);
      });
  };

  const handleScreenshotUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setScreenshot(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      Alert.alert("Error", "Failed to upload screenshot. Please try again.");
    }
  };

  const handleAmountSelection = (value) => {
    setAmount(value.toString());
  };

  const handleAddWallet = async () => {
    if (!payerName || !payerEmail || !payerMobile || !amount) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!/^\d{10}$/.test(payerMobile)) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append("payerName", payerName);
      formData.append("payerEmail", payerEmail);
      formData.append("payerMobile", payerMobile);
      formData.append("amount", amount);

      const response = await axios.post(
        `${BASE_URL}/recharge/recharge/create-payment`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { encData, clientCode, paymentUrl } = response.data;
      console.log("Response from backend:", response.data);

      const html = `
        <html>
        <head>
          <meta http-equiv="Content-Type" content="application/x-www-form-urlencoded;charset=UTF-8" />
        </head>
        <body>
          <form id="paymentForm" method="post" action="${paymentUrl}">
            <input type="hidden" name="encData" value="${encData}" />
            <input type="hidden" name="clientCode" value="${clientCode}" />
          </form>
          <script>document.getElementById('paymentForm').submit();</script>
        </body>
        </html>
      `;

      setFormHTML(html);
      setLoading(false);
      console.log("Form HTML being submitted:", html);
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
      Alert.alert(
        "Error",
        "Failed to initiate payment. Please check if the server is running and the endpoint is correct."
      );
    }
  };

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    console.log("WebView navigation state:", url);
    if (url.includes("recharge/sabpaisa/callback")) {
      if (url.includes("statusCode=0000")) {
        const numericAmount = parseFloat(amount);
        const handleOnlineData = {
          transaction_mode: selectedOption,
          transaction_amount: amount,
          transaction_type: "credit",
          utr_no: "UTR" + Math.floor(1000000000 + Math.random() * 9000000000),
          purpose: "Wallet Recharge",
          remark: "Adding funds to wallet",
        };

        dispatch(creditAmount(handleOnlineData));
        setBalance(balance + numericAmount);
        setPaymentStatus("Success");
        Alert.alert(
          "Payment Successful",
          "Your payment was completed successfully!"
        );
        setPayerName("");
        setPayerEmail("");
        setPayerMobile("");
        setAmount("");
      } else if (url.includes("statusCode=0300")) {
        setPaymentStatus("Failed");
        Alert.alert("Payment Failed", "Your payment failed. Please try again.");
      } else {
        setPaymentStatus("Unknown");
        Alert.alert(
          "Payment Status Unknown",
          "Please check your transaction status."
        );
      }
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Success", "Copied to clipboard");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const renderTransactionHistory = () => {
    const transactionsToShow =
      selectedOption === "Online"
        ? info?.transactionHistory?.transactions?.filter(
            (item) =>
              item.purpose === "Wallet Recharge" &&
              item.transaction_mode?.toLowerCase() === "online"
          )
        : info?.transactionHistory?.transactions?.filter(
            (item) =>
              item.purpose === "Wallet Recharge" &&
              item.transaction_mode?.toLowerCase() === "offline"
          );

    if (!transactionsToShow?.length) {
      return (
        <View style={styles.emptyState}>
          <Feather name="inbox" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No transactions yet</Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        style={{
          flexGrow: 0,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e9ecef",
        }}
      >
        <View style={{ minWidth: 550 }}>
          <View style={styles.transactionHeader}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Trans ID</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>UTR</Text>
            <Text style={styles.headerCell}>Status</Text>
          </View>
          <View style={styles.transactionList}>
            {transactionsToShow.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                onCopy={copyToClipboard}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedOption === "Online" && styles.selectedTab,
            ]}
            onPress={() => setSelectedOption("Online")}
          >
            <Text
              style={[
                styles.tabText,
                selectedOption === "Online" ? styles.selectedTabText : null,
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedOption === "Offline" && styles.selectedTab,
            ]}
            onPress={() => setSelectedOption("Offline")}
          >
            <Text
              style={[
                styles.tabText,
                selectedOption === "Offline" ? styles.selectedTabText : null,
              ]}
            >
              Offline
            </Text>
          </TouchableOpacity>
        </View>

        {selectedOption === "Online" ? (
          !formHTML ? (
            <View style={styles.onlineSection}>
              <Text style={styles.sectionTitle}>Add Money to Wallet</Text>
              <Text style={styles.label}>Payer Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={payerName}
                onChangeText={setPayerName}
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={payerEmail}
                onChangeText={setPayerEmail}
                keyboardType="email-address"
              />
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                value={payerMobile}
                onChangeText={setPayerMobile}
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              <View style={styles.quickAmounts}>
                {[100, 500, 1000, 2000].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.quickAmountButton}
                    onPress={() => handleAmountSelection(value)}
                  >
                    <Text style={styles.quickAmountText}>₹{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.addButton, loading && styles.disabledButton]}
                onPress={handleAddWallet}
                disabled={loading}
              >
                <Text style={styles.addButtonText}>
                  {loading ? "Processing..." : "Add Money"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : paymentStatus ? (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>
                Payment Status: {paymentStatus}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setFormHTML(null);
                  setPaymentStatus(null);
                }}
              >
                <Text style={styles.addButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WebView
              originWhitelist={["*"]}
              source={{ html: formHTML }}
              javaScriptEnabled
              style={{ flex: 1 }}
              onNavigationStateChange={handleNavigationStateChange}
            />
          )
        ) : (
          <View style={styles.offlineSection}>
            <View style={styles.bankDetails}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Bank Name</Text>
                <View style={styles.bankValue}>
                  <Text style={styles.bankText}>Union Bank of India</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard("Union Bank of India")}
                  >
                    <Feather
                      name="copy"
                      size={18}
                      color={Theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Account Number</Text>
                <View style={styles.bankValue}>
                  <Text style={styles.bankText}>617501010050444</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard("617501010050444")}
                  >
                    <Feather
                      name="copy"
                      size={18}
                      color={Theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>IFSC Code</Text>
                <View style={styles.bankValue}>
                  <Text style={styles.bankText}>UBIN0561754</Text>
                  <TouchableOpacity
                    onPress={() => copyToClipboard("UBIN0561754")}
                  >
                    <Feather
                      name="copy"
                      size={18}
                      color={Theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Account Holder</Text>
                <View style={styles.bankValue}>
                  <Text style={[styles.bankText, { width: 100 }]}>
                    Lucreway pay private limited
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard("Lucreway pay private limited")
                    }
                  >
                    <Feather
                      name="copy"
                      size={18}
                      color={Theme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter UTR Number"
              value={utrNumber}
              onChangeText={setUtrNumber}
            />

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handleScreenshotUpload}
            >
              <Feather
                name="upload"
                size={20}
                color="#fff"
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadButtonText}>
                {screenshot ? "Change Screenshot" : "Upload Payment Screenshot"}
              </Text>
            </TouchableOpacity>

            {screenshot && (
              <Image
                source={{ uri: screenshot }}
                style={styles.screenshotPreview}
              />
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!amount || !utrNumber || !screenshot) && styles.disabledButton,
              ]}
              onPress={handleOfflineSubmit}
              disabled={!amount || !utrNumber || !screenshot || submitted}
            >
              {info.loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Payment</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {!(selectedOption === "Online" && formHTML) && (
          <View style={styles.transactionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
                <Text style={styles.viewAllText}>
                  {showHistory ? "Hide" : "View All"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              {showHistory ? renderTransactionHistory() : ""}
            </View>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Preparing payment...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  mainContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  selectedTab: {
    backgroundColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  selectedTabText: {
    color: "#fff",
  },
  onlineSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  quickAmounts: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  quickAmountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  offlineSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bankDetails: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  bankLabel: {
    fontSize: 14,
    color: "#666",
  },
  bankValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bankText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  screenshotPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  transactionSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  transactionTable: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  transactionHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerCell: {
    width: 110,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#e9ecef",
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
  },
  transactionList: {
    maxHeight: 300,
  },
  transactionRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  transactionCell: {
    width: 110,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 13,
    color: "#333",
  },
  amountText: {
    fontWeight: "600",
    color: Theme.colors.primary,
  },
  utrCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 110,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Wallet;

