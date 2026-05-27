// File: PanDetailsWb.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Animated, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "../components/Theme";
import { getPanData } from "../src/features/aadharKyc/AadharSlice";
import ViewShot from "react-native-view-shot";
import RNShare from "react-native-share";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';

// Optional gradient (fallback to View)
let LinearGradient;
try {
  LinearGradient = require("react-native-linear-gradient").default;
} catch {
  LinearGradient = ({ style, children }) => <View style={style}>{children}</View>;
}

const PRIMARY = Theme?.colors?.primary || "#ff8a00";
const CARD_RADIUS = 16;

// Responsive measurements
const SCREEN_W = Dimensions.get("window").width;
const H_PAD = 32; // total horizontal padding used by the screen container
const CARD_MAX_WIDTH = Math.min(Math.max(SCREEN_W - H_PAD, 300), 900); // clamp between 300 and 900
const PHOTO_SIZE = Math.max(80, Math.round(CARD_MAX_WIDTH * 0.18));
const LEFT_COL_WIDTH = PHOTO_SIZE + 24;

const PATTERN_WAVE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAVElEQVQ4T2NkoBAwUqifYbCxYf9HMBgYGMQwYGB4xJwMZkK4Zy9c+ePfsWjUQ2g0Qkhi2bNn4yqVKo6QxYwzMTA8g0E0CkQzQyB8k2k2gqQ6kQwD4qDMBpQFQkVgqg0wGkFqEAALrIh0QbK3mQAAAAASUVORK5CYII=";
const PATTERN_DOTS =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAKUlEQVQoU2NkIBIwEqmOgYGBwSCGQBdIMcJxgpgMxAqhYGBgQBGCBwAAM6QGCunZfIMAAAAASUVORK5CYII=";

