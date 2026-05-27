import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/config";
import { history } from "../../src/features/wallet/walletSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ActivityIndicator } from "react-native";

const BbpsTransactionPin = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [predefinedPin, setPredefinedPin] = useState("");
  const user = useSelector((state) => state.register.user);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { payload, paymentBnak = "" } = route.params || {};

  // payload

  const balanceHistory = useSelector((state) => state.wallet);
  // console.log("----> balanceHistory", balanceHistory.transactionHistory.final_amount)

  const [pin, setPin] = useState(["", "", "", ""]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [showError, setShowError] = useState(false);
  const [focusedInput, setFocusedInput] = useState(0);

  // Create refs for each input
  const inputRefs = useRef([...Array(4)].map(() => React.createRef()));

  useEffect(() => {
    if (user) {
      dispatch(history());
      setPredefinedPin(user?.user?.TransactionPIN || "");
    }
  }, [user]);

  // Reset error when user starts typing again
  useEffect(() => {
    if (pin.some((digit) => digit !== "")) {
      setShowError(false);
      setError("");
    }
  }, [pin]);

  const focusNextInput = (currentIndex) => {
    if (currentIndex < 3) {
      inputRefs.current[currentIndex + 1]?.focus();
      setFocusedInput(currentIndex + 1);
    } else {
      Keyboard.dismiss();
    }
  };

  const focusPreviousInput = (currentIndex) => {
    if (currentIndex > 0) {
      inputRefs.current[currentIndex - 1]?.focus();
      setFocusedInput(currentIndex - 1);
    }
  };

  const handlePinChange = (text, index) => {
    // Handle pasting of full PIN
    if (text.length > 1) {
      const digits = text.split("").slice(0, 4);
      const newPin = [...pin];

      digits.forEach((digit, i) => {
        if (index + i < 4) {
          newPin[index + i] = digit;
        }
      });

      setPin(newPin);

      if (newPin.join("").length === 4) {
        Keyboard.dismiss();
        setTimeout(() => handlePinSubmit(newPin.join("")), 300);
      }
      return;
    }

    // Handle single digit input
    if (text.match(/^[0-9]$/)) {
      const newPin = [...pin];
      newPin[index] = text;
      setPin(newPin);

      if (text !== "") {
        focusNextInput(index);
      }

      // Check if PIN is complete
      if (newPin.every((digit) => digit !== "")) {
        setTimeout(() => handlePinSubmit(newPin.join("")), 300);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      const newPin = [...pin];

      if (newPin[index] === "") {
        // If current input is empty, clear previous input and move focus back
        if (index > 0) {
          newPin[index - 1] = "";
          setPin(newPin);
          focusPreviousInput(index);
        }
      } else {
        // Clear current input
        newPin[index] = "";
        setPin(newPin);
      }
    }
  };

  // balanceHistory.transactionHistory.final_amount

  // ===========================================================================================================
  // <----------------------  Make A recharge Payment
  //============================================================================================================

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${BASE_URL}/bbps/pay-bill`,
        payload,
        { headers }
      );
      console.log(`set payment status ------->`, response.data);

      setLoading(false);
      if (response.data) {
        navigation.navigate("BbpsTransactionSuccess", {
          successResponse: response.data,
          recipient_name: payload.bbps_service_name,
        });
      } else {
        Alert.alert("Something Went wrong");
      }
    } catch (error) {
      setLoading(false);
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
    }
  };

  // ===========================================================================================================
  // Make A recharge Payment End Here -------------->
  //============================================================================================================

  const handlePinSubmit = (fullPin) => {
    console.log(fullPin, predefinedPin);
    if (fullPin === predefinedPin) {
      setError("");
      setShowError(false);
      handlePayment();
    } else {
      setError("Incorrect PIN. Please try again.");
      setShowError(true);
      setPin(["", "", "", ""]);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
        setFocusedInput(0);
      }, 100);

      Alert.alert(
        "Incorrect PIN",
        "The PIN you entered is incorrect. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.bankName}>HBA WALLET</Text>
            <Text style={styles.accountNumber}>
              XXXXXX{user?.user?.MobileNumber?.slice(-4)}
            </Text>
          </View>
          <Image
            source={require("../../assets/LogoN.png")}
            style={styles.upiLogo}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.toText}>To:</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setDropdownVisible(!isDropdownVisible)}
            >
              <Text style={styles.recipient}>{payload?.bbps_service_name}</Text>
              <AntDesign
                name={isDropdownVisible ? "up" : "down"}
                size={14}
                color="black"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.sendingText}>Sending:</Text>
            <Text style={styles.amount}>₹{payload?.amount}</Text>
          </View>

          {isDropdownVisible && (
            <View style={styles.dropdownContainer}>
              <Text style={styles.detailText}>PAYING TO: {paymentBnak}</Text>
              <Text style={styles.detailText}>Amount: {payload?.amount}</Text>
              <Text style={styles.detailText}>
                Biller Id: {payload?.billerid}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.pinPrompt}>ENTER 4-DIGIT UPI PIN</Text>

        {showError && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.pinInputContainer}>
          {pin.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.pinInputBox,
                showError && styles.pinInputBoxError,
                focusedInput === index && styles.pinInputBoxFocused,
              ]}
            >
              <TextInput
                ref={(el) => (inputRefs.current[index] = el)}
                style={styles.pinInput}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry={digit !== ""}
                value={digit}
                onChangeText={(text) => handlePinChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedInput(index)}
                caretHidden={true}
              />
              {digit === "" && <Text style={styles.pinPlaceholder}>_</Text>}
            </View>
          ))}
        </View>

        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <Text style={styles.alertText}>
            You are transferring money from your HBA Wallet to {paymentBnak}
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  accountNumber: {
    fontSize: 14,
    color: "#666",
  },
  upiLogo: {
    width: 70,
    height: 60,
    resizeMode: "contain",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  detailsContainer: {
    marginVertical: 10,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toText: {
    fontSize: 12,
    color: "#666",
  },
  recipient: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendingText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  dropdownContainer: {
    marginTop: 10,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  pinPrompt: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  errorText: {
    color: "#d9534f",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  pinInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 15,
  },
  pinInputBox: {
    width: 50,
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pinInputBoxError: {
    borderBottomColor: "#d9534f",
  },
  pinInputBoxFocused: {
    borderBottomColor: "green",
    borderBottomWidth: 3,
  },
  pinInput: {
    width: "100%",
    height: "100%",
    fontSize: 24,
    textAlign: "center",
    color: "#000",
  },
  pinPlaceholder: {
    position: "absolute",
    fontSize: 30,
    color: "#888",
  },
  alertBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  alertText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BbpsTransactionPin;
