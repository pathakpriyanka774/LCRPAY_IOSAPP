import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  StatusBar,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Theme from "./Theme";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../src/features/userRegister/RegisterSlice";
import { userData } from "../src/features/userRegister/RegisterSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { version } from '../package.json';
import { CommonActions, useNavigation } from "@react-navigation/native";
import {SafeAreaView} from 'react-native-safe-area-context';
import { BASE_URL } from "../utils/config";


const UserProfile = () => {

  const navigation = useNavigation();
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.register.user);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const { AadharDetail } = useSelector((state) => state.aadhar);

  const aStatus = user?.aadharKycStatus;
  const pStatus = user?.panKycStatus;
  const allVerified = aStatus === 'verified' && pStatus === 'verified';

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    userImg: "",
    userEmail: "",
    userAddress: "",
    userCity: "",
    userState: "",
  });

  useEffect(() => {
    dispatch(userData());
  }, [dispatch]);

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const handleEditProfile = () => {
    navigation.navigate('UserInformation');
  };

  const callNumber = (number) => {
    if (!number) return;
    const tel = `tel:${number}`;
    Linking.openURL(tel).catch((err) => console.warn('Unable to call', err));
  };


  useEffect(() => {
    console.log(`${BASE_URL}/${user?.user?.profile}`);
    if (user?.user && !isInitialized) {
      setFormData({
        userName: user.user.fullname || "",
        // userImg: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80',

        userImg: user?.user?.profile
          ? correctPath(
            `${BASE_URL}/${user?.user?.profile}`
          )
          : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80",

        userEmail: user.user.Email || "",
        userAddress: user.user.address || "",
        userCity: user.user.city || "",
        userState: user.user.state || "",
      });
      setIsInitialized(true);
    }

    // if (user?.user?.introducer_id) {
    //   handleReferralCode(user.user.introducer_id);
    // }
    setLoading(false);
  }, [user, isInitialized]);

  const confirmLogout = async () => {
    try {
       await AsyncStorage.removeItem("fingerPrintStatus");
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      await AsyncStorage.removeItem('fcm_registered_map');
      
      await AsyncStorage.clear();
      setLogoutModalVisible(false);

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Register" }],
        })
      );

    } catch (error) {
      console.error("Logout error:", error);
    }
  };




  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const openExternal = async (url) => {
    // prefer https (iOS may block http)
    const safeUrl = url?.replace(/^http:\/\//i, "https://");

    try {
      const supported = await Linking.canOpenURL(safeUrl);
      if (!supported) throw new Error("Unsupported URL");
      await Linking.openURL(safeUrl);
    } catch (err) {
      Alert.alert("Unable to open link", safeUrl || "No URL provided");
    } finally {
      // if this is in your Social modal:
      // closeModal?.("social");
    }
  };

  const menuItems = [
    {
      label: "Personal Information",
      icon: "person-outline",
      color: "#4CAF50",
      onPress: () => navigation.navigate("UserInformation"),
    },
    {
      label: "Aadhaar Details",
      icon: "card-outline",
      color: "#2196F3",
      onPress: () => navigation.navigate("AadhaarDetailsWb"),
    },
    {
      label: "PAN Card",
      icon: "document-text-outline",
      color: "#9C27B0",
      onPress: () => navigation.navigate("PanDetailsWb"),
    },
    {
      label: "Invite Friends",
      icon: "person-add-outline",
      color: "#FF9800",
      onPress: () => navigation.navigate("ReferralScreen"),
    },

    {
      label: "Support",
      icon: "logo-whatsapp",
      color: "#4CAF50",
      onPress: () => openExternal("https://wa.me/918130760448?text=Hello"),
    },

    {
      label: "Log out",
      icon: "log-out-outline",
      color: "#F44336",
      onPress: handleLogoutPress,
    },
  ];
  function correctPath(url) {
    return url.replace(/\\/g, "/");
  }



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Theme.colors.primary}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
          </View>

          <View style={styles.profileSection}>
            {AadharDetail?.aadhar_details ? (
              <Image
                source={AadharDetail?.aadhar_details ? { uri: `data:image/jpeg;base64,${AadharDetail?.aadhar_details?.photo}` } : require("../assets/Profilee.png")}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {getInitials(AadharDetail?.aadhar_details?.name)}
                </Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <View style={styles.profileTop}>
                <Text style={styles.profileName} numberOfLines={1}>{AadharDetail?.aadhar_details?.name || 'User'}</Text>
                {allVerified ? (
                  <TouchableOpacity
                    style={styles.verifiedBadge}
                    onPress={() => navigation.navigate('AadhaarDetailsWb')}
                    activeOpacity={0.8}
                    accessibilityLabel="KYC complete"
                  >
                    <MaterialIcons name="verified-user" size={18} color={Theme.colors.success} />
                    <Text style={styles.verifiedText}>KYC Complete</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.kvcSummary}>
                    <Text style={styles.kvcSummaryText}>KYC: incomplete</Text>
                  </View>
                )}
              </View>
             
             
              
              {user?.user?.address ? (
                <View style={[styles.profileDetail, { maxWidth: '76%' }]}> 
                  <MaterialIcons name="location-on" size={16} color="#fff" style={styles.detailIcon} />
                  <Text style={styles.profileEmail} numberOfLines={1}>{user.user.address}</Text>
                </View>
              ) : null}
              
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Account Settings</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.lastMenuItem,
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Ionicons name={item.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#999"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version: {version}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBlurContainer} tint="dark">
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <MaterialIcons name="logout" size={40} color="#F44336" />
            </View>
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalText}>
              Are you sure you want to log out of your account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: Theme.colors.primary,
    paddingBottom: 30,
    paddingTop:10
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  profileImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  badgesRow: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  avatarText: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  profileTop: { flexDirection: 'column', alignItems: 'flex-start', width: '100%' },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    flexShrink: 1,
  },
  profileDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  profilePhone: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 30,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    marginLeft: 8,
  },
  menuCard: {
    borderRadius: 16,
    border: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  arrowIcon: {
    marginLeft: 8,
  },
  profileImageWrap: { position: 'relative', marginRight: 12 },
  editOverlay: { position: 'absolute', right: -2, bottom: -2, backgroundColor: Theme.colors.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
  statusPill: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 16, marginLeft: 6 },
  pillVerified: { backgroundColor: '#e6f4ea' },
  pillPending: { backgroundColor: '#fff8e6' },
  statusText: { fontSize: 12, color: '#333', fontWeight: '700' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kvcRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 6 },
  statusChip: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 20, marginRight: 8, backgroundColor: '#fff' },
  statusChipText: { marginLeft: 8, color: '#111', fontWeight: '700' },
  statusIcon: { opacity: 0.95 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.secondary, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 24 },
  verifiedText: { color: Theme.colors.primary, fontWeight: '700', marginLeft: 8 },
  kvcSummary: { backgroundColor: 'rgba(255,255,255,0.08)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  kvcSummaryText: { color: '#fff', fontWeight: '700' },
  completeKycBtn: { marginTop: 12, backgroundColor: Theme.colors.primary, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignSelf: 'flex-start' },
  completeKycText: { color: Theme.colors.HeaderTint, fontWeight: '700' },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
  modalBlurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: "#F44336",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UserProfile;
