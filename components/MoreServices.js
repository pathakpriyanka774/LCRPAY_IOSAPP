import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { useSelector } from "react-redux";
import {SafeAreaView} from 'react-native-safe-area-context';

const IMAGES = [
  require("../assets/10.png"),
  require("../assets/2.png"),
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// 1) Reduced height (was 0.42)
const BANNER_HEIGHT = Math.round(SCREEN_WIDTH * 0.32);

const PRIMARY = Theme?.colors?.primary || "#5F259F";
const COLORS = {
  primary: PRIMARY,
  bg: "#F7F8FC",
  text: "#0F172A",
  subtext: "#6B7280",
  white: "#FFFFFF",
  borderLight: "rgba(15, 23, 42, 0.08)",
};

const withAlpha = (hex, a = 0.6) => {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const CARD_GRADIENT = [withAlpha(PRIMARY, 0.18), withAlpha(PRIMARY, 0.9)];
const MEMBERSHIP_GRADIENT = [withAlpha(PRIMARY, 0.12), withAlpha(PRIMARY, 0.35), withAlpha(PRIMARY, 0.12)];

const MoreServices = () => {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const user = useSelector((state) => state.register.user);

  const startAuto = useCallback(() => {
    stopAuto();
    timerRef.current = setInterval(() => {
      const next = (indexRef.current + 1) % IMAGES.length;
      indexRef.current = next;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    }, 3000);
  }, []);

  const stopAuto = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  const handleNavigation = (screenName) => navigation.navigate(screenName);

  return (
    <SafeAreaView style={styles.root}>
      {/* ====== Banner ====== */}
      <View style={styles.bannerWrap}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onScrollBeginDrag={stopAuto}
          onScrollEndDrag={startAuto}
        >
          {IMAGES.map((img, i) => {
            const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.99, 1, 0.99],
              extrapolate: "clamp",
            });

            return (
              <Animated.View key={i} style={[styles.bannerCard, { transform: [{ scale }] }]}>
                <Image source={img} style={styles.bannerImage} resizeMode="stretch" />
                <LinearGradient
                  colors={[withAlpha("#FFFFFF", 0.0), withAlpha("#FFFFFF", 0.75)]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.bannerShade}
                />
                {/* 2) Chips removed */}
              </Animated.View>
            );
          })}
        </Animated.ScrollView>

        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {IMAGES.map((_, i) => {
            const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
            const width = scrollX.interpolate({
              inputRange,
              outputRange: [6, 18, 6],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.35, 1, 0.35],
              extrapolate: "clamp",
            });
            return <Animated.View key={`dot-${i}`} style={[styles.dot, { width, opacity }]} />;
          })}
        </View>
      </View>

      {/* ====== Body ====== */}
      <View style={styles.body}>
        {/* 3) Membership card navigates to PaymentGatewayScreen */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("Membership")}
          style={{ borderRadius: 18, overflow: "hidden" }}
        >
          <LinearGradient colors={MEMBERSHIP_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.memberCard}>
            <View style={styles.memberContent}>
              <View style={{ flex: 1 }}>
                <View style={styles.badge}>
                  <MaterialIcons name="workspace-premium" size={16} color={COLORS.primary} />
                  <Text style={styles.badgeText}>Prime</Text>
                </View>
                <Text style={styles.memberTitle}>Lifetime Prime Membership</Text>
                <Text style={styles.memberSub}>Get it today for just ₹500</Text>
              </View>
              <Image source={require("../assets/LifeTime.png")} style={styles.memberImage} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Top Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          <Text style={styles.sectionSub}>Quick access to popular categories</Text>
        </View>

        <View style={styles.grid}>
          <ServiceCard title="Loan" image={require("../assets/signing.png")} onPress={() => handleNavigation("LoanSelectionScreen")} />
          <ServiceCard title="Real State Training" image={require("../assets/real-state.png")} onPress={() => handleNavigation("RealStateScreen")} />
          <ServiceCard title="Insurance" image={require("../assets/social-security.png")} onPress={() => handleNavigation("Insurance")} />
          <ServiceCard title="Blud Club" image={require("../assets/Network.png")} onPress={() => handleNavigation("BludClub")} />
          <ServiceCard title="Education" image={require("../assets/training.png")} onPress={() => handleNavigation("Hotel")} />
          <ServiceCard title="Digital Marketing" image={require("../assets/social-media.png")} onPress={() => handleNavigation("DigitalMarketing")} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const ServiceCard = ({ title, image, onPress }) => (
  <TouchableOpacity activeOpacity={0.92} onPress={onPress} style={styles.cardTouch}>
    <LinearGradient colors={CARD_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cardGrad}>
      <LinearGradient colors={[withAlpha("#FFFFFF", 0.28), "transparent"]} style={styles.cardSheen} />
      <View style={styles.cardCenter}>
        <Image source={image} style={styles.cardImage} resizeMode="contain" />
      </View>
      <Text numberOfLines={2} style={styles.cardLabel}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  bannerWrap: { width: SCREEN_WIDTH, height: BANNER_HEIGHT, backgroundColor: COLORS.white },
  bannerCard: { width: SCREEN_WIDTH, height: BANNER_HEIGHT },
  bannerImage: { width: "100%", height: "100%" },
  bannerShade: { position: "absolute", left: 0, right: 0, bottom: 0, height: Math.max(42, Math.round(BANNER_HEIGHT * 0.40)) },
  dotsRow: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { height: 6, borderRadius: 6, backgroundColor: COLORS.primary },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 28 },
  memberCard: {
    borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: COLORS.borderLight, backgroundColor: COLORS.white,
    ...Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }, android: { elevation: 2 } })
  },
  memberContent: { padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  badge: {
    alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
    backgroundColor: withAlpha(COLORS.primary, 0.16), borderWidth: 1, borderColor: withAlpha(COLORS.primary, 0.30), marginBottom: 8
  },
  badgeText: { color: COLORS.primary, fontWeight: "800", fontSize: 12 },
  memberTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  memberSub: { fontSize: 12, color: COLORS.subtext, marginTop: 2 },
  memberImage: { width: 86, height: 86, resizeMode: "contain" },
  sectionHeader: { marginTop: 18, alignItems: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: COLORS.text },
  sectionSub: { marginTop: 4, fontSize: 12, color: COLORS.subtext },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 14, rowGap: 12 },
  cardTouch: {
    width: (SCREEN_WIDTH - 16 * 2 - 12) / 3, borderRadius: 16, overflow: "hidden",
    ...Platform.select({ ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }, android: { elevation: 2 } })
  },
  cardGrad: { height: 120, borderRadius: 16, paddingHorizontal: 10, paddingTop: 10, paddingBottom: 8, alignItems: "center", justifyContent: "space-between" },
  cardSheen: { position: "absolute", top: 0, left: 0, right: 0, height: 34, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardCenter: { flex: 1, width: "100%", alignItems: "center", justifyContent: "center" },
  cardImage: { width: "58%", height: "58%", maxHeight: 70 },
  cardLabel: { textAlign: "center", color: COLORS.white, fontSize: 12, fontWeight: "900", lineHeight: 16, marginTop: 6 },
});

export default MoreServices;
