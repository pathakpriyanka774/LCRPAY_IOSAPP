// File: RechargeSuccess1.js
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Animated,
  Easing,
  Platform,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { Audio } from 'expo-av';
import moment from "moment";
import {SafeAreaView} from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- configurable amounts (replace with your dynamic values) ---
const PLATFORM_FEE = 3;     // ₹
const LCR_MONEY = 5;        // ₹
const AMOUNT = 10;          // ₹ main recharge amount
const EXTRA_MS = 2000;      // extra celebration time

export default function RechargeSuccess1() {
  const navigation = useNavigation();

  // Keep counts stable across hot reloads (prevents undefined entries)
  const CONFETTI_COUNT = useRef(18).current;
  const FIRE_COUNT = useRef(20).current;

  // Celebration overlay hidden after complete
  const [showFx, setShowFx] = useState(true);

  // Center check + pulse rings
  const scale = useRef(new Animated.Value(0)).current;
  const ringScale1 = useRef(new Animated.Value(0.8)).current;
  const ringOpacity1 = useRef(new Animated.Value(0)).current;
  const ringScale2 = useRef(new Animated.Value(0.8)).current;
  const ringOpacity2 = useRef(new Animated.Value(0)).current;

  // Screen flash
  const flashOpacity = useRef(new Animated.Value(0)).current;

  // Confetti (falling)
  const confettiY = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => new Animated.Value(-40))
  ).current;
  const confettiRotate = useRef(
    Array.from({ length: CONFETTI_COUNT }, () => new Animated.Value(0))
  ).current;

  // Firework burst
  const fireProgress = useRef(new Animated.Value(0)).current;
  const CONFETTI_COLORS = useMemo(
    () => ['#F59E0B','#10B981','#3B82F6','#EC4899','#6366F1','#EF4444','#14B8A6','#F97316','#22C55E','#A855F7','#0EA5E9','#D946EF'],
    []
  );

