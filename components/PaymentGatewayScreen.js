// File: PaymentGatewayScreen.js — Light theme + Razorpay selected by default

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Theme from "./Theme";
import {SafeAreaView} from 'react-native-safe-area-context';

const PRIMARY = Theme?.colors?.primary || "#5F259F";
const COLORS = {
  bg: "#F7F8FC",
  card: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "#E5E7EB",
  primary: PRIMARY,
};

const GATEWAYS = [
  {
    key: "razorpay",
    title: "Pay with Razorpay",
    subtitle: "UPI, Cards, NetBanking, Wallets",
    iconName: "currency-inr",
  },
  {
    key: "sabpaisa",
    title: "Pay with sabpaisa",
    subtitle: "UPI Intent & Collect, Cards",
    iconName: "bank-transfer",
  },
  // {
  //   key: "payumoney",
  //   title: "Pay with PayuMoney",
  //   subtitle: "Cards, UPI, Wallets",
  //   iconName: "wallet",
  // },
];

const PaymentGatewayScreen = () => {
  // ✅ Default selection set to Razorpay
  const [selected, setSelected] = useState("razorpay");
  const navigation = useNavigation();

  const navigateWithFlag = () => {
    if (selected === "razorpay") {
       navigation.navigate("RazorpayPayScreen", {
        autoStart: false,
        origin: "PaymentGatewayScreen",
        returnTo: "HomeScreen",
        amount: parseFloat(590),
        payload: {
          amount: parseFloat(590),
          service_type: "Prime_Activation",
        },
      });
    } else if (selected === "sabpaisa") {
      navigation.navigate("payWithSabpaise", {
        autoStart: false,
        origin: "PaymentGatewayScreen",
        returnTo: "HomeScreen",
        amount: parseFloat(590),
        payload: {
          amount: parseFloat(590),
          service_type: "Prime_Activation",
        },
      });
    } else if (selected === "payumoney") {
      // navigation.navigate("PayuMoneyScreen");
    }
  };

  const renderItem = ({ item }) => {
    const isActive = selected === item.key;
    const radioColor = isActive ? COLORS.primary : "#9CA3AF";
    const iconColor = isActive ? COLORS.primary : "#6B7280";

    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardActive]}
        onPress={() => setSelected(item.key)}
        activeOpacity={0.9}
      >
        <View style={styles.cardLeft}>
          <MaterialCommunityIcons name={item.iconName} size={24} color={iconColor} />
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <MaterialIcons
          name={isActive ? "radio-button-checked" : "radio-button-unchecked"}
          size={22}
          color={radioColor}
        />
      </TouchableOpacity>
    );
  };

  const proceedText = useMemo(
    () =>
      selected === "razorpay"
        ? "Proceed with Razorpay"
        : selected === "sabpaisa"
          ? "Proceed with sabpaisa"
          : selected === "payumoney"
            ? "Proceed with PayuMoney"
            : "Proceed",
    [selected]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Select Payment Gateway</Text>
        <Text style={styles.subheader}>Choose your preferred provider to continue</Text>

        <FlatList
          data={GATEWAYS}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.proceedBtn} onPress={navigateWithFlag} activeOpacity={0.9}>
            <Text style={styles.proceedText}>{proceedText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentGatewayScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  subheader: { fontSize: 14, color: COLORS.subtext, marginTop: 4, marginBottom: 12 },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardActive: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", columnGap: 12 },
  cardTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  cardSubtitle: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },

  footer: { marginTop: "auto" },
  proceedBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  proceedText: { color: "#fff", fontSize: 16, fontWeight: "800" },
});
