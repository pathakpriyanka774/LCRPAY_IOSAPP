// File: AadhaarDetailsWb.js  (Light theme • keep card design • buttons fit + icons • share image)
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, ScrollView, Alert, Animated, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getAadharDetail } from "../src/features/aadharKyc/AadharSlice";
import Theme from "../components/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import { BASE_URL } from "../utils/config";

// NEW: for screenshot + image share
import ViewShot from "react-native-view-shot";
import RNShare from "react-native-share";
import Ionicons from "react-native-vector-icons/Ionicons";

// Optional gradient (safe fallback)
let LinearGradient;
try {
  LinearGradient = require("react-native-linear-gradient").default;
} catch {
  LinearGradient = ({ style, children }) => <View style={style}>{children}</View>;
}

const PRIMARY = Theme?.colors?.primary || "#ff8a00";
const CARD_RADIUS = 18;

const AadhaarDetailsWb = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(iconAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  const iconScale = iconAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const dispatch = useDispatch();
  const { AadharDetail, loading } = useSelector((state) => state.aadhar);

  const [circularloading, setCircularLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState("");

  // NEW: ref for card screenshot
  const cardRef = useRef(null);

  const handleAddharData = async () => {
    try {
      setErrorText("");
      setCircularLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${BASE_URL}/userAadharDetail/`, { headers });
      if (response.status === 200) setResult(response.data);
      else setErrorText("Unable to fetch Aadhaar details. Please try again.");
    } catch (error) {
      setErrorText("Error fetching Aadhaar details. Please try again.");
      console.log("Error fetching data:", error?.response?.data || error?.message);
    } finally {
      setCircularLoading(false);
    }
  };

  useEffect(() => {
    handleAddharData();
  }, []);

  useEffect(() => {
    dispatch(getAadharDetail());
  }, [dispatch]);

  const aadharDetails = AadharDetail?.aadhar_details || {};
  const address = aadharDetails?.address || {};

  const fullAddress = useMemo(() => {
    if (result?.address) return result.address;
    const parts = [
      address.careOf,
      address.house,
      address.street,
      address.landmark,
      address.locality,
      address.vtc || address.city,
      address.district,
      address.state,
      address.country,
      address.pin,
    ]
      .filter(Boolean)
      .join(", ");
    return parts || "N/A";
  }, [result, address]);

  const maskedNumber = useMemo(() => {
    const num = aadharDetails?.maskedNumber || "";
    const digits = num.replace(/\D/g, "");
    if (!digits) return "N/A";
    const last4 = digits.slice(-4);
    return `xxxx xxxx xxxx ${last4}`;
  }, [aadharDetails?.maskedNumber]);

  const genderLabel = useMemo(() => {
    const g = (aadharDetails?.gender || "").toUpperCase();
    if (g === "M") return "Male";
    if (g === "F") return "Female";
    if (g === "T") return "Transgender";
    return "N/A";
  }, [aadharDetails?.gender]);

  // ✅ ONLY CHANGE: format DOB as dd-mm-yyyy (zero-padded), handling common inputs
  const dobFormatted = useMemo(() => {
    const raw = aadharDetails?.dateOfBirth;
    if (!raw) return "N/A";
    const cleaned = String(raw).trim();

    // handle ISO with time e.g. 1990-07-05T00:00:00Z
    const datePart = cleaned.includes("T")
      ? cleaned.split("T")[0]
      : cleaned.split(" ")[0];

    const sep = datePart.includes("-") ? "-" : (datePart.includes("/") ? "/" : null);
    if (!sep) return cleaned;

    const p = datePart.split(sep);
    if (p.length !== 3) return cleaned;

    // yyyy-mm-dd → dd-mm-yyyy
    if (p[0].length === 4) {
      const [yyyy, mm, dd] = p;
      return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
    }

    // assume dd-mm-yyyy or dd/mm/yyyy → dd-mm-yyyy
    const [dd, mm, yyyy] = p;
    return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
  }, [aadharDetails?.dateOfBirth]);

  const isBusy = loading || circularloading;

  // NEW: Share image (not text)
  const handleShare = async () => {
    try {
      if (!cardRef.current) return;
      const uri = await cardRef.current.capture?.({
        format: "png",
        quality: 0.95,
        result: "tmpfile", // returns file:// URI (best for sharing)
      });
      await RNShare.open({
        url: uri,
        type: "image/png",
        failOnCancel: false,
      });
    } catch (e) {
      console.log("Share error:", e);
      Alert.alert("Share failed", "Couldn't share the Aadhaar card image.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {isBusy && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>Fetching Aadhaar…</Text>
          </View>
        )}

        {!isBusy && errorText ? (
          <View style={styles.errorWrap}>
            <Text style={styles.warningText}>⚠ {errorText}</Text>
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn, styles.btnFull]}
              onPress={handleAddharData}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}


        {/* Kyc Required */}
        {!isBusy && !errorText && result?.status == "error" ? (
          <View style={styles.container}>

            {/* Content Section */}
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              {/* Icon Container with Animation */}
              <Animated.View
                pointerEvents="box-none"
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: iconScale }],
                  },
                ]}
              >
                <MaterialIcons name="description" size={80} color={Theme.colors.primary} />
              </Animated.View>

              {/* Title */}
              <Text style={styles.title}>KYC Required</Text>

              {/* Description */}
              <Text style={styles.description}>
                Your KYC is required to continue. Please complete your verification.
              </Text>

              {/* Complete KYC Button */}
              <TouchableOpacity
                style={styles.kycButton}
                onPress={() => navigation.replace('Profile')}
                activeOpacity={0.8}
              >
                <MaterialIcons name="description" size={24} color={Theme.colors.secondary} />
                <Text style={styles.kycButtonText}>Complete Your KYC</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Bottom Decorative Element */}
            <View style={styles.bottomDecor} pointerEvents="none">
              <View style={styles.decorCircle1} />
              <View style={styles.decorCircle2} />
            </View>
          </View>
        ) : null}

        {!isBusy && result?.status !== "error" && (
          <View style={styles.cardOuter}>
            {/* DO NOT change card design: wrapped in ViewShot only */}
            <ViewShot ref={cardRef} options={{ format: "png", quality: 0.95, result: "tmpfile" }}>
              <LinearGradient
                pointerEvents="none"
                colors={["#FF9933", "#FFFFFF", "#138808"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.borderGlow}
              >
                <View style={styles.cardInner}>
                  {/* Header */}
                  <View style={styles.header}>
                    <Image source={require("../assets/gov.png")} style={styles.logo} />
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text style={styles.headerLineHindi}>भारत सरकार</Text>
                      <Text style={styles.headerLineEn}>GOVERNMENT OF INDIA</Text>
                    </View>
                    <Image source={require("../assets/aadhar.png")} style={styles.logo} />
                  </View>

                  {/* Thin hologram strip */}
                  <LinearGradient
                    colors={["#f6f6f6", "#ededed", "#f6f6f6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.holo}
                  />

                  {/* Body */}
                  <View style={styles.bodyRow}>
                    {/* Left - Photo */}
                    <View style={styles.leftCol}>
                      <View style={styles.photoWrap}>
                        <Image
                          source={
                            aadharDetails.photo
                              ? { uri: `data:image/jpeg;base64,${aadharDetails.photo}` }
                              : require("../assets/profile.png")
                          }
                          style={styles.photo}
                        />
                      </View>

                      {/* QR (black/white, no tint) */}
                      <View style={styles.qrWrap}>
                        {aadharDetails.qrCode ? (
                          <Image
                            source={{ uri: `data:image/png;base64,${aadharDetails.qrCode}` }}
                            style={styles.qr}
                          />
                        ) : (
                          <Image source={require("../assets/Qr_Code.png")} style={styles.qr} />
                        )}
                        <Text style={styles.qrHint}>Scan to verify</Text>
                      </View>
                    </View>

                    {/* Right - Details */}
                    <View style={styles.rightCol}>
                      <Text
                        style={styles.nameText}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                      >
                        {aadharDetails?.name || "N/A"}
                      </Text>

                      <View style={styles.kv}>
                        <Text style={styles.k}>DOB</Text>
                        {/* ✅ Using formatted DOB */}
                        <Text style={styles.v}>{dobFormatted}</Text>
                      </View>

                      <View style={styles.kv}>
                        <Text style={styles.k}>Gender</Text>
                        <Text style={styles.v}>{genderLabel}</Text>
                      </View>

                      {/* Aadhaar number: heading line + value line */}
                      <View style={styles.kvBlock}>
                        <Text style={styles.k}>Aadhaar No.</Text>
                        <Text
                          style={[styles.v, styles.aadhaarNumber]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.8}
                        >
                          {maskedNumber}
                        </Text>
                      </View>

                      <View style={styles.addrBox}>
                        <Text style={styles.addrTitle}>Address</Text>
                        <Text style={styles.addrText}>{fullAddress}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.footerBand}>
                    <LinearGradient
                      colors={["#FF9933", "#FFFFFF", "#138808"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={StyleSheet.absoluteFill}
                    />
                    <Text style={styles.footerText}>आधार — आम आदमी का अधिकार</Text>
                  </View>
                </View>
              </LinearGradient>
            </ViewShot>

            {/* ACTIONS — SAME COLOR + ICONS + FIT IN ONE ROW */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={handleAddharData} activeOpacity={0.85}>
                <Ionicons name="refresh" size={18} color="#fff" style={styles.btnIcon} />
                <Text style={styles.btnText}>Refresh</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.primaryBtn]} onPress={handleShare} activeOpacity={0.85}>
                <Ionicons name="share-social" size={18} color="#fff" style={styles.btnIcon} />
                <Text style={styles.btnText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.secondary, },
  scroll: { padding: 16, paddingBottom: 32 },

  // States
  loadingWrap: { alignItems: "center", marginTop: 320 },
  loadingText: { color: "#6b7280", marginTop: 8 },
  errorWrap: { alignItems: "center", marginTop: 40, paddingHorizontal: 16 },
  kycWrap: { alignItems: "center", marginTop: 40, paddingHorizontal: 16 },
  bigTitle: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subText: { fontSize: 15, color: "#4b5563", textAlign: "center", marginBottom: 16 },

  // Buttons
  btn: {
    flex: 1,                // equal widths so 3 fit in one row
    minWidth: 0,            // allow shrink to avoid overflow
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnIcon: { marginRight: 6 },
  primaryBtn: { backgroundColor: PRIMARY },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Action row fits all 3 buttons on-screen
  actionsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    alignSelf: "stretch",
    gap: 10,
    marginTop: 14,
  },

  // Card (unchanged design)
  cardOuter: { marginTop: 12 },
  borderGlow: { borderRadius: CARD_RADIUS + 4, padding: 2, backgroundColor: "#fff" },
  cardInner: {
    backgroundColor: "#ffffff",
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eef0f4",
  },

  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 14, paddingBottom: 10 },
  logo: { width: 42, height: 36, resizeMode: "contain" },
  headerLineHindi: { color: "#111827", fontSize: 13, fontWeight: "800" },
  headerLineEn: { color: "#4b5563", fontSize: 11, fontWeight: "700" },

  holo: { marginHorizontal: 14, height: 6, borderRadius: 4, opacity: 1, marginBottom: 10 },

  bodyRow: { flexDirection: "row", gap: 12, paddingHorizontal: 14, paddingBottom: 14 },
  leftCol: { width: 120, alignItems: "center" },
  rightCol: { flex: 1 },

  photoWrap: {
    width: 110,
    height: 132,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },

  qrWrap: { alignItems: "center", marginTop: 18 },
  qr: {
    width: 92,
    height: 92,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    tintColor: undefined, // keep QR black/white
  },
  qrHint: { marginTop: 6, color: "#6b7280", fontSize: 11 },

  nameText: { color: "#111827", fontSize: 20, fontWeight: "900", marginTop: 2, marginBottom: 8 },
  kv: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  kvBlock: { marginBottom: 10 },
  k: { color: "#6b7280", fontSize: 13, fontWeight: "700" },
  v: { color: "#111827", fontSize: 14, fontWeight: "800" },
  aadhaarNumber: { marginTop: 4, letterSpacing: 1, fontSize: 16, fontWeight: "800", flexShrink: 1 },

  addrBox: {
    marginTop: 10,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  addrTitle: { color: "#6b7280", fontSize: 12, fontWeight: "800", marginBottom: 4 },
  addrText: { color: "#111827", fontSize: 13, lineHeight: 18 },

  footerBand: { height: 40, justifyContent: "center", alignItems: "center", marginTop: 8 },
  footerText: { fontSize: 12, fontWeight: "900", color: "#0f172a", backgroundColor: "transparent" },

  // Error styles
  errorWrap: { alignItems: "center", marginTop: 40, paddingHorizontal: 16 },
  warningText: { fontSize: 18, fontWeight: "700", color: "#dc2626", textAlign: "center", marginBottom: 12 },
  btnFull: { alignSelf: "stretch", marginTop: 10 },









  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: Theme.colors.secondary,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.secondary,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 100,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(95, 37, 159, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 3,
    borderColor: 'rgba(95, 37, 159, 0.2)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  kycButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    maxWidth: 350,
    elevation: 5,
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  kycButtonText: {
    color: Theme.colors.secondary,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(95, 37, 159, 0.05)',
    bottom: -100,
    left: -50,
  },
  decorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(95, 37, 159, 0.08)',
    bottom: -50,
    right: -30,
  },
});

export default AadhaarDetailsWb;
