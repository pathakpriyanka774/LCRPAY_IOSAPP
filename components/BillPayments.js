// components/BillPayments.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Theme from "../components/Theme"; // adjust path if needed

/* ---------- Brand ---------- */
const PRIMARY = Theme?.colors?.primary || "#5F259F";

/* ---------- Data ---------- */
const SERVICES = [
  { key: "moneyTransfer", title: "Money Transfer", icon: "bank-transfer" },
  { key: "recharge", title: "Recharge", icon: "cellphone-charging" },
  { key: "billsPay", title: "Bills Pay", icon: "file-document-edit" },
  { key: "booking", title: "Booking", icon: "calendar-check" },
  { key: "loan", title: "Loan", icon: "bank" },
  { key: "insurance", title: "Insurance", icon: "shield-check" },
  { key: "ecommerce", title: "E-Commerce", icon: "cart" },
  { key: "bloodClub", title: "Blood Club", icon: "account-group" },
  { key: "placement", title: "Placement", icon: "account-tie" },
  { key: "prime", title: "Prime Membership", icon: "diamond-stone" },
  { key: "investment", title: "Investment", icon: "chart-line" },
];

/* ---------- Card ---------- */
const ServiceCard = ({ title, icon, onPress }) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
    <View style={styles.iconCircle}>
      <MaterialCommunityIcons name={icon} size={22} color="#FFFFFF" />
    </View>

    <View style={styles.labelWrap}>
      <Text numberOfLines={1} style={styles.cardLabel}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

/* ---------- Screen ---------- */
const BillPayments = ({ handleNavigation = () => {} }) => {
  const items = useMemo(() => SERVICES, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gridWrap}>
        {items.map((s) => (
          <ServiceCard
            key={s.key}
            title={s.title}
            icon={s.icon}
            onPress={() => handleNavigation(s.key)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default BillPayments;

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
  },
  gridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // Card: white, shadow, horizontal layout
  card: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(95,37,159,0.10)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
    }),
  },

  // Circular purple icon
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  // Text on the right
  labelWrap: {
    flex: 1,
    minWidth: 0, // enable ellipsis
  },
  cardLabel: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