const user = useSelector((state) => state.register.user);
  const route = useRoute();

  const {
    amount = 0,
    mobile_number = "",
    debitedAmount = 0, 
    recipient_name = "",
    responseData = {},
    RechargeStatus = "",
    discountDetails = {},
  } = route.params || {};


  useEffect(() => {
    console.log('RechargeSuccess1 params:', route.params);
  });



  const transactionDetails = {
    status:
      RechargeStatus.toLowerCase() === "success"
        ? "Recharge successful"
        : "Recharge Failed",
    timestamp: moment(responseData.transaction_date).format(
      "hh:mm a on DD MMM YYYY"
    ),
    provider: recipient_name,
    number: mobile_number,
    amount: amount,
    debit_Amt : debitedAmount,
    discountDetail: discountDetails,
    platformFee: 3,
    transactionId: "NX250302122516459444463321",
    referenceId: responseData.bbps_reference_no || "N/A",
    debitedFrom: `XXX${user?.user?.MobileNumber?.slice(-4) || "XXXX"}`,
    utr: "598867981302",
  };

  // Precompute particle endpoints/sizes/colors ONCE
  const fireParticles = useRef(
    Array.from({ length: FIRE_COUNT }, (_, i) => {
      const angle = (i / FIRE_COUNT) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * (Math.PI / 18);
      const a = angle + jitter;
      const dist = 90 + Math.random() * 80;
      const dx = Math.cos(a) * dist;
      const dy = Math.sin(a) * dist;
      const size = 6 + Math.random() * 6;
      const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      return { dx, dy, size, color };
    })
  ).current;

  // SOUND: play once on mount
  const soundRef = useRef(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/sonicbconnect.mp3'),
          { shouldPlay: true, volume: 0.9 }
        );
        if (!mounted) return;
        soundRef.current = sound;
        await sound.playAsync();
      } catch (e) {
        console.warn('Audio play failed:', e?.message || e);
      }
    })();
    return () => {
      mounted = false;
      if (soundRef.current) soundRef.current.unloadAsync().catch(() => {});
    };
  }, []);

  // HELPER: stop all running animations on unmount (prevents tracking errors)
  useEffect(() => {
    return () => {
      const singles = [scale, ringScale1, ringScale2, ringOpacity1, ringOpacity2, flashOpacity, fireProgress];
      singles.forEach(v => v.stopAnimation?.());
      confettiY.forEach(v => v.stopAnimation?.());
      confettiRotate.forEach(v => v.stopAnimation?.());
    };
  }, [scale, ringScale1, ringScale2, ringOpacity1, ringOpacity2, flashOpacity, fireProgress, confettiY, confettiRotate]);

  // ANIMATIONS
  useEffect(() => {
    let completes = 0;
    const done = () => {
      completes += 1;
      if (completes === 2) setTimeout(() => setShowFx(false), 120);
    };

    // Tick pop
    const tickPop = Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
      tension: 120,
    });

    // Double pulse rings
    const ring1 = Animated.parallel([
      Animated.timing(ringOpacity1, { toValue: 0.35, duration: 120, useNativeDriver: true }),
      Animated.timing(ringScale1, {
        toValue: 2.1,
        duration: 700 + EXTRA_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    const ring1Fade = Animated.timing(ringOpacity1, { toValue: 0, duration: 420, useNativeDriver: true });

    const ring2 = Animated.parallel([
      Animated.timing(ringOpacity2, { toValue: 0.3, duration: 120, delay: 140, useNativeDriver: true }),
      Animated.timing(ringScale2, {
        toValue: 2.4,
        duration: 850 + EXTRA_MS,
        delay: 140,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    const ring2Fade = Animated.timing(ringOpacity2, { toValue: 0, duration: 420, useNativeDriver: true });

    // Screen flash
    const flash = Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.16, duration: 120, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]);

    // Firework burst (center particles)
    const firework = Animated.sequence([
      Animated.timing(fireProgress, {
        toValue: 1,
        duration: 500 + EXTRA_MS / 2,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(fireProgress, {
        toValue: 1.2,
        duration: 200 + EXTRA_MS / 4,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]);

    // Run center effects together
    Animated.sequence([
      tickPop,
      Animated.parallel([ring1, ring2, flash, firework]),
      Animated.parallel([ring1Fade, ring2Fade]),
    ]).start(done);

    // Falling confetti
    const fall = confettiY.map((val, i) =>
      Animated.timing(val, {
        toValue: SCREEN_HEIGHT * 0.7 + Math.random() * (SCREEN_HEIGHT * 0.2),
        duration: 1100 + i * 35 + EXTRA_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );
    const spins = confettiRotate.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 1200 + i * 30 + EXTRA_MS,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    Animated.parallel([...fall, ...spins]).start(done);
  }, [scale, ringScale1, ringScale2, ringOpacity1, ringOpacity2, flashOpacity, fireProgress, confettiY, confettiRotate]);

  const handleShareReceipt = () => {
    const message = `Recharge successful!
Amount: ₹${AMOUNT}
Mobile: 52864554376
Date: 01:21 pm on 03 Jun 2025
Transaction ID: dsfgeih3878477
Airtel Prepaid Reference ID: 6766738
Debited from: XX7389
UTR: 937626543646
Platform fees: ₹${PLATFORM_FEE}
LCR Money Redemption: ₹${LCR_MONEY}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => (supported ? Linking.openURL(url) : Alert.alert('WhatsApp not installed', 'Please install WhatsApp to share the receipt.')))
      .catch((err) => console.error('An error occurred', err));
  };

  // Safe index helper to avoid undefined transforms (prevents stopTracking errors)
  const safe = (arr, i) => (i < arr.length ? arr[i] : new Animated.Value(0));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Main content */}
      <View style={styles.container}>
        <View style={styles.successBanner}>
          <Text style={styles.successText}>{transactionDetails.status}</Text>
          <Text style={styles.timeText}>{transactionDetails.timestamp}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mobile recharged</Text>

          <View style={styles.row}>
            <Ionicons name="flash-outline" size={22} color="#111" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.rechargeLabel}>{transactionDetails.provider}</Text>
              <Text style={styles.mobileNumber}>{transactionDetails.number}</Text>
            </View>
            <Text style={styles.amount}>₹{AMOUNT}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>Payment details</Text>
            <DetailRow label="Transaction ID" value={transactionDetails.transactionId} />
            <DetailRow label="Airtel Prepaid Reference ID" value={transactionDetails.referenceId} />
            <DetailRow label="Debited from" value={transactionDetails.debitedFrom} amount={`₹${transactionDetails.debit_Amt}`} />
            <DetailRow label="UTR" value={transactionDetails.utr} />
            <DetailRow label="Platform fees" value="—" amount={`₹${transactionDetails.platformFee}`} />
            <DetailRow label="LCR Money Redemption" value="—" amount={`₹${transactionDetails.discountDetail.lcrRedemption}`} />
          </View>

          {/* Actions */}
          <View style={styles.actionsWrap}>
            <ActionButton icon="history" label="History" onPress={() => navigation.navigate('History')} />
            <ActionButton icon="refresh" label="Repeat" onPress={() => {}} />
            <ActionButton icon="share" label="Share" onPress={handleShareReceipt} />
          </View>
        </View>

        {/* Powered by (centered, its own bar) */}
        <View style={styles.poweredByBar}>
          <Text style={styles.poweredByText}>
            Powered by <Text style={styles.footerBold}>LCRPAY</Text>
          </Text>
        </View>

        {/* Spacer so nothing hides behind the footer bar */}
        <View style={{ height: FOOTER_HEIGHT }} />
      </View>

      {/* Sticky footer with two buttons */}
      <View style={styles.footerBar}>
        <TouchableOpacity
          style={[styles.footerBtn, styles.footerBtnSecondary]}
          onPress={() => Alert.alert('Support', 'Opening LCRPAY Support...')}
          activeOpacity={0.85}
        >
          <Text style={[styles.footerBtnText, styles.footerBtnTextSecondary]}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.footerBtn, styles.footerBtnPrimary]}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.9}
        >
          <Text style={styles.footerBtnText}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Celebration overlay */}
      {showFx && (
        <View pointerEvents="none" style={styles.fxLayer}>
          {/* Screen flash */}
          <Animated.View style={[styles.flash, { opacity: flashOpacity }]} />

          {/* Centered effects (tick + double rings + firework burst) */}
          <View style={styles.fxCenter}>
            {/* Rings */}
            <Animated.View
              style={[
                styles.centerPulse,
                { opacity: ringOpacity1, transform: [{ scale: ringScale1 }] },
              ]}
            />
            <Animated.View
              style={[
                styles.centerPulse2,
                { opacity: ringOpacity2, transform: [{ scale: ringScale2 }] },
              ]}
            />

            {/* Firework burst particles */}
            {fireParticles.map((p, i) => {
              const tx = fireProgress.interpolate({ inputRange: [0, 1.2], outputRange: [0, p.dx] });
              const ty = fireProgress.interpolate({ inputRange: [0, 1.2], outputRange: [0, p.dy] });
              const opacity = fireProgress.interpolate({ inputRange: [0, 0.6, 1.2], outputRange: [0, 1, 0] });
              const scaleDot = fireProgress.interpolate({ inputRange: [0, 1.2], outputRange: [1.1, 0.7] });
              return (
                <Animated.View
                  key={`fp-${i}`}
                  style={[
                    styles.fireDot,
                    {
                      backgroundColor: p.color,
                      width: p.size,
                      height: p.size,
                      opacity,
                      transform: [{ translateX: tx }, { translateY: ty }, { scale: scaleDot }],
                    },
                  ]}
                />
              );
            })}

            {/* Big green tick */}
            <Animated.View style={[styles.centerCheck, { transform: [{ scale }] }]}>
              <Ionicons name="checkmark" size={56} color="white" />
            </Animated.View>
          </View>

          {/* Background falling confetti */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {Array.from({ length: Math.min(confettiRotate.length, confettiY.length) }).map((_, i) => {
              const rotVal = safe(confettiRotate, i);
              const ty = safe(confettiY, i);
              const left = (SCREEN_WIDTH / confettiRotate.length) * i + (i % 2 ? 6 : 2);
              const rotateTo = 180 + (i * 23) % 160;
              const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
              const rotate = rotVal.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', `${rotateTo}deg`],
              });
              return (
                <Animated.View
                  key={`cf-${i}`}
                  style={[
                    styles.confetti,
                    {
                      backgroundColor: color,
                      left,
                      transform: [{ translateY: ty }, { rotate }],
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const DetailRow = ({ label, value, amount }) => (
  <View style={styles.detailRow}>
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
    {amount && <Text style={styles.amount}>{amount}</Text>}
  </View>
);

const ActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.8}>
    <MaterialIcons name={icon} size={20} color="#6A1B9A" />
    <Text style={styles.actionLabel} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

const FOOTER_HEIGHT = 64;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { flex: 1, paddingHorizontal: 14, paddingTop: 8 },

  /* Header */
  successBanner: { backgroundColor: '#22C55E', paddingVertical: 16, borderRadius: 14, alignItems: 'center', overflow: 'hidden' },
  successText: { fontSize: 18, color: 'white', fontWeight: '700' },
  timeText: { color: 'white', fontSize: 12, marginTop: 2, opacity: 0.95 },

  /* Card */
  card: { backgroundColor: 'white', padding: 14, borderRadius: 14, elevation: 2, marginTop: 12 },
  sectionTitle: { fontWeight: '700', fontSize: 15, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rechargeLabel: { fontWeight: '700', fontSize: 15 },
  mobileNumber: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  amount: { marginLeft: 'auto', fontWeight: '800', fontSize: 16 },
  section: { marginTop: 8 },
  subTitle: { fontWeight: '700', marginBottom: 6, fontSize: 13 },
  detailRow: { marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLabel: { fontSize: 11, color: '#6B7280', marginBottom: 2 },
  detailValue: { fontSize: 13, maxWidth: 220 },

  actionsWrap: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  actionButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, backgroundColor: '#F8F5FB', minWidth: '31%', maxWidth: '31%' },
  actionLabel: { fontSize: 11, color: '#6A1B9A', marginTop: 4, fontWeight: '600' },

  /* Powered-by bar */
  poweredByBar: { height: 36, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  poweredByText: { color: '#6B7280', fontSize: 11 },
  footerBold: { fontWeight: '800', color: '#111827' },

  /* Sticky footer */
  footerBar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: FOOTER_HEIGHT,
    backgroundColor: '#FFFFFF', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB',
    paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'space-between',
    zIndex: 20, ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: -2 } }, android: { elevation: 12 } }),
  },
  footerBtn: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  footerBtnPrimary: { backgroundColor: '#6A1B9A' },
  footerBtnSecondary: { backgroundColor: '#F3E8FF', borderWidth: 1, borderColor: '#E9D5FF' },
  footerBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15, letterSpacing: 0.3 },
  footerBtnTextSecondary: { color: '#6A1B9A' },

  /* Celebration overlay */
  fxLayer: { ...StyleSheet.absoluteFillObject, zIndex: 15, pointerEvents: 'none' },
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: '#ffffff' },
  fxCenter: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  centerPulse: { position: 'absolute', height: 110, width: 110, borderRadius: 55, backgroundColor: '#22C55E' },
  centerPulse2: { position: 'absolute', height: 140, width: 140, borderRadius: 70, backgroundColor: '#22C55E' },
  fireDot: { position: 'absolute', borderRadius: 999 },
  centerCheck: { height: 86, width: 86, borderRadius: 43, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  confetti: { position: 'absolute', top: 0, width: 8, height: 12, borderRadius: 2 },
});
