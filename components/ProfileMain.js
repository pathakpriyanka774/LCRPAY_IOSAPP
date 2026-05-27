// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   TouchableWithoutFeedback,
//   Modal,
//   StatusBar,
//   ScrollView,
//   Animated,
// } from "react-native";
// import { MaterialIcons, Ionicons } from "@expo/vector-icons";
// import { version } from '../package.json';
// import Theme from "./Theme";
// import { useDispatch, useSelector } from "react-redux";
// import { logOut } from "../src/features/userRegister/RegisterSlice";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { CommonActions, useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get("window");

// const ProfileMain = ({ closeDrawer }) => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const [logoutModalVisible, setLogoutModalVisible] = useState(false);
//   const [slideAnim] = useState(new Animated.Value(-width * 0.8));
//   const [fadeAnim] = useState(new Animated.Value(0));

//   const confirmLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("fingerPrintStatus");
//       await AsyncStorage.removeItem("access_token");
//       setLogoutModalVisible(false);

//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{ name: "Register" }],
//         })
//       );

//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };
//   // Animate drawer entry
//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   const handleCloseDrawer = () => {
//     Animated.parallel([
//       Animated.timing(slideAnim, {
//         toValue: -width * 0.8,
//         duration: 250,
//         useNativeDriver: true,
//       }),
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 250,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       closeDrawer();
//     });
//   };

//   const handleLogoutPress = () => {
//     setLogoutModalVisible(true);
//   };






//   const user = useSelector((state) => state.register.user);
//   const userInitial = user?.user?.MobileNumber
//     ? user.user.MobileNumber.charAt(0).toUpperCase()
//     : "U";

//   const menuItems = [
//     {
//       id: 1,
//       title: "My Account",
//       icon: "person",
//       screen: "UserProfile",
//       color: "#4CAF50",
//     },
//     {
//       id: 2,
//       title: "Settings",
//       icon: "settings",
//       screen: "SettingScreen",
//       color: "#2196F3",
//     },
//     {
//       id: 3,
//       title: "Search Transaction",
//       icon: "settings",
//       screen: "SearchTransactionScreen",
//       color: "#f75f07ff",
//     },
//     {
//       id: 4,
//       title: "File Complaint",
//       icon: "settings",
//       screen: "FileComplaint",
//       color: "#f75f07ff",
//     },
//     {
//       id: 5,
//       title: "Complaint Tracking",
//       icon: "receipt-long",
//       screen: "ComplaintTrackingScreen",
//       color: "#9C27B0",
//     },
//     {
//       id: 6,
//       title: "Payment History",
//       icon: "receipt-long",
//       screen: "History",
//       color: "#9C27B0",
//     },
//     {
//       id: 7,
//       title: "Privacy & Policy",
//       icon: "privacy-tip",
//       screen: "PrivacyAndPolicy",
//       color: "#FF9800",
//     },
//     {
//       id: 8,
//       title: "Terms & Conditions",
//       icon: "description",
//       screen: "TermsAndConditions",
//       color: "#795548",
//     },
//     {
//       id: 9,
//       title: "About Us",
//       icon: "info",
//       screen: "AboutUs",
//       color: "#607D8B",
//     },
//     {
//       id: 10,
//       title: "Contact Us",
//       icon: "contact-support",
//       screen: "ContactUs",
//       color: "#673AB7",
//     },
//   ];

//   function correctPath(url) {
//     return url.replace(/\\/g, "/");
//   }


//   const { AadharDetail, loading } = useSelector((state) => state.aadhar);

//   console.log(AadharDetail)
//   return (
//     <TouchableWithoutFeedback onPress={handleCloseDrawer}>
//       <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
//         <StatusBar barStyle="light-content" />
//         <Animated.View
//           style={[
//             styles.drawerContainer,
//             { transform: [{ translateX: slideAnim }] },
//           ]}
//         >
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={handleCloseDrawer}
//             activeOpacity={0.7}
//           >
//             <MaterialIcons name="arrow-back" size={24} color="#fff" />
//           </TouchableOpacity>