const PanDetailsWb = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { PanDetail, loading } = useSelector((state) => state.aadhar);




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


  console.log("PanDetail====", PanDetail)
  const [errorText, setErrorText] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    setErrorText("");
    dispatch(getPanData());
  }, [dispatch]);

  const pan = PanDetail?.data || {};

  // Safe DOB → dd-mm-yyyy
  const formattedDob = useMemo(() => {
    const raw = pan?.dateOfBirth;
    if (!raw) return "N/A";
    const cleaned = String(raw).trim();
    const datePart = cleaned.includes("T") ? cleaned.split("T")[0] : cleaned.split(" ")[0];
    const sep = datePart.includes("-") ? "-" : datePart.includes("/") ? "/" : null;
    if (!sep) return cleaned;
    const p = datePart.split(sep);
    if (p.length !== 3) return cleaned;
    if (p[0].length === 4) {
      const [yyyy, mm, dd] = p;
      return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
    }
    const [dd, mm, yyyy] = p;
    return `${dd.padStart(2, "0")}-${mm.padStart(2, "0")}-${yyyy}`;
  }, [pan?.dateOfBirth]);

  const handleRefresh = () => {
    setErrorText("");
    dispatch(getPanData());
  };

  const handleShare = async () => {
    try {
      if (!cardRef.current) return;
      const uri = await cardRef.current.capture?.({
        format: "png",
        quality: 0.95,
        result: "tmpfile",
      });
      await RNShare.open({
        url: uri,
        type: "image/png",
        failOnCancel: false,
      });
    } catch (e) {
      console.log("Share error:", e);
      Alert.alert("Share failed", "Couldn't share the PAN card image.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={PRIMARY} />
            <Text style={styles.loadingText}>Fetching PAN…</Text>
          </View>
        )}

        {!loading && errorText ? (
          <View style={styles.errorWrap}>
            <Text style={styles.warningText}>⚠ {errorText}</Text>
            <TouchableOpacity
              style={[styles.btn, styles.primaryBtn, styles.btnFull]}
              onPress={handleRefresh}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color="#fff" style={styles.btnIcon} />
              <Text style={styles.btnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}



        {!loading && !errorText && PanDetail?.["success"] == false ? (
          <View style={styles.container}>

            {/* Content Section */}
            <Animated.View
              style={[
                styles.contentContainer,
                {
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
                onPress={() => navigation.replace('Profile3')}
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







        {!loading && !errorText && PanDetail?.["success"] == true && (
          <View style={styles.cardOuter}>
            {/* Capture-ready PAN card */}
            <ViewShot ref={cardRef} options={{ format: "png", quality: 0.95, result: "tmpfile" }}>
              <View style={styles.cardBorder}>
                {/* PAN-style gradient background */}
                <LinearGradient
                  colors={["#d9ecff", "#e4e6ff", "#f2e6ff"]} // soft Indian PAN vibe
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  {/* Security overlays (tiled) */}
                  <View pointerEvents="none" style={styles.securityLayers}>
                    <Image
                      source={{ uri: PATTERN_WAVE }}
                      style={styles.patternWave}
                      resizeMode="repeat"
                    />
                    <Image
                      source={{ uri: PATTERN_DOTS }}
                      style={styles.patternDots}
                      resizeMode="repeat"
                    />
                  </View>

                  {/* Header with emblems */}
                  <View style={styles.header}>
                    <Image source={require("../assets/gov.png")} style={styles.govLogo} />
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <Text style={styles.headerHi}>भारत सरकार</Text>
                      <Text style={styles.headerEn}>GOVERNMENT OF INDIA</Text>
                    </View>
                    <Image source={require("../assets/IncomeTax.png")} style={styles.itdLogo} />
                  </View>

                  {/* Decorative strip */}
                  <View style={styles.holo} />

                  {/* Body */}
                  <View style={styles.bodyRow}>
                    {/* Photo */}
                    <View style={styles.leftCol}>
                      <View style={styles.photoWrap}>
                        <Image
                          source={
                            pan?.photo
                              ? { uri: `data:image/jpeg;base64,${pan.photo}` }
                              : require("../assets/profile.png")
                          }
                          style={styles.photo}
                        />
                      </View>
                    </View>

                    {/* Details */}
                    <View style={styles.rightCol}>
                      <View style={styles.kv}>
                        <Text style={styles.k}>Name</Text>
                        <Text
                          style={styles.v}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.85}
                        >
                          {pan?.pan_holder_name || "N/A"}
                        </Text>
                      </View>

                      <View style={styles.kv}>
                        <Text style={styles.k}>DOB</Text>
                        <Text style={styles.v}>{formattedDob}</Text>
                      </View>

                      <View style={styles.kv}>
                        <Text style={styles.k}>PAN</Text>
                        <Text
                          style={[styles.v, styles.panValue]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          minimumFontScale={0.85}
                        >
                          {pan?.pan_number || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Footer */}
                  <View style={styles.footerBand}>
                    <Text style={styles.footerText}>आयकर विभाग - भारत</Text>
                  </View>
                </LinearGradient>
              </View>
            </ViewShot>

            {/* Actions: Refresh • Share • Back */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.btn, styles.primaryBtn]}
                onPress={handleRefresh}
                activeOpacity={0.85}
              >
                <Ionicons name="refresh" size={18} color="#fff" style={styles.btnIcon} />
                <Text style={styles.btnText}>Refresh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.primaryBtn]}
                onPress={handleShare}
                activeOpacity={0.85}
              >
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
  // Light screen
  safe: { flex: 1, backgroundColor: Theme.colors.secondary, },
  scroll: {
    flexGrow: 1,              // 👈 makes scroll content expand
    justifyContent: "center", // center when content small
    padding: 16,
    paddingBottom: 24,
  },

  // States
  loadingWrap: { alignItems: "center", marginTop: 48 },
  loadingText: { color: "#6b7280", marginTop: 8 },
  errorWrap: { alignItems: "center", marginTop: 40, paddingHorizontal: 16 },
  warningText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
  },

  // Card wrapper
  cardOuter: {
    flex: 1, // ensures it expands full height
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    width: '100%',
    paddingHorizontal: 8,
  },
  cardBorder: {
    borderRadius: CARD_RADIUS + 3,
    padding: 2,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: Platform.OS === 'android' ? 6 : 3,
    width: CARD_MAX_WIDTH,
    alignSelf: 'center',
  },

  // PAN-style gradient card
  card: {
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#dae4f2",
  },

  // Security layers
  securityLayers: {
    ...StyleSheet.absoluteFillObject,
  },
  patternWave: {
    ...StyleSheet.absoluteFillObject,
  },
  patternDots: {
    ...StyleSheet.absoluteFillObject,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  govLogo: { width: 42, height: 36, resizeMode: "contain" },
  itdLogo: { width: 50, height: 38, resizeMode: "contain" },
  headerHi: { color: "#0f172a", fontSize: 13, fontWeight: "800" },
  headerEn: { color: "#475569", fontSize: 11, fontWeight: "700" },

  // Decorative strip
  holo: {
    marginHorizontal: 14,
    height: 6,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.55)",
    marginBottom: 12,
  },

  // Body
  bodyRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 14,
    paddingBottom: 14,
    alignItems: 'flex-start',
    flexWrap: 'wrap', // allow stacking on narrow screens
  },
  leftCol: { width: LEFT_COL_WIDTH, alignItems: "center", paddingRight: 6 },
  rightCol: { flex: 1, minWidth: 160 },

  photoWrap: {
    width: PHOTO_SIZE,
    height: Math.round(PHOTO_SIZE * 1.2),
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
  },
  photo: { width: "100%", height: "100%", resizeMode: "cover" },

  kv: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  k: { color: "#334155", fontSize: 13, fontWeight: "800" },
  v: { color: "#0f172a", fontSize: 15, fontWeight: "900", flexShrink: 1 },

  panValue: {
    letterSpacing: 1,
  },

  // Footer
  footerBand: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.65)",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  footerText: { fontSize: 12, fontWeight: "900", color: "#0f172a" },

  // Buttons
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "stretch",
    alignSelf: "stretch",
    marginTop: 14,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnIcon: { marginRight: 6 },
  primaryBtn: { backgroundColor: PRIMARY },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Retry full-width helper
  btnFull: { alignSelf: "stretch", marginTop: 8, paddingHorizontal: 16 },






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

export default PanDetailsWb;
