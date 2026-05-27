import { CameraView } from "expo-camera";
import {
  AppState,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Vibration,
  Animated,
  Alert,
  NativeModules,
  Linking,
  TextInput,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../utils/config";

const { UPIManager } = NativeModules;

// ===================== Helpers (pure functions) =====================

const isPersonalQR = (params) => {
  // crude heuristic: if no merchant-related fields, treat as personal
  return !params.mc && !params.sign && !params.orgId && !params.orgid;
};

const buildQueryStringFromParams = (params) =>
  Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v || "")}`)
    .join("&");

// Build app-specific UPI URL for both merchant & personal
const buildUPIUrlForApp = (params, appId) => {
  const qs = buildQueryStringFromParams(params);
  console.log("buildUPIUrlForApp", params,appId);

  switch (appId) {

    
    case "gpay":
      console.log("app id is",appId)
      console.log("gpay url", `gpay://upi/pay?${qs}`);
      // console.log("upi url", `upi://pay?${qs}`);
        //  String upiurl = 'upi://pay?pa=user@hdfgbank&pn=SenderName&tn=TestingGpay&am=100&cu=INR';    

      return `gpay://upi/pay?${qs}`;
    case "phonepe":
      console.log("phonepe url is",`phonepe://pay?${qs}`);
      return `phonepe://pay?${qs}`;
    case "paytm":
      return `paytmmp://pay?${qs}`;
    default:
      return null;
  }
};

// Native UPI launcher via your Kotlin module
const openUPI = async (uri, packageName = null) => {
  try {
    await UPIManager.pay(uri, packageName);
  } catch (e) {
    console.error("UPI Error:", e);
    Alert.alert("UPI Error", "Unable to start payment.");
  }
};

// Razorpay UPI Intent payment function
const initiateRazorpayUPIPayment = async (upiData, amount, note) => {
  if (!amount || parseFloat(amount) <= 0) {
    Alert.alert("Invalid Amount", "Please enter a valid amount");
    return;
  }

  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      Alert.alert("Error", "Please login to continue");
      return;
    }

    // Create Razorpay UPI payment
    const paymentData = {
      vpa: upiData.pa || upiData.payeeVpa,
      name: upiData.pn || upiData.payeeName,
      amount: parseFloat(amount),
      note: note || `Payment to ${upiData.pn || upiData.payeeName}`,
      currency: "INR"
    };

    // Call your existing recharge payment API with Razorpay UPI intent
    const response = await axios.post(
      `${BASE_URL}/payment/razorpay-upi-intent`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.success) {
      Alert.alert(
        "Payment Initiated",
        "Payment has been initiated. Please complete it in the UPI app.",
        [
          { text: "OK", onPress: resetScanner }
        ]
      );
    } else {
      Alert.alert("Payment Failed", response.data.message || "Unable to initiate payment");
    }
  } catch (error) {
    console.error("Razorpay UPI payment error:", error);
    Alert.alert(
      "Payment Error",
      error.response?.data?.message || "Failed to initiate payment"
    );
  }
};

