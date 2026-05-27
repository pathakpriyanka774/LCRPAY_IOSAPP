import React, { useState, useRef, useEffect } from "react";
import {View,Text,TextInput,Image,TouchableWithoutFeedback,Keyboard,Alert,ActivityIndicator,StyleSheet} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../src/features/wallet/walletSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Theme from "./Theme";
import { BASE_URL } from "../utils/config";

const DIGITS = 6;

const CheckBalancePin = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [pin, setPin] = useState(Array(DIGITS).fill(""));
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(0);

  const user = useSelector((state) => state.register.user);
  const { bank, number, logo, icon } = route.params || {};

  const inputRefs = useRef(Array.from({ length: DIGITS }, () => React.createRef()));

  useEffect(() => {
    dispatch(history());
  }, [user, dispatch]);

  useEffect(() => {
    if (pin.some((digit) => digit !== "")) {
      setShowError(false);
      setError("");
    }
  }, [pin]);

  const focusNextInput = (currentIndex) => {
    if (currentIndex < DIGITS - 1) {
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
    if (text.length > 1) {
      const digits = text.split("").slice(0, DIGITS);
      const newPin = [...pin];
      digits.forEach((digit, i) => {
        if (index + i < DIGITS) newPin[index + i] = digit;
      });
      setPin(newPin);

      if (newPin.join("").length === DIGITS) {
        Keyboard.dismiss();
        setTimeout(() => handlePinSubmit(newPin.join("")), 300);
      }
      return;
    }

    if (text.match(/^[0-9]$/)) {
      const newPin = [...pin];
      newPin[index] = text;
      setPin(newPin);

      if (text !== "") focusNextInput(index);

      if (newPin.every((digit) => digit !== "")) {
        setTimeout(() => handlePinSubmit(newPin.join("")), 300);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      const newPin = [...pin];
      if (newPin[index] === "") {
        if (index > 0) {
          newPin[index - 1] = "";
          setPin(newPin);
          focusPreviousInput(index);
        }
      } else {
        newPin[index] = "";
        setPin(newPin);
      }
    }
  };

  const fetchCoinBalance = async (pinString) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        Alert.alert("Error", "Authentication token missing. Please login again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("📤 Fetching balance with PIN:", pinString);

      const response = await axios.post(
        `${BASE_URL}/transaction/gettotalcoins`,
        { userpin: pinString },
        { headers }
      );

      console.log("📥 Balance Response:", response.data);

      if (response.data.status === "success") {
        navigation.navigate("CoinBalance", {
          bank,
          number,
          logo,
          icon,
          amount: response.data.final_amount,
        });
      } else {
        Alert.alert("Error", response.data.message || "Failed to fetch balance.");
      }
    } catch (error) {
      console.error("❌ Balance Fetch Error:", error);
      Alert.alert("Error", "Something went wrong while fetching balance.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (pinString) => {
    try {
      console.log("✅ handlePinSubmit called with:", pinString, "Length:", pinString.length);
      console.log("⚠️ state.pin currently:", pin, "Length:", pin.join("").length);

      setLoading(true);

      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "Authentication token missing. Please login again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("📤 Verifying PIN:", pinString);

      const response = await axios.post(
        `${BASE_URL}/register/verify_transaction_pin`,
        { pincode: pinString },
        { headers }
      );

      console.log("📥 Verify Response:", response.data);

      if (response.data.status) {
        await fetchCoinBalance(pinString);
      } else {
        Alert.alert("Error", response.data.message || "Incorrect PIN. Try again.");
        setPin(Array(DIGITS).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("❌ Verify Error:", error);
      Alert.alert("Error", "Something went wrong during PIN verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.bankName}>{bank}</Text>
            <Text style={styles.accountNumber}>XXXXX {number?.slice(-4)}</Text>
          </View>
          <Image source={require("../assets/LogoN.png")} style={styles.upiLogo} />
        </View>

        <Text style={styles.pinPrompt}>ENTER 6-DIGIT TRANSACTION PIN</Text>

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
                maxLength={1}
                secureTextEntry={true}
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
            Do not share your Transaction PIN with anyone {"\n"}to avoid fraudulent activity.
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Theme.colors.primary} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CheckBalancePin;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  bankName: { fontSize: 16, fontWeight: "bold", color: "#000" },
  accountNumber: { fontSize: 14, color: "#666" },
  upiLogo: { width: 70, height: 60, resizeMode: "contain" },
  pinPrompt: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 30,
    color: "#333",
  },
  errorText: {
    color: "#d9534f",
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  pinInputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 25,
    gap: 10,
  },
  pinInputBox: {
    width: 45,
    height: 55,
    borderBottomWidth: 2,
    borderBottomColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pinInputBoxError: { borderBottomColor: "#d9534f" },
  pinInputBoxFocused: { borderBottomColor: Theme.colors.primary, borderBottomWidth: 3 },
  pinInput: {
    width: "100%",
    height: "100%",
    fontSize: 22,
    textAlign: "center",
    color: "#000",
  },
  pinPlaceholder: { position: "absolute", fontSize: 28, color: "#bbb" },
  alertBox: {
    flexDirection: "row",
    backgroundColor: "#FFF3CD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
    elevation: 2,
  },
  alertIcon: { fontSize: 16, marginRight: 10 },
  alertText: { fontSize: 14, color: "#666", flex: 1, lineHeight: 20 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});