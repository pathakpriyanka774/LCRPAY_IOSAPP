// MembershipSuccess.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {SafeAreaView} from 'react-native-safe-area-context';
import Theme from "../Theme";

const { width } = Dimensions.get("window");

// THEME (light)
const PRIMARY = Theme?.colors?.primary ?? "#6D28D9";
const ACCENT = Theme?.colors?.accent ?? "#10B981";
const BG = "#FFFFFF";
const TEXT_PRIMARY = "#0F172A";
const TEXT_SECONDARY = "#475569";
const BORDER = "rgba(15, 23, 42, 0.08)";

// Soft tints
const TINT_SOFT = PRIMARY + "12";   // chips
const TINT_SOFTEST = PRIMARY + "0D"; // header wash

// Animation size (responsive, smaller to reduce gaps)
const ANIM_SIZE = Math.min(170, width * 0.38);

const MembershipSuccess = () => {
  const animation = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (animation.current) animation.current.play();
  }, []);

  const onGoHome = () => {
    navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.headerWash, { backgroundColor: TINT_SOFTEST }]} />

      <View style={styles.container}>
        {/* Header / Badge + status */}
        <View style={styles.headerRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: TINT_SOFT, borderColor: PRIMARY + "33" },
            ]}
          >
            <Ionicons name="star" size={14} color={PRIMARY} />
            <Text style={[styles.badgeText, { color: PRIMARY }]}>Prime</Text>
          </View>

          <View style={styles.statusPill}>
            <Ionicons name="checkmark-circle" size={18} color={ACCENT} />
            <Text style={styles.statusText}>Activated</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <LottieView
            ref={animation}
            source={{ uri: "https://assets5.lottiefiles.com/packages/lf20_touohxv0.json" }}
            style={{ width: ANIM_SIZE, height: ANIM_SIZE, marginBottom: 4 }}
            autoPlay
            loop={false}
          />

          <Text style={[styles.title, { marginTop: 0 }]}>
            Membership Activated
          </Text>
          <Text style={[styles.subtitle, { marginTop: 2 }]}>
            Congratulations! You’re now on Prime 🎉
          </Text>

          {/* Auto-sizing card */}
          <View
            style={[
              styles.card,
              { borderColor: PRIMARY + "22", backgroundColor: "#FFFFFF" },
            ]}
          >
            {/* Card header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Prime Benefits</Text>
              <View
                style={[
                  styles.smallChip,
                  { backgroundColor: TINT_SOFT, borderColor: PRIMARY + "2A" },
                ]}
              >
                <Ionicons name="wallet-outline" size={12} color={PRIMARY} />
                <Text style={[styles.smallChipText, { color: PRIMARY }]}>
                  LCR Money
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Benefits list */}
            <View style={styles.rows}>
              <FeatureRow
                icon="pricetag-outline"
                label="Extra bill discounts"
                caption="Auto-applied where eligible"
              />
              <FeatureRow
                icon="cash-outline"
                label="Redeem on each transaction"
                caption="Use LCR on eligible payments"
              />
              <FeatureRow
                icon="people-outline"
                label="Refer & earn"
                caption="Get bonus LCR for referrals"
              />
              <FeatureRow
                icon="shield-checkmark-outline"
                label="All-in-one payments"
                caption="Faster, secure, reliable"
              />
            </View>
          </View>
        </View>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onGoHome}
            activeOpacity={0.9}
            style={[styles.cta, { backgroundColor: PRIMARY }]}
          >
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={styles.ctaText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/** Row component */
const FeatureRow = ({ icon, label, caption }) => {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.iconWrap}>
        <Ionicons name={icon} size={16} color={PRIMARY} />
      </View>
      <View style={rowStyles.texts}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.caption}>{caption}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12 },

  headerWash: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 72,
  },

  headerRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontWeight: "700", fontSize: 12, letterSpacing: 0.2 },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  statusText: { color: "#047857", fontWeight: "700", fontSize: 12 },

  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    color: TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
  },

  card: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginTop: 12,
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === "ios" ? 0.06 : 0.12,
    shadowRadius: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { fontWeight: "700", fontSize: 15, color: TEXT_PRIMARY },

  smallChip: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  smallChipText: { fontSize: 12, fontWeight: "700" },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 10 },

  rows: {
    flexDirection: "column",
    rowGap: 10,
  },

  footer: { paddingTop: 6 },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: Platform.OS === "ios" ? 0.15 : 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
});

/* Row styling */
const rowStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: TINT_SOFT,
    borderWidth: 1,
    borderColor: PRIMARY + "22",
    marginRight: 10,
  },
  texts: { flex: 1 },
  label: { color: TEXT_PRIMARY, fontSize: 13.5, fontWeight: "700" },
  caption: { color: TEXT_SECONDARY, fontSize: 12, marginTop: 1 },
});

export default MembershipSuccess;