export default function Scan() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [isEnableTorch, setIsEnableTorch] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const navigation = useNavigation();

  // UPI State
  const [upiModalVisible, setUpiModalVisible] = useState(false);
  const [upiQuery, setUpiQuery] = useState({});
  const [upiRaw, setUpiRaw] = useState("");
  const [upiVerifiedName, setUpiVerifiedName] = useState(null);
  const [installedUpiApps, setInstalledUpiApps] = useState([]);

  // Razorpay UPI Payment State
  const [razorpayAmount, setRazorpayAmount] = useState("");
  const [razorpayNote, setRazorpayNote] = useState("");

  // ================= Detect installed UPI apps using UPIManager =================

  const detectInstalledUpiApps = async () => {
    const candidates = [
      {
        id: "gpay",
        name: "Google Pay",
        packageName: "com.google.android.apps.nbu.paisa.user",
      },
      { id: "phonepe", name: "PhonePe", packageName: "com.phonepe.app" },
      { id: "paytm", name: "Paytm", packageName: "net.one97.paytm" },
    ];

    const installed = [];

    for (const app of candidates) {
      try {
        const installedStatus = await UPIManager.isInstalled(app.packageName);
        const upiReady = await UPIManager.isUpiReady(app.packageName);

        if (installedStatus && upiReady) {
          installed.push(app);
        }
      } catch (e) {
        // ignore
      }
    }

    setInstalledUpiApps(installed);
  };

  useEffect(() => {
    if (upiModalVisible) detectInstalledUpiApps();
  }, [upiModalVisible]);

  // ================= Parse UPI string into object =================

  const parseUPI = (upiString) => {
    try {
      const parts = upiString.split("?");
      const qs = parts[1] || "";
      const pairs = qs.split("&");
      const params = {};
      pairs.forEach((p) => {
        if (!p) return;
        const [k, v] = p.split("=");
        params[k] = decodeURIComponent(v || "");
      });
      return params;
    } catch (e) {
      return {};
    }
  };

  // ================= Lookup name if pa is 10-digit mobile =================

  const lookupMobileName = async (mobile) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return null;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const resp = await axios.post(
        `${BASE_URL}/misc/get_member_info`,
        { mobile_number: mobile },
        { headers }
      );

      if (resp.status === 200) {
        return resp.data.fullName || null;
      }
    } catch (e) {
      console.log("lookupMobileName error", e);
    }
    return null;
  };

  // ================= Fetch by mobile (non-UPI numeric QR) =================

  const fetchNameFromMobile = async (mobileNumber) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${BASE_URL}/misc/check_mobile_number_peer?mobile=${mobileNumber}`,
        { headers }
      );

      if (response.status === 200 && response.data?.data?.[0]) {
        navigation.navigate("PaymentScreen", {
          UserName: response.data.data[0],
          userMobile: mobileNumber,
        });
      } else {
        Alert.alert("User Not Found");
      }
    } catch (e) {
      console.error("Error fetching data:", e?.message || e);
      Alert.alert("Error", "Failed to verify number. Please try again.");
    }
  };

  // ================= QR Handler =================

  const handleBarCodeScanned = async ({ data }) => {
    if (!data || qrLock.current || !isScanning) return;
    console.log(data)

    qrLock.current = true;
    setIsScanning(false);

    Vibration.vibrate(80);

    try {
      // Case 1: Mobile number
      if (!isNaN(data) && data.length === 10) {
        await fetchNameFromMobile(data);
        return;
      }

      // Case 2: UPI (merchant or personal)
      if (
        data.startsWith("upi://") ||
        data.startsWith("gpay://") ||
        data.startsWith("phonepe://") ||
        data.startsWith("paytmmp://")
      ) {
        const parsed = parseUPI(data);
        setUpiQuery(parsed);
        setUpiRaw(data);

        // Optional: lookup user name if pa is 10-digit mobile
        if (parsed.pa && /^\d{10}$/.test(parsed.pa)) {
          const name = await lookupMobileName(parsed.pa);
          if (name) setUpiVerifiedName(name);
        }

        // For both merchant & personal, we show modal and open external apps
        setUpiModalVisible(true);
        return;
      }

      // Case 3: URL
      if (data.startsWith("http")) {
        await Linking.openURL(data);
      }
    } catch (err) {
      console.error("QR error", err);
      Alert.alert("Invalid QR Code");
    }
  };

  // ================= Open UPI in specific app =================

  const openUpiWithApp = (app) => {
    console.log("cme here====>",app)
    const url = buildUPIUrlForApp(upiQuery, app.id);

    if (!url) {
      Alert.alert("Error", "Unable to build UPI link for this app.");
      return;
    }

    openUPI(url, app.packageName);
    setUpiModalVisible(false);
  };

  // ================= Try preferred app (first in list) =================

  const tryOpenAppList = () => {
    if (installedUpiApps.length > 0) {
      const app = installedUpiApps[0];
      console.log("selected app is",app);
      const url = buildUPIUrlForApp(upiQuery, app.id);
      if (url) {
        openUPI(url, app.packageName);
      } else {
        openUPI(upiRaw, null);
      }
      setUpiModalVisible(false);
      return;
    }

    // Fallback: generic raw link
    openUPI(upiRaw, null);
    setUpiModalVisible(false);
  };

  // ================= Reset scanner =================

  const resetScanner = () => {
    qrLock.current = false;
    setIsScanning(true);
    setUpiModalVisible(false);
    setUpiQuery({});
    setUpiRaw("");
    setUpiVerifiedName(null);
  };

  // ================= Scan UI animation =================

  const scanLineAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Optional: reset scanner when app comes back to foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        resetScanner();
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  // ================= RENDER =================

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan QR Code</Text>
      </View>

      {/* Camera */}
      <View style={styles.cameraContainer}>
        <CameraView
          enableTorch={isEnableTorch}
          style={StyleSheet.absoluteFill}
          facing="back"
          onBarcodeScanned={isScanning ? handleBarCodeScanned : undefined}
        />

        {/* Scan line */}
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [
                {
                  translateY: scanLineAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 300],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsEnableTorch((prev) => !prev)}
        >
          <MaterialCommunityIcons
            name={isEnableTorch ? "flashlight" : "flashlight-off"}
            size={24}
            color="#fff"
          />
          <Text style={styles.controlText}>Flash</Text>
        </TouchableOpacity>

        {!isScanning && (
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={resetScanner}
          >
            <MaterialCommunityIcons name="refresh" size={24} color="#fff" />
            <Text style={styles.controlText}>Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Position QR inside the frame
        </Text>
      </View>

      {/* UPI Modal */}
      {upiModalVisible && (
        <View style={styles.upiModalOverlay}>
          <View style={styles.upiModal}>
            <Text style={styles.upiModalTitle}>Open Payment App</Text>
            <Text style={styles.upiModalText}>
              Payee: {upiQuery.pn || upiQuery.pa || "Unknown"}
            </Text>
            <Text style={styles.upiModalSub}>Payee ID: {upiQuery.pa}</Text>

            {upiVerifiedName && (
              <Text style={styles.upiVerifiedText}>
                Verified: {upiVerifiedName}
              </Text>
            )}

            <View style={styles.upiModalButtons}>
              <TouchableOpacity
                style={styles.upiOpenButton}
                onPress={tryOpenAppList}
              >
                <Text style={styles.upiOpenText}>Open in UPI App</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.upiOpenButton, { backgroundColor: Theme.colors.primary }]}
                onPress={() => {
                  Alert.alert(
                    "Pay with Razorpay",
                    "Enter amount to proceed with Razorpay UPI payment",
                    [
                      { text: "Cancel", style: "cancel" },
                      { 
                        text: "Continue", 
                        onPress: () => {
                          Alert.prompt(
                            "Enter Amount",
                            "Enter payment amount",
                            [
                              {
                                text: "Cancel",
                                style: "cancel",
                              },
                              {
                                text: "OK",
                                onPress: (amount) => {
                                  if (amount && parseFloat(amount) > 0) {
                                    setRazorpayAmount(amount);
                                    setRazorpayNote(upiQuery.tn || `Payment to ${upiQuery.pn || 'Unknown'}`);
                                    initiateRazorpayUPIPayment(upiQuery, amount, razorpayNote);
                                  } else {
                                    Alert.alert("Invalid Amount", "Please enter a valid amount");
                                  }
                                },
                              },
                            ],
                            "plain-text"
                          );
                        }
                      }
                    ]
                  );
                }}
              >
                <Text style={styles.upiOpenText}>Pay with Razorpay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.upiCopyButton}
                onPress={() => {
                  Clipboard.setString(upiQuery.pa || "");
                  Alert.alert("Copied", "Payee ID copied");
                }}
              >
                <Text style={styles.upiCopyText}>Copy Payee ID</Text>
              </TouchableOpacity>
            </View>

            {/* specific app buttons */}
            {installedUpiApps.length > 1 && (
              <View style={{ width: "100%", marginTop: 12 }}>
                <Text style={{ marginBottom: 8 }}>Open specifically in:</Text>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  {installedUpiApps.map((app) => (
                    <TouchableOpacity
                      key={app.id}
                      style={[styles.upiCopyButton, { marginHorizontal: 6 }]}
                      onPress={() => openUpiWithApp(app)}
                    >
                      <Text style={styles.upiCopyText}>{app.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity onPress={resetScanner} style={styles.upiCancel}>
              <Text style={styles.upiCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ===================== STYLES =====================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { padding: 16, alignItems: "center" },
  headerText: { fontSize: 20, color: "#fff", fontWeight: "bold" },

  cameraContainer: { flex: 1 },
  scanLine: {
    position: "absolute",
    left: "10%",
    width: "80%",
    height: 2,
    backgroundColor: Theme.colors.primary,
  },

  controls: { flexDirection: "row", justifyContent: "center", padding: 20 },
  controlButton: { alignItems: "center", padding: 10 },
  resetButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingHorizontal: 20,
    marginLeft: 16,
  },
  controlText: { color: "#fff", marginTop: 4 },

  instructions: { padding: 20, alignItems: "center" },
  instructionText: { color: "#ccc" },

  upiModalOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  upiModal: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },

  upiModalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  upiModalText: { fontSize: 16, marginBottom: 4 },
  upiModalSub: { fontSize: 14, color: "#666", marginBottom: 4 },
  upiVerifiedText: {
    fontSize: 14,
    color: Theme.colors.primary,
    marginBottom: 8,
  },

  upiModalButtons: { flexDirection: "row", marginVertical: 8 },
  upiOpenButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Theme.colors.primary,
    borderRadius: 8,
    marginRight: 10,
  },
  upiOpenText: { color: "#fff", fontWeight: "bold" },

  upiCopyButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 8,
  },
  upiCopyText: { color: Theme.colors.primary, fontWeight: "bold" },

  upiCancel: { marginTop: 10 },
  upiCancelText: { color: "#555" },
});
