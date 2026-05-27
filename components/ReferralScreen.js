import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Linking,
  Alert,
  Share,
  RefreshControl,
  ActivityIndicator,
  Platform,
  ToastAndroid,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome"; // WhatsApp icon
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Theme from "./Theme";
import { formatDate } from "../utils";
import Clipboard from "@react-native-clipboard/clipboard";
import { BASE_URL } from "../utils/config";

const PRIMARY = Theme?.colors?.primary || "#6A1B9A";
const SECONDARY = Theme?.colors?.secondary || "#FFFFFF";
const CARD_BG = "#FFFFFF";
const BG = "#F7F7FB";
const WHATSAPP = "#128C7E";

const ReferralScreen = () => {
  const [referralCode, setReferralCode] = useState("");
  const [referralData, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const user = useSelector((state) => state.register.user);

  const showToast = (msg) => {
    if (Platform.OS === "android") ToastAndroid.show(msg, ToastAndroid.SHORT);
    else Alert.alert("", msg);
  };

  const copyCode = () => {
    if (!referralCode) return Alert.alert("Error", "No referral code available");
    Clipboard.setString(referralCode);
    setCopied(true);
    showToast("Referral code copied");
    setTimeout(() => setCopied(false), 1800);
  };

  // Share ONLY the referral code (no prefix)
  const shareCodeOnly = async () => {
    if (!referralCode) return Alert.alert("Error", "No referral code to share");
    try {
      await Share.share({ message: referralCode });
    } catch (e) {
      console.log("Share error:", e);
      Alert.alert("Share failed", "Could not open the share sheet.");
    }
  };

  useEffect(() => {
    setReferralCode(user?.user?.member_id || "");
  }, [user]);

  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${BASE_URL}/network/direct_network`,
        {},
        { headers }
      );

      if (response.status === 200 && Array.isArray(response.data?.data)) {
        setResult(response.data.data);
      } else {
        setResult([]);
      }
    } catch (error) {
      console.error("Referral fetch error:", error?.message);
      Alert.alert("Error", "Failed to load referrals. Try again.");
      setResult([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReferrals();
    setRefreshing(false);
  };

  const handleWhatsAppShare = () => {
    const message = `Join LCRPAY and earn rewards! 🚀

Use my referral code: *${referralCode}* to sign up and get started. 🎉

Download now: https://play.google.com/store/apps/details?id=com.LcrPay.LcrPay&hl=en`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) =>
        supported ? Linking.openURL(url) : Alert.alert("Error", "WhatsApp is not installed.")
      )
      .catch(() => Alert.alert("Error", "Could not open WhatsApp."));
  };

  const renderReferralItem = ({ item }) => (
    <View style={styles.referralItem}>
      <Image source={require("../assets/men1.jpg")} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item?.name || "Unknown"}</Text>
        <Text style={styles.phone}>XX-XXXX-{item?.mobile.slice(-4) || "N/A"}</Text>
        <Text style={styles.date}>
          Registered: {item?.joiningDate ? formatDate(item.joiningDate) : "N/A"}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
        {/* Header card */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Refer & Earn</Text>
          <Text style={styles.subtitle}>Get 100 LCR MONEY per referral</Text>

          {/* Code pill */}
          <View style={styles.codePill}>
            <View style={styles.codeLeft}>
              <Text style={styles.codeLabel}>Your code</Text>
              <Text selectable style={styles.codeValue}>
                {referralCode || "Not available"}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={copyCode} activeOpacity={0.85}>
                <MaterialIcons
                  name={copied ? "check-circle" : "content-copy"}
                  size={20}
                  color={copied ? "#22C55E" : PRIMARY}
                />
                <Text style={[styles.actionText, copied && { color: "#22C55E" }]}>
                  {copied ? "Copied" : "Copy"}
                </Text>
              </TouchableOpacity>

              <View style={styles.vertDivider} />

              {/* use a Material icon that exists on Android/iOS bundles */}
              <TouchableOpacity style={styles.actionBtn} onPress={shareCodeOnly} activeOpacity={0.85}>
                <MaterialIcons name="share" size={20} color={PRIMARY} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroWrap}>
          <Image source={require("../assets/ReferAndEarn.png")} style={styles.heroImage} />
        </View>

        {/* WhatsApp CTA */}
        <TouchableOpacity style={styles.cta} onPress={handleWhatsAppShare} activeOpacity={0.9}>
          <FontAwesome name="whatsapp" size={22} color="#fff" />
          <Text style={styles.ctaText}>Refer via WhatsApp</Text>
        </TouchableOpacity>

        {/* List card */}
        <View style={styles.listCard}>
          <View style={styles.listHeaderRow}>
            <Text style={styles.listTitle}>Your Referrals</Text>
            {!loading && referralData?.length > 0 && (
              <Text style={styles.countBadge}>{referralData.length}</Text>
            )}
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={PRIMARY} />
              <Text style={styles.muted}>Loading referrals…</Text>
            </View>
          ) : referralData.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialIcons name="group-off" size={26} color="#C7B7E6" />
              <Text style={styles.emptyTitle}>No referrals yet</Text>
              <Text style={styles.muted}>Share your code to start earning.</Text>
            </View>
          ) : (
            <FlatList
              data={referralData}
              renderItem={renderReferralItem}
              keyExtractor={(item, idx) => item?.mobile?.toString() || `ref_${idx}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 24, backgroundColor: BG },
  container: { flex: 1 },

  headerCard: {
    backgroundColor: CARD_BG,
    margin: 16,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEAF7",
    shadowColor: PRIMARY,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  // Professionalize heading
  title: { fontSize: 24, fontWeight: "bold", color: PRIMARY, letterSpacing: 0.5 },
  subtitle: { marginTop: 4, fontSize: 13, color: PRIMARY, opacity: 0.75 },

  codePill: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E8DDFB",
    backgroundColor: "#FBF9FF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  codeLeft: { flex: 1 },
  codeLabel: { fontSize: 11, color: PRIMARY, opacity: 0.7, fontWeight: "700" },
  codeValue: {
    fontSize: 20,
    fontWeight: "900",
    color: PRIMARY,
    marginTop: 2,
    letterSpacing: 0.6,
  },

  actions: { flexDirection: "row", alignItems: "center" },
  actionBtn: { alignItems: "center", justifyContent: "center", paddingHorizontal: 6 },
  actionText: { fontSize: 10, color: PRIMARY, marginTop: 2, fontWeight: "800" },
  vertDivider: { width: 1, height: 24, backgroundColor: "#EAE2FD", marginHorizontal: 8 },

  heroWrap: { alignItems: "center", marginTop: 4, marginBottom: 8 },
  heroImage: { width: "92%", height: 220, resizeMode: "contain" },

  // WhatsApp CTA with official green and icon
  cta: {
  backgroundColor: WHATSAPP,
  paddingHorizontal: 18,
  paddingVertical: 12,
  borderRadius: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginHorizontal: 16,
  shadowColor: WHATSAPP,
  shadowOpacity: 0.2,
  shadowRadius: 6,
  elevation: 3,
},

  ctaText: { color: "#fff", marginLeft: 8, fontWeight: "bold", letterSpacing: 0.3, fontSize: 15 },

  listCard: {
    backgroundColor: CARD_BG,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEEAF7",
    shadowColor: PRIMARY,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  listHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  listTitle: { fontSize: 16, fontWeight: "900", color: PRIMARY, flex: 1 },
  countBadge: {
    fontSize: 12,
    fontWeight: "900",
    color: PRIMARY,
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  referralItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: "#EFE7FF" },
  name: { fontSize: 14, fontWeight: "800", color: PRIMARY },
  phone: { color: PRIMARY, opacity: 0.7, fontSize: 12, marginTop: 2, fontWeight: "600" },
  date: { color: PRIMARY, opacity: 0.55, fontSize: 11, marginTop: 2 },

  separator: { height: 1, backgroundColor: "#F3F0FF" },

  loadingWrap: { alignItems: "center", paddingVertical: 16 },
  emptyWrap: { alignItems: "center", paddingVertical: 24 },
  emptyTitle: { marginTop: 8, color: PRIMARY, fontWeight: "900" },
  muted: { color: PRIMARY, opacity: 0.65, fontSize: 12, marginTop: 6 },
});

export default ReferralScreen;
