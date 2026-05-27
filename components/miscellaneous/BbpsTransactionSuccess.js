import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  StatusBar,
} from "react-native";
import { ChevronDown, Smartphone, Home, CheckCircle2, XCircle } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment";
import { BASE_URL } from "../../utils/config";
import { Wallet } from "lucide-react-native";

import Theme from "../Theme";

import ViewShot from "react-native-view-shot";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import { useSelector } from "react-redux";
import { correctPath } from "../../utils";
import { Audio } from "expo-av";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const BbpsTransactionSuccess = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.register.user);
  const insets = useSafeAreaInsets();

  // --- Sonic branding: play once on screen open ---
  const soundRef = useRef(null);
  useEffect(() => {
    let isMounted = true;

    const initAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/sonicbconnect.mp3"),
          { shouldPlay: true }
        );
        if (!isMounted) return;
        soundRef.current = sound;
      } catch (e) {
        console.log("Sonic branding error:", e);
      }
    };

    initAndPlay();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, []);
  // --- end sonic branding ---

  useEffect(() => {
    const backAction = () => {
      // Navigate to HomeScreen instead of going back
      navigation.navigate("HomeScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const route = useRoute();
  const {
    successResponse,
    recipient_name = "",
    razorpay_payment_id,
    razorpay_order_id,
    gateway_order_id,
    amount,
    biller_name,
    service_type,
    client_txn_id,
  } = route.params || {};


 

  // Use either successResponse (for BBPS) or Razorpay response data (dynamic)
  const isRazorpayPayment = !!razorpay_payment_id;
  const isSuccessful = isRazorpayPayment || successResponse?.status;

  const transactionDetails = {
    status: isSuccessful ? "Payment successful" : "Payment Failed",
    timestamp: moment(successResponse?.transaction_date || new Date()).format(
      "hh:mm a on DD MMM YYYY"
    ),
    provider: biller_name==="N/A" ? "LUCREWAY PAY PVT LTD": biller_name || recipient_name ,
    amount: Number(amount || successResponse?.amount || 0).toFixed(2),
    referenceId: client_txn_id || successResponse?.bbps_reference_no || "--",
    debitedFrom: `XXX${user?.user?.MobileNumber.slice(-4)}`,
    utr: razorpay_payment_id || successResponse?.reference_id || "--",
    razorpay_payment_id: razorpay_payment_id || "--",
    razorpay_order_id: razorpay_order_id || "--",
    gateway_order_id: gateway_order_id || "--",
  };

  const handleShare = () => {
    setImageUri(null);
    captureScreenshot();
    shareScreenshot();
  };

  // =============================================================================
  // Take a Screenshot and share it
  // =============================================================================
  const viewShotRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  const captureScreenshot = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      setImageUri(uri);
    } catch (error) {
      console.error("Screenshot capture failed", error);
    }
  };

  const shareScreenshot = async () => {
    if (!imageUri) return;

    try {
      const filePath = `${RNFS.CachesDirectoryPath}/screenshot.png`;
      await RNFS.copyFile(imageUri, filePath);
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        console.error("File does not exist");
        return;
      }

      await Share.open({
        url: `file://${filePath}`,
        type: "image/png",
      });
    } catch (error) {
      console.error("Sharing failed", error);
    }
  };

  // Navigate home
  const goHome = () => {
    // If your route is named differently (e.g. "Home"), change it here:
    navigation.navigate("HomeScreen");
    // Or to reset stack to home, use:
    // navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
      >
        {/* Header */}
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 0.9 }}
          style={{ backgroundColor: "#f5f5f8" }}
        >
          <View
            style={[
              styles.header,
              {
                backgroundColor: isSuccessful
                  ? Theme.colors.primary
                  : Theme.colors.danger,
              },
            ]}
          >
            <View style={styles.headerTopRow}>
              <Image
                source={require("../../assets/BAssuredLogoReversePNG.png")}
                style={styles.bcassured}
              />
              <View style={styles.statusPill}>
                {isSuccessful ? (
                  <CheckCircle2 size={18} color="#0F5132" />
                ) : (
                  <XCircle size={18} color="#842029" />
                )}
                <Text style={styles.statusPillText}>
                  {isSuccessful ? "Success" : "Failed"}
                </Text>
              </View>
            </View>

            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>Paid amount</Text>
              <Text style={styles.amountValue}>₹{transactionDetails.amount}</Text>
              <Text style={styles.timestamp}>{transactionDetails.timestamp}</Text>
            </View>
          </View>

          {/* Mobile Recharge Details */}
          <View style={styles.section}>
            <View style={styles.rechargeInfo}>
              <View style={styles.providerInfo}>
                <Smartphone size={22} color={Theme.colors.primary} />
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>
                    {transactionDetails.provider}
                  </Text>
                  <Text style={styles.subtleText}>
                    Ref: {transactionDetails.referenceId}
                  </Text>
                </View>
              </View>
              <View style={styles.badgeMuted}>
                <Text style={styles.badgeText}>₹{transactionDetails.amount}</Text>
              </View>
            </View>
          </View>

          {/* Payment Details */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.paymentHeader} onPress={() => { }}>
              <View style={styles.paymentHeaderLeft}>
                <Wallet size={25} color="black" />
                <Text style={styles.paymentHeaderText}>Payment details</Text>
              </View>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>

            <View style={styles.paymentDetails}>
              {isRazorpayPayment ? (
                <>
                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>Razorpay Payment ID</Text>
                    <Text style={styles.idValue} numberOfLines={1}>
                      {transactionDetails.razorpay_payment_id}
                    </Text>
                  </View>

                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>Razorpay Order ID</Text>
                    <Text style={styles.idValue} numberOfLines={1}>
                      {transactionDetails.razorpay_order_id}
                    </Text>
                  </View>

                 

                  {client_txn_id && (
                    <View style={styles.idSection}>
                      <Text style={styles.idLabel}>Transaction ID</Text>
                      <Text style={styles.idValue} numberOfLines={1}>
                        {client_txn_id}
                      </Text>
                    </View>
                  )}

                  {service_type && (
                    <View style={styles.idSection}>
                      <Text style={styles.idLabel}>Service Type</Text>
                      <Text style={styles.idValue}>{service_type}</Text>
                    </View>
                  )}

                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>Customer convenience fee</Text>
                    <Text style={styles.idValue}>{"0.00"}</Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>LCR Reference ID</Text>
                    <Text style={styles.idValue}>
                      {successResponse?.reference_id}
                    </Text>
                  </View>

                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>B-Connect transaction Id</Text>
                    <Text style={styles.idValue}>
                      {successResponse?.transaction_refrence_no}
                    </Text>
                  </View>
                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>Reference ID</Text>
                    <Text style={styles.idValue}>
                      {successResponse?.bbps_reference_no}
                    </Text>
                  </View>
                  <View style={styles.idSection}>
                    <Text style={styles.idLabel}>Customer convenience fee</Text>
                    <Text style={styles.idValue}>{"0.00"}</Text>
                  </View>
                </>
              )}
              <View style={styles.debitedSection}>
                <Text style={styles.debitedLabel}>
                  {" "}
                  {isSuccessful
                    ? "Debited from"
                    : "Amount Will Be refund In case of Debit"}
                </Text>
                <View style={styles.debitedInfo}>
                  <Image
                    source={
                      user?.user?.profile
                        ? {
                          uri: correctPath(
                            `${BASE_URL}/${user?.user?.profile}`
                          ),
                        }
                        : require("../../assets/Profilee.png")
                    }
                    style={styles.bankIcon}
                  />
                  <View style={styles.debitedDetails}>
                    <Text style={styles.accountNumber}>
                      {transactionDetails.debitedFrom}
                    </Text>
                    <Text style={styles.utrNumber}>
                      UTR: {transactionDetails?.referenceId}
                    </Text>
                  </View>
                  <Text style={styles.debitedAmount}>
                    ₹{transactionDetails?.amount}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ViewShot>

        {/* Share Button */}
        <TouchableOpacity
          style={[
            styles.shareButton,
            {
              backgroundColor: isSuccessful
                ? Theme.colors.primary
                : Theme.colors.danger,
            },
          ]}
          onPress={handleShare}
        >
          <Text style={styles.shareButtonText}>Share receipt</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer with Home button */}
      <View
        style={[styles.footerNav, { paddingBottom: 12 + insets.bottom }]}
      >
        <TouchableOpacity style={styles.homeBtn} onPress={goHome} activeOpacity={0.9}>
          <Home size={20} color="#fff" />
          <Text style={styles.homeBtnText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f8",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f8",
  },
  bcassured: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statusPillText: {
    color: "#fff",
    fontWeight: "600",
  },
  amountBlock: {
    marginTop: 18,
    alignItems: "flex-start",
    gap: 6,
  },
  headerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  timestamp: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  amountValue: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "800",
  },
  amountLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
  },
  section: {
    backgroundColor: "white",
    padding: 18,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  rechargeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  providerDetails: {
    marginLeft: 12,
    gap: 2,
  },
  providerName: {
    fontSize: 18,
    fontWeight: "600",
  },
  subtleText: {
    fontSize: 13,
    color: "#6b7280",
  },
  badgeMuted: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eef2ff",
    borderRadius: 999,
  },
  badgeText: {
    color: Theme.colors.primary,
    fontWeight: "700",
  },
  phoneNumber: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: "600",
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  paymentHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  receiptIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  paymentHeaderText: {
    fontSize: 18,
    fontWeight: "500",
  },
  paymentDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  idSection: {
    marginTop: 24,
  },
  idLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  idValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  debitedSection: {
    marginTop: 16,
  },
  debitedLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  debitedInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  debitedDetails: {
    flex: 1,
    marginLeft: 12,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: "500",
  },
  utrNumber: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  debitedAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  shareButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // --- New footer styles ---
  footerNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  homeBtn: {
    flexDirection: "row",
    justifyContent: "center",   // center icon + text
    alignItems: "center",
    gap: 8,
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    width: "100%",              // make button full width
    borderRadius: 0,            // flat edges (better for full-width button)
    elevation: 2,
  },

  homeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BbpsTransactionSuccess;





