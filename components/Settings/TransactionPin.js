import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Theme from "../Theme";
import { BASE_URL } from "../../utils/config";

const DIGITS = 6;

const TransactionPin = () => {
  const navigation = useNavigation();
  const userdata = useSelector((state) => state.register.user);

  useEffect(() => {
    console.log("User:", userdata);
  }, [userdata]);

  const [pin, setPin] = useState(Array(DIGITS).fill(""));
  const [confirmPin, setConfirmPin] = useState(Array(DIGITS).fill(""));
  const [loading, setLoading] = useState(false);

  const pinRefs = useRef(Array.from({ length: DIGITS }, () => React.createRef()));
  const confirmPinRefs = useRef(Array.from({ length: DIGITS }, () => React.createRef()));

  const isComplete = useMemo(
    () => pin.every(Boolean) && confirmPin.every(Boolean),
    [pin, confirmPin]
  );

  const fillFromString = (s, setter) => {
    const only = s.replace(/\D/g, "").slice(0, DIGITS).split("");
    const arr = Array(DIGITS).fill("");
    for (let i = 0; i < only.length; i++) arr[i] = only[i];
    setter(arr);
    return only.length;
  };

  const focusNext = (refs, index) => {
    if (index < DIGITS - 1) refs.current[index + 1]?.current?.focus();
  };
  const focusPrev = (refs, index) => {
    if (index > 0) refs.current[index - 1]?.current?.focus();
  };

  const handlePinChange = (value, index, isConfirm = false) => {
    const v = value.replace(/[^0-9]/g, "");
    const arr = isConfirm ? [...confirmPin] : [...pin];

    if (v.length > 1) {
      const wrote = fillFromString(v, isConfirm ? setConfirmPin : setPin);
      const refs = isConfirm ? confirmPinRefs : pinRefs;
      const nextIndex = Math.min(wrote - 1, DIGITS - 1);
      refs.current[nextIndex]?.current?.focus();
      return;
    }

    arr[index] = v.slice(0, 1);
    (isConfirm ? setConfirmPin : setPin)(arr);
    if (v) focusNext(isConfirm ? confirmPinRefs : pinRefs, index);
  };

  const handleKeyPress = (e, index, isConfirm = false) => {
    if (e.nativeEvent.key !== "Backspace") return;
    const arr = isConfirm ? confirmPin : pin;
    if (!arr[index]) {
      focusPrev(isConfirm ? confirmPinRefs : pinRefs, index);
    }
  };

  const handleSet = async () => {
    const pinString = pin.join("");
    const confirmPinString = confirmPin.join("");

    if (!/^\d{6}$/.test(pinString)) {
      Alert.alert("Invalid PIN", "Transaction PIN must be exactly 6 digits.");
      return;
    }
    if (pinString !== confirmPinString) {
      Alert.alert("Mismatch", "Transaction PINs do not match.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Auth error", "Please log in again.");
        return;
      }

      setLoading(true);
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const resp = await axios.post(
        `${BASE_URL}/register/create_transaction_pin`,
        { enter_pin: pinString },
        { headers }
      );

      console.log(resp?.data)

      if (resp?.data?.status) {
        Alert.alert("Success",resp?.data?.message);

        navigation.reset({
          index: 0,
          routes: [{ name: "HomeScreen" }],
        });
      }
    } catch (err) {
      console.log("PIN set error:", err?.response?.data || err?.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPinInputs = (values, refs, isConfirm = false) => (
    <View style={styles.pinContainer}>
      {values.map((digit, index) => (
        <TextInput
          key={index}
          ref={refs.current[index]}
          style={styles.pinInput}
          value={digit}
          onChangeText={(v) => handlePinChange(v, index, isConfirm)}
          onKeyPress={(e) => handleKeyPress(e, index, isConfirm)}
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
          maxLength={1}
          secureTextEntry
          textContentType="oneTimeCode"
          selectTextOnFocus
          onFocus={() => {
            if (digit) {
              refs.current[index].current?.setNativeProps?.({
                selection: { start: 0, end: 1 },
              });
            }
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content} onTouchStart={Keyboard.dismiss}>
        <Text style={styles.title}>Set Transaction PIN for your LCR account</Text>

        <View style={styles.pinSection}>
          <Text style={styles.subtitle}>Enter 6-digit Transaction PIN</Text>
          {renderPinInputs(pin, pinRefs)}

          <Text style={styles.subtitle}>Re-enter Transaction PIN</Text>
          {renderPinInputs(confirmPin, confirmPinRefs, true)}
        </View>

        <TouchableOpacity
          style={[
            styles.setButton,
            isComplete ? styles.setButtonActive : styles.setButtonInactive,
          ]}
          onPress={handleSet}
          disabled={!isComplete || loading}
          activeOpacity={0.9}
        >
          <Text style={styles.setButtonText}>
            {loading ? "Saving..." : "Set Transaction PIN"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionPin;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 24 },
  pinSection: { marginBottom: 24 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 12 },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  pinInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: Theme.colors.primary,
    borderRadius: 10,
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  setButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  setButtonActive: { backgroundColor: Theme.colors.primary },
  setButtonInactive: { backgroundColor: Theme.colors.primary, opacity: 0.5 },
  setButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