//           <View style={styles.profileSection}>
//             <View style={styles.profileHeader}>
//               <Image

//                 source={AadharDetail?.aadhar_details ? { uri: `data:image/jpeg;base64,${AadharDetail?.aadhar_details?.photo}` } : require("../assets/Profilee.png")}
//                 style={styles.avatarContainer}
//               />
//               <View style={styles.profileInfo}>
//                 <Text style={styles.profileName} numberOfLines={1}>
//                   {AadharDetail ? AadharDetail?.aadhar_details?.name : user?.user?.fullname}
//                 </Text>
//                 <Text style={styles.profilePhone} numberOfLines={1}>
//                   {user?.user?.MobileNumber || "Not available"}
//                 </Text>
//               </View>
//             </View>
//             {/* upi://pay?pa=9919701660@ptsbi&pn=AbhishekKumar                     upi://pay?pa=${user?.user?.MobileNumber}@ptsbi&pn=${user?.user?.fullname} */}
//             <View style={styles.qrCodeContainer}>
//               <Image
//                 source={{
//                   uri: `https://quickchart.io/qr?size=20&text=${user?.user?.MobileNumber}`,
//                 }}
//                 style={styles.qrCode}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           <ScrollView
//             style={styles.menuScrollView}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.menuContainer}>
//               {menuItems.map((item, index) => (
//                 <MenuItem
//                   key={item.id}
//                   title={item.title}
//                   icon={item.icon}
//                   color={item.color}
//                   onPress={() => navigation.navigate(item.screen)}
//                   backgroundColor={index % 2 === 0 ? "#ffffff" : "#f9f9f9"} // Zebra effect
//                 />
//               ))}


//               <MenuItem
//                 title="Log out"
//                 icon="logout"
//                 color="#F44336"
//                 onPress={handleLogoutPress}
//                 isLogout
//               />
//             </View>
//           </ScrollView>

//           <View style={styles.versionContainer}>

//             <Text style={styles.versionText}>Version: {version}</Text>


//           </View>

//           {/* Logout Confirmation Modal */}
//           <Modal
//             animationType="fade"
//             transparent={true}
//             visible={logoutModalVisible}
//             onRequestClose={() => setLogoutModalVisible(false)}
//           >
//             <View intensity={80} style={styles.modalBlurContainer} tint="dark">
//               <View style={styles.modalContent}>
//                 <View style={styles.modalIconContainer}>
//                   <MaterialIcons name="logout" size={40} color="#F44336" />
//                 </View>
//                 <Text style={styles.modalTitle}>Log Out</Text>
//                 <Text style={styles.modalText}>
//                   Are you sure you want to log out of your account?
//                 </Text>
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.cancelButton]}
//                     onPress={() => setLogoutModalVisible(false)}
//                     activeOpacity={0.7}
//                   >
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.modalButton, styles.confirmButton]}
//                     onPress={confirmLogout}
//                     activeOpacity={0.7}
//                   >
//                     <Text style={styles.confirmButtonText}>Log Out</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           </Modal>
//         </Animated.View>
//       </Animated.View>
//     </TouchableWithoutFeedback>
//   );
// };

// const MenuItem = ({ title, icon, color, onPress, isLogout, backgroundColor }) => (
//   <TouchableOpacity
//     style={[
//       styles.menuItem,
//       { backgroundColor: backgroundColor || "#fff" }, // Apply zebra background
//       isLogout && styles.logoutMenuItem
//     ]}
//     onPress={onPress}
//     activeOpacity={0.7}
//   >
//     <View style={[styles.menuIconContainer, { backgroundColor: color }]}>
//       <MaterialIcons name={icon} size={22} color="#fff" />
//     </View>
//     <Text style={[styles.menuText, isLogout && styles.logoutText]}>
//       {title}
//     </Text>
//     <MaterialIcons
//       name="chevron-right"
//       size={22}
//       color={isLogout ? "#F44336" : "#757575"}
//     />
//   </TouchableOpacity>
// );


// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     zIndex: 100,
//   },
//   drawerContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: width * 0.8,
//     height: "100%",
//     backgroundColor: Theme.colors.primary,
//     zIndex: 999,
//   },
//   closeButton: {
//     position: "absolute",
//     top: 16,
//     left: 16,
//     zIndex: 1000,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   profileSection: {
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     backgroundColor: Theme.colors.primary,
//   },
//   profileHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   avatarContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   avatarText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: Theme.colors.primary,
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 4,
//   },
//   profilePhone: {
//     fontSize: 14,
//     color: "rgba(255, 255, 255, 0.8)",
//   },
//   qrCodeContainer: {
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     // padding: 2,
//     marginTop: 10,
//   },
//   qrCode: {
//     width: "100%",
//     height: 220,
//     marginBottom: 8,
//   },
//   // scanText: {
//   //   fontSize: 14,
//   //   color: "#555",
//   //   fontWeight: "500",
//   // },
//   menuScrollView: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   menuContainer: {
//     paddingVertical: 12,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   logoutMenuItem: {
//     marginTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//     borderBottomWidth: 0,
//   },
//   menuIconContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   menuText: {
//     flex: 1,
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//   },
//   logoutText: {
//     color: "#F44336",
//     fontWeight: "600",
//   },
//   versionContainer: {
//     padding: 16,
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   versionText: {
//     fontSize: 12,
//     color: "#999",
//   },
//   modalBlurContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "85%",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 24,
//     alignItems: "center",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   modalIconContainer: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "rgba(244, 67, 54, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 12,
//   },
//   modalText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   modalButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   modalButton: {
//     flex: 1,
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#f5f5f5",
//     marginRight: 8,
//   },
//   confirmButton: {
//     backgroundColor: "#F44336",
//     marginLeft: 8,
//   },
//   cancelButtonText: {
//     color: "#333",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   confirmButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default ProfileMain;




import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { version } from '../package.json';
// import Theme from "./Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";

// Inline theme to avoid import issues
const Theme = {
  colors: {
    primary: "#5F259F",
    navbar_color: "#3b1458",
    secondary: "#fff",
    success: "#006400",
    danger: "#dc3545",
    HeaderTint: "white",
    bg: "#3b1458",
    text: "#0F172A",
    subtext: "#6B7280",
    goldenYellow: "#DAA520",
    white: "#FFFFFF",
    borderLight: "rgba(15, 23, 42, 0.08)",
  },
};

const { width, height } = Dimensions.get("window");

const ProfileMain = ({ closeDrawer }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));
  const [fadeAnim] = useState(new Animated.Value(0));

  const confirmLogout = async () => {
    try {
      await AsyncStorage.removeItem("fingerPrintStatus");
      await AsyncStorage.removeItem("access_token");
      await AsyncStorage.removeItem("refresh_token");
      await AsyncStorage.removeItem('fcm_registered_map');
      await AsyncStorage.clear();
      setLogoutModalVisible(false);
      
      navigation.reset({
        index: 0,
        routes: [{ name: "Register" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCloseDrawer = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      closeDrawer();
    });
  };

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const user = useSelector((state) => state.register.user);
  const { AadharDetail, loading } = useSelector((state) => state.aadhar);

  const menuItems = [
    {
      id: 1,
      title: "My Account",
      icon: "person",
      screen: "UserProfile",
    },
    {
      id: 2,
      title: "Settings",
      icon: "settings",
      screen: "SettingScreen",
    },
    {
      id: 3,
      title: "Search Transaction",
      icon: "search",
      screen: "SearchTransactionScreen",
    },
    {
      id: 4,
      title: "File Complaint",
      icon: "report-problem",
      screen: "FileComplaint",
    },
    {
      id: 5,
      title: "Complaint Tracking",
      icon: "track-changes",
      screen: "ComplaintTrackingScreen",
    },
    {
      id: 6,
      title: "Payment History",
      icon: "receipt-long",
      screen: "History",
    },
    {
      id: 7,
      title: "Privacy & Policy",
      icon: "privacy-tip",
      screen: "PrivacyAndPolicy",
    },
    {
      id: 8,
      title: "Terms & Conditions",
      icon: "description",
      screen: "TermsAndConditions",
    },
    {
      id: 9,
      title: "About Us",
      icon: "info",
      screen: "AboutUs",
    },
    {
      id: 10,
      title: "Contact Us",
      icon: "contact-support",
      screen: "ContactUs",
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={handleCloseDrawer}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <StatusBar barStyle="light-content" />
        <Animated.View
          style={[
            styles.drawerContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseDrawer}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.profileSection}>
            {/* Background Blobs */}
            <View style={styles.backgroundDecor}>
              <View style={[styles.blob, styles.blob1]} />
              <View style={[styles.blob, styles.blob2]} />
            </View>

            <View style={styles.profileHeader}>
              <View style={styles.profileImageWrapper}>
                <Image
                  source={
                    AadharDetail?.aadhar_details
                      ? { uri: `data:image/jpeg;base64,${AadharDetail?.aadhar_details?.photo}` }
                      : require("../assets/Profilee.png")
                  }
                  style={styles.avatarContainer}
                />
              </View>
              <View style={styles.profileInfo}>
  <Text style={styles.profileName} numberOfLines={1}>
    {AadharDetail ? AadharDetail?.aadhar_details?.name : user?.user?.fullname}
  </Text>
  <Text style={[styles.profilePhone, { marginTop: -6 }]} numberOfLines={1}>
    {user?.user?.MobileNumber || "Not available"}
  </Text>
</View>
            </View>
          </View>

          <ScrollView 
            style={styles.menuScrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.menuContainer}>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={item.id}
                  title={item.title}
                  icon={item.icon}
                  onPress={() => navigation.navigate(item.screen)}
                />
              ))}

              <MenuItem
                title="Log out"
                icon="logout"
                onPress={handleLogoutPress}
                isLogout
              />
            </View>
          </ScrollView>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version {version}</Text>
          </View>

          {/* Logout Confirmation Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={() => setLogoutModalVisible(false)}
          >
            <View style={styles.modalBlurContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalIconContainer}>
                  <MaterialIcons name="logout" size={48} color="#F44336" />
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
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const MenuItem = ({ title, icon, onPress, isLogout }) => (
  <TouchableOpacity
    style={[styles.menuItem, isLogout && styles.logoutMenuItem]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIconContainer, isLogout && styles.logoutIconContainer]}>
      <MaterialIcons name={icon} size={18} color={isLogout ? "#F44336" : "#5F259F"} />
    </View>
    <Text style={[styles.menuText, isLogout && styles.logoutText]}>
      {title}
    </Text>
    <MaterialIcons
      name="chevron-right"
      size={18}
      color={isLogout ? "#F44336" : "#5F259F"}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
  drawerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.8,
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 999,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileSection: {
    paddingTop: 70,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: "#5F259F",
    position: 'relative',
    overflow: 'hidden',
    
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  blob1: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#fff',
    top: -width * 0.25,
    right: -width * 0.15,
  },
  blob2: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#fff',
    bottom: -width * 0.15,
    left: -width * 0.1,
  },
  profileHeader: {
    alignItems: "center",
    zIndex: 1,
  },
  profileImageWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    textAlign: 'center',
  },
  profilePhone: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textAlign: 'center',
  },
  menuScrollView: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  menuContainer: {
    paddingVertical: 8,
    paddingTop: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  logoutMenuItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutIconContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  logoutText: {
    color: "#F44336",
    fontWeight: "600",
  },
  versionContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  versionText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  modalBlurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#F44336",
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

export default ProfileMain;
