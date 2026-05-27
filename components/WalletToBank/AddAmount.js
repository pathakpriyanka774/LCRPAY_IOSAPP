import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import Theme from "../Theme";
import { useNavigation, useRoute } from "@react-navigation/native";
import {SafeAreaView} from 'react-native-safe-area-context';

const AddAmount = () => {
  const [amount, setAmount] = useState("");

  const navigation = useNavigation();
  const route = useRoute();

  const { bankName, account, holder, id } = route.params || {};

  const handleProceed = () => {
    if (amount && parseInt(amount, 10) > 0) {
      navigation.navigate("Proceed", { bankName, account, holder, amount, id });
    }
  };

  const handleAmountChange = (text) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmount(numericValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        {/* Title and Description */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Send Money from Wallet to Bank</Text>
          <Text style={styles.subtitle}>
            No direct or hidden charges. Send money from your wallet to bank for
            FREE.
          </Text>
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.rupeeSymbol}>₹</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            placeholderTextColor="#A0A0A0"
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="number-pad"
            maxLength={10}
          />
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            !amount ? styles.proceedButtonDisabled : null,
          ]}
          onPress={handleProceed}
          disabled={!amount}
        >
          <Text style={styles.proceedButtonText}>Proceed</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  titleContainer: {
    marginTop: 24,
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary,
    paddingBottom: 8,
    marginBottom: 32,
  },
  rupeeSymbol: {
    fontSize: 32,
    color: "#A0A0A0",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    color: "#000",
    padding: 0,
  },
  proceedButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  proceedButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  proceedButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default AddAmount;
