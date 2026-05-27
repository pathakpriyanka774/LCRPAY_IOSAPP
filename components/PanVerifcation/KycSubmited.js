// KycSubmited.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Theme from "../Theme";
import {SafeAreaView} from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
const PRIMARY = Theme?.colors?.primary ?? "#6D28D9";
const BORDER = "rgba(0,0,0,0.08)";

const KycSubmited = () => {
  const navigation = useNavigation();

  const checks = useMemo(
    () => [
      { icon: "card-outline", label: "Aadhaar Card" },            // safer Ionicons name
      { icon: "document-text-outline", label: "PAN Card" },
      { icon: "mail-outline", label: "Email Verification" },
    ],
    []
  );

  const onGoHome = () => navigation.navigate("HomeScreen");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={[styles.hero, { backgroundColor: PRIMARY }]}>
          <View style={styles.heroIconWrap}>
            <View style={[styles.heroIconBg, { borderColor: "rgba(255,255,255,0.65)" }]}>
              {/* Main KYC-related icon */}
              <Ionicons name="document-lock-outline" size={44} color="#FFFFFF" />
            </View>

            {/* Floating mini icons for flair */}
            <View style={[styles.floatIcon, { top: -8, left: -8 }]}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#FFFFFF" />
            </View>
            <View style={[styles.floatIcon, { bottom: -8, right: -10 }]}>
              <Ionicons name="key-outline" size={16} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.heroTitle}>KYC Submitted Successfully</Text>
          <Text style={styles.heroSubtitle}>
            Your verification documents are now on record.
          </Text>
        </View>

        {/* CHECKLIST */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: PRIMARY }]}>Verification Summary</Text>

          {checks.map((row, idx) => (
            <View
              key={row.label}
              style={[
                styles.row,
                idx !== checks.length - 1 && styles.rowDivider,
              ]}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.rowIconBg, { borderColor: `${PRIMARY}33` }]}>
                  <Ionicons name={row.icon} size={18} color={PRIMARY} />
                </View>
                <Text style={styles.rowText}>{row.label}</Text>
              </View>

              <View style={styles.statusPill}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.statusText}>Verified</Text>
              </View>
            </View>
          ))}
        </View>

        {/* INFO TIP */}
        <View style={[styles.tipBox, { borderColor: `${PRIMARY}33`, backgroundColor: "#F7F7FF" }]}>
          <Ionicons name="information-circle-outline" size={18} color={PRIMARY} />
          <Text style={styles.tipText}>
            We’ll notify you if any additional information is required.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onGoHome}
          style={styles.ctaWrap}
        >
          <View style={[styles.button, { backgroundColor: PRIMARY }]}>
            <Ionicons name="home" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Home</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  /* HERO */
  hero: {
    width: "100%",
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.2,
    shadowRadius: 12,
    elevation: 6,
    alignItems: "center",
  },
  heroIconWrap: {
    width: Math.min(width * 0.28, 120),
    height: Math.min(width * 0.28, 120),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 14,
  },
  heroIconBg: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  floatIcon: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    padding: 6,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 0.2,
    marginTop: 2,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "space-between",
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "70%",
  },
  rowIconBg: {
    backgroundColor: "#F3F0FF",
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
  },
  rowText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  statusText: {
    color: "#065F46",
    fontSize: 13,
    fontWeight: "700",
  },

  /* INFO TIP */
  tipBox: {
    marginTop: 14,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tipText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 13.5,
  },

  /* CTA */
  ctaWrap: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === "ios" ? 0.12 : 0.3,
    shadowRadius: 12,
    elevation: 7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});

export default KycSubmited;
