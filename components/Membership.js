import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { withAlpha } from "../utils/helper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userData } from "../src/features/userRegister/RegisterSlice";
import { history } from "../src/features/wallet/walletSlice";
import { SafeAreaView } from 'react-native-safe-area-context';

const Membership = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.register.user);
  const [userInfo, setUserInfo] = useState({});


  const MembershipPrice = parseFloat(user?.primePrice + user?.primePrice * 0.18) || 0;

  console.log(user);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Function to load/reload data
  const loadData = async () => {
    try {
      setLoading(true);
      await dispatch(history());
      const result = await dispatch(userData());
      if (result.payload && result.payload.user) {
        setUserInfo(result.payload.user);
      }

    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const navigateToPaymentScreen = () => {

    // navigation.navigate("PaymentGatewayScreen");

    // navigation.navigate("payWithSabpaise", {
    //   autoStart: false,
    //   origin: "PaymentGatewayScreen",
    //   returnTo: "HomeScreen",
    //   amount: parseFloat(MembershipPrice),
    //   payload: {
    //     amount: parseFloat(MembershipPrice),
    //     service_type: "Prime_Activation",
    //   },
    // });

    navigation.navigate("ApplyCoupan");
  };


  // 👉 Navigate to Profile when KYC is pending and user taps the pending text/badge
  const handleKycPress = () => {
    if (!userInfo?.IsKYCCompleted) {
      // Change "Profile" to your actual route name if different
      navigation.navigate("Profile");
    }
  };

  // const canActivateOwnPrime = !userInfo.prime_status || !hasInsufficientBalance;
  const canActivateOwnPrime = !userInfo.prime_status;



  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.card}>

            <View style={styles.tabContent}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={Theme.colors.primary}
                  />
                  <Text style={styles.loadingText}>
                    Loading membership details...
                  </Text>
                </View>
              ) : (
                <>
                  {/* HERO CARD */}
                  <LinearGradient
                    colors={userInfo.prime_status ? [withAlpha(Theme.colors.primary, 0.12), withAlpha("#FFD700", 0.08)] : [withAlpha(Theme.colors.primary, 0.06), "#fff"]}
                    style={styles.heroCard}
                  >
                    <View style={styles.heroLeft}>
                      <Text style={styles.heroTitle}>
                        {userInfo.prime_status ? "Thank you for being Prime!" : "Upgrade to Prime"}
                      </Text>
                      <Text style={styles.heroSubtitle} numberOfLines={2}>
                        {userInfo.prime_status ? "You unlock exclusive offers and privileges" : "Activate Lifetime Prime membership and get rewards, cashback & more"}
                      </Text>

                      {userInfo.prime_status ? (
                        <TouchableOpacity
                          style={styles.heroManageBtn}
                          onPress={() => navigation.navigate("Membership")}
                          activeOpacity={0.85}
                          accessibilityLabel="Manage membership benefits"
                        >
                          <Text style={styles.heroManageText}>Manage Benefits</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.heroUpgradeBtn}
                          onPress={() => navigateToPaymentScreen()}
                          activeOpacity={0.85}
                          accessibilityLabel="Activate prime membership"
                        >
                          <Text style={styles.heroUpgradeText}>Activate ₹ {parseFloat(user?.primePrice).toFixed(2)}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.heroRight}>
                      <Image
                        source={userInfo.prime_status ? require("../assets/LifeTime.png") : require("../assets/non_prime.png")}
                        style={styles.heroImage}
                      />
                    </View>
                  </LinearGradient>

                  <View style={styles.benefitsRow}>
                    <View style={styles.benefitItem}>
                      <MaterialIcons name="local-offer" size={20} color={Theme.colors.primary} />
                      <Text style={styles.benefitText}>Exclusive deals</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <MaterialIcons name="payments" size={20} color={Theme.colors.primary} />
                      <Text style={styles.benefitText}>Cashback</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <MaterialIcons name="support-agent" size={20} color={Theme.colors.primary} />
                      <Text style={styles.benefitText}>Priority Support</Text>
                    </View>
                  </View>

                  <Text style={styles.profileTitle}>Membership Details</Text>

                  <View style={styles.tableContainer}>
                    <View style={styles.tableRow}>
                      <View style={styles.tableCellLabel}>
                        <Text style={styles.label}>Mobile Number</Text>
                      </View>
                      <View style={styles.tableCellValue}>
                        <Text style={styles.value}>
                          {userInfo.MobileNumber || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.tableRow}>
                      <View style={styles.tableCellLabel}>
                        <Text style={styles.label}>Membership Amt.</Text>
                      </View>
                      <View style={styles.tableCellValue}>
                        <Text style={styles.value}>{MembershipPrice}/-</Text>
                      </View>
                    </View>

                    <View style={styles.tableRow}>
                      <View style={styles.tableCellLabel}>
                        <Text style={styles.label}>Account Created</Text>
                      </View>
                      <View style={styles.tableCellValue}>
                        <Text style={styles.value}>
                          {formatDate(userInfo.CreatedAt)}
                        </Text>
                      </View>
                    </View>

                    {userInfo.prime_activation_date && (
                      <View style={styles.tableRow}>
                        <View style={styles.tableCellLabel}>
                          <Text style={styles.label}>Prime Since</Text>
                        </View>
                        <View style={styles.tableCellValue}>
                          <Text style={styles.value}>
                            {formatDate(userInfo.prime_activation_date)}
                          </Text>
                        </View>
                      </View>
                    )}

                    <View style={styles.tableRow}>
                      <View style={styles.tableCellLabel}>
                        <Text style={styles.label}>Prime Status</Text>
                      </View>
                      <View style={styles.tableCellValue}>
                        <View
                          style={[
                            styles.statusBadge,
                            userInfo.prime_status
                              ? styles.activeBadge
                              : styles.inactiveBadge,
                          ]}
                        >
                          <Text style={styles.statusText}>
                            {userInfo.prime_status ? "ACTIVE" : "INACTIVE"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* KYC Status row with clickable "PENDING" */}
                    <View style={styles.tableRow}>
                      <View style={styles.tableCellLabel}>
                        <Text style={styles.label}>KYC Status</Text>
                      </View>
                      <View style={styles.tableCellValue}>
                        {userInfo.IsKYCCompleted ? (
                          <View
                            style={[styles.statusBadge, styles.activeBadge]}
                          >
                            <Text style={styles.statusText}>COMPLETED</Text>
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={handleKycPress}
                            activeOpacity={0.8}
                            accessibilityRole="button"
                            accessibilityLabel="KYC pending. Tap to complete in Profile."
                            style={[styles.statusBadge, styles.pendingBadge]}
                          >
                            <Text style={styles.statusText}>
                              PENDING
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>

                  {!userInfo.prime_status && (
                    <View style={styles.activationSection}>
                      <TouchableOpacity
                        style={
                          canActivateOwnPrime
                            ? styles.activateButton
                            : [styles.activateButton, styles.disabledButton]
                        }
                        onPress={navigateToPaymentScreen}
                        disabled={!canActivateOwnPrime || loading}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <MaterialIcons
                              name="stars"
                              size={20}
                              color="white"
                              style={styles.buttonIcon}
                            />
                            <Text style={styles.activateText}>
                              Activate Prime Membership
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <Text style={styles.pricingInfo}>
                        Prime Membership fee: ₹{user?.primePrice}.00 + 18% Gst
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>



          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { flexGrow: 1, paddingTop: 0 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 0 },
  // Cardless layout: keep structure but remove box visual and shadow
  card: {
    backgroundColor: "transparent",
    borderRadius: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: "visible",
    paddingTop: 0,
    marginTop: 0,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f2f5",
    borderRadius: 8,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeToggleButton: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: { fontSize: 14, fontWeight: "500", color: "#666" },
  activeText: { fontWeight: "700", color: Theme.colors.primary },
  tabContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  loadingContainer: { alignItems: "center", justifyContent: "center", padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, color: "#666" },
  profileHeader: { alignItems: "center", marginBottom: 18 },
  profileImage: { width: 84, height: 84, borderRadius: 42, marginBottom: 8 },
  membershipBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: Theme.colors.primary,
    borderRadius: 20,
  },
  membershipStatus: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  profileTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  tableContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 8,
    overflow: "visible",
    marginBottom: 18,
    backgroundColor: "transparent",
  },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  tableCellLabel: {
    flex: 1,
    padding: 12,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "#edf0f2",
  },
  tableCellValue: { flex: 1, padding: 12, justifyContent: "center", alignItems: "center" },
  label: { fontWeight: "600", color: "#555" },
  value: { color: "#333" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
  activeBadge: { backgroundColor: "#4caf50" },
  inactiveBadge: { backgroundColor: "#f44336" },
  pendingBadge: { backgroundColor: "#ff9800" },
  statusText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  activationSection: { alignItems: "center" },
  activateButton: {
    flexDirection: "row",
    backgroundColor: Theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 8,
  },
  disabledButton: { opacity: 0.5 },
  buttonIcon: { marginRight: 8 },
  activateText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  pricingInfo: { marginTop: 8, color: "#666", fontSize: 14 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 8 },
  sectionDescription: { fontSize: 14, color: "#666", marginBottom: 24, lineHeight: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  input: { flex: 1, height: 48, fontSize: 16, color: "#333" },
  validationIcon: { padding: 8 },
  validationMessage: { marginTop: 8, fontSize: 14, fontWeight: "500" },
  successMessage: { color: "green" },
  errorMessage: { color: "#d9534f" },
  userInfoCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userInfoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userAvatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 4 },
  userPhone: { fontSize: 14, color: "#666", marginBottom: 8 },
  userStatusBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  userActiveBadge: { backgroundColor: "#4caf50" },
  userInactiveBadge: { backgroundColor: "#f44336" },
  userStatusText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  activatePeerButton: {
    flexDirection: "row",
    backgroundColor: Theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 12,
  },
  activatePeerButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  warningContainer: {
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffeeba",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  warningText: { color: "#856404", fontSize: 14, textAlign: "center", marginVertical: 8 },
  rechargeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  rechargeButtonText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  /* HERO CARD */
  heroCard: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 0,
    alignItems: "center",
    marginBottom: 18,
    overflow: "hidden",
  },
  heroLeft: { flex: 1, paddingRight: 12, justifyContent: "center" },
  heroRight: { width: 120, alignItems: "center", justifyContent: "center" },
  heroTitle: { fontSize: 20, fontWeight: "900", color: Theme.colors.text, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: Theme.colors.subtext, marginBottom: 12 },
  heroManageBtn: { backgroundColor: Theme.colors.primary, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: "flex-start" },
  heroManageText: { color: "#fff", fontWeight: "700" },
  heroUpgradeBtn: { backgroundColor: Theme.colors.primary, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, alignSelf: "flex-start" },
  heroUpgradeText: { color: "#fff", fontWeight: "700" },
  heroImage: { width: 118, height: 118, resizeMode: "contain" },
  benefitsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16, paddingHorizontal: 4 },
  benefitItem: { flex: 1, backgroundColor: "#fff", borderRadius: 10, padding: 10, marginHorizontal: 4, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#f0f0f0" },
  benefitText: { fontSize: 12, color: "#333", marginTop: 6, textAlign: "center", fontWeight: "600" },
});

export default Membership;
