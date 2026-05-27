import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
 
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  Alert,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import Theme from "./Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView} from 'react-native-safe-area-context';
import { BASE_URL } from "../utils/config";

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipientNumber, recipientName } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSenderInfo, setShowSenderInfo] = useState(false);
  const [upiIssueModal, setUpiIssueModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const checkBankServer = async () => {
    // Simulate an API call to check bank status (Replace with real API call)
    const isServerDown = true; // Set dynamically based on real API response
    return isServerDown;
  };

  const handleInputChange = (text) => {
    if (/^\d/.test(text)) {
      setInputText(`₹${text.replace(/^₹/, "")}`);
      setShowSenderInfo(true);
    } else {
      setInputText(text.replace(/^₹/, ""));
      setShowSenderInfo(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || /^\d/.test(inputText)) return;

    const newMessage = {
      id: Date.now(),
      date: "Today",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePay = () => {
    // setUpiIssueModal(true);

    if (/^\d+$/.test(inputText.replace(/^₹/, ""))) {
      // console.log("Payment successful");
      navigation.navigate("SelfPaymentPin", {
        amount: inputText,
        mobile_number: recipientNumber,
        recipient_name: recipientName,
      });
    }
  };

  // ========================================================================================
  // Fetch transaction history from API
  // ========================================================================================

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        console.error("Token is missing!");
        Alert.alert(
          "Error",
          "Authentication token is missing. Please login again."
        );
        setLoading(false);
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${BASE_URL}/transaction/p2ptransactionhistory`,
        { mobile_number: recipientNumber },
        { headers }
      );

      if (response.data && response.data.data) {
        const transactionData = response.data.data;
        console.log("Data fetched successfully: ", transactionData);

        // Transform API data to message format
        const formattedMessages = transactionData.map((transaction, index) => {
          return {
            id: index + 1,
            date: formatDate(transaction.sent_date),
            amount: transaction.amount > 0 ? `₹${transaction.amount}` : "₹0",
            time: formatTime(transaction.sent_date),
            sender: transaction.trans_type === "sent" ? "me" : "other",
            receiverName: transaction.receiver_name,
            receiverMobile: transaction.receiver_mobile,
          };
        });

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error.message);
      Alert.alert(
        "Error",
        "Failed to load transaction history. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // ============================================================================================
  // Navigate to the HomeScreen (solving the stacking issue )
  // ============================================================================================

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("HomeScreen"); // Always navigate to HomeScreen
        return true; // Prevent default back behavior
      };

     const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {recipientName?.charAt(0) || "U"}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{recipientName || "User"}</Text>
            <Text style={styles.userPhone}>{recipientNumber}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Feather name="clock" size={24} color="white" style={styles.icon} />
          <Feather
            name="help-circle"
            size={24}
            color="white"
            style={styles.icon}
          />
          <Feather
            name="more-vertical"
            size={24}
            color="white"
            style={styles.icon}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Loading transaction history...</Text>
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No transactions yet</Text>
          <Text style={styles.emptySubText}>
            Start by sending money or a message
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80, paddingTop: 10 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === "me"
                  ? styles.sentMessage
                  : styles.receivedMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  item.sender === "me"
                    ? styles.sentBubble
                    : styles.receivedBubble,
                  item.sender === "me"
                    ? { alignSelf: "flex-end" }
                    : { alignSelf: "flex-start" },
                ]}
              >
                <Text style={styles.date}>{item.date}</Text>
                {item.text && (
                  <Text style={styles.messageText}>{item.text}</Text>
                )}

                {item.amount && (
                  <Text style={styles.amount}>{item.amount}</Text>
                )}

                {item.image && (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.sentImage}
                  />
                )}

                <View style={styles.upperBorder}></View>

                {item.sender === "me" ? (
                  <Text style={styles.status}>✅ Sent Securely</Text>
                ) : (
                  <Text style={styles.receivedStatus}>
                    ✅ Received Instantly
                  </Text>
                )}
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={upiIssueModal}
        onRequestClose={() => setUpiIssueModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              source={require("../assets/warning.png")}
              style={styles.issueImage}
            />
            <Text style={styles.modalTitle}>UPI issue at Canara Bank!</Text>
            <Text style={styles.modalText}>
              Canara Bank is facing high payment failures on all UPI apps.
              Please try after some time.
            </Text>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setUpiIssueModal(false)}
            >
              <Text style={styles.continueText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount or chat"
            placeholderTextColor="#999"
            value={inputText}
            keyboardType="default"
            onChangeText={handleInputChange}
          />

          {/^\d+$/.test(inputText.replace(/^₹/, "")) ? (
            <TouchableOpacity onPress={handlePay} style={styles.payButton}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Feather
                name="send"
                size={24}
                style={[
                  styles.inputIcon,
                  { color: inputText.trim() ? "#007BFF" : "#ccc" },
                ]}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBE8FC",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: Theme.colors.primary,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.colors.primary,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  userPhone: {
    color: "#ccc",
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  messageContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
  },
  sentMessage: {
    alignItems: "flex-end",
  },
  receivedMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    padding: 15,
    borderRadius: 15,
    maxWidth: "75%",
    minWidth: "40%",
    position: "relative",
  },
  sentBubble: {
    backgroundColor: "#D1F4C9", // Light green for sent messages
    borderBottomRightRadius: 5,
  },
  receivedBubble: {
    backgroundColor: "#FFFFFF", // White for received messages
    borderBottomLeftRadius: 5,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 5,
  },
  sentImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 5,
  },
  upperBorder: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    marginTop: 8,
    marginBottom: 5,
  },
  status: {
    color: "green",
    fontSize: 12,
  },
  receivedStatus: {
    color: "green",
    fontSize: 12,
  },
  time: {
    fontSize: 11,
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 2,
  },
  inputContainer: {
    position: "absolute",
    backgroundColor: Theme.colors.primary,
    padding: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  inputIcon: {
    marginLeft: 10,
  },
  payButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  payButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    width: "85%",
    elevation: 5,
  },
  issueImage: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#E53935", // Red color for warning
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  continueText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChatScreen;
