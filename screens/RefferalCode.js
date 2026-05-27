// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Theme from '../components/Theme';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ReferralCode = () => {
//   const [referralCode, setReferralCode] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [validating, setValidating] = useState(false);
//   const [referrer, setReferrer] = useState(null);
//   const navigation = useNavigation();

//   // Validate referral code format (HBA + 8 digits)
//   const validateReferralFormat = (code) => {
//     const regex = /^HBA\d{8}$/;
//     return regex.test(code);
//   };

//   const handleValidateReferral = async () => {
//     if (!referralCode.trim()) {
//       setErrorMessage('Please enter a referral code');
//       return;
//     }

//     if (!validateReferralFormat(referralCode.trim())) {
//       setErrorMessage('Referral code must be HBA followed by 8 digits (e.g., HBA70349539)');
//       return;
//     }

//     setValidating(true);
//     setErrorMessage('');
//     setReferrer(null);

//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await axios.get(
//         `http://192.168.1.6:8001/validate-referral?member_id=${referralCode.trim()}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status === 1) {
//         setReferrer({
//           mobileNumber: response.data.user.MobileNumber,
//           memberId: response.data.user.member_id,
//         });
//       } else {
//         setErrorMessage(response.data.detail || 'Invalid referral code');
//       }
//     } catch (error) {
//       console.error('Validation error:', error);
//       setErrorMessage(error.response?.data?.detail || 'Failed to validate referral code');
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handleReferralCode = async (sendData) => {
//     if (sendData === 1 && !referrer) {
//       setErrorMessage('Please validate the referral code first');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');

//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await axios.post(
//         'http://192.168.1.6:8000/register/refrel/',
//         { introducer_data: sendData === 1 ? referralCode.trim() : '', type: sendData },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status === 1) {
//         await AsyncStorage.setItem('userLogged', 'true');
//         navigation.navigate('HomeScreen');
//       } else {
//         setErrorMessage(response.data.message || 'Something went wrong');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       setErrorMessage(error.response?.data?.detail || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Enter Referral Code</Text>
//       <Text style={styles.subtitle}>Ask your referrer for their Member ID (e.g., LCR00000000)</Text>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your Referral Code"
//           placeholderTextColor="#888"
//           value={referralCode}
//           onChangeText={(text) => {
//             setReferralCode(text.toUpperCase());
//             setErrorMessage('');
//             setReferrer(null);
//           }}
//           editable={!loading}
//           autoCapitalize="characters"
//           maxLength={11}
//         />
//         {referralCode.trim() && (
//           <TouchableOpacity
//             style={[styles.validateButton, validating && styles.disabledButton]}
//             onPress={handleValidateReferral}
//             disabled={validating || loading}
//           >
//             {validating ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.validateButtonText}>Validate</Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

//       {referrer && (
//         <View style={styles.referrerInfo}>
//           <Text style={styles.referrerText}>Referrer Verified:</Text>
//           <Text style={styles.referrerDetail}>Referral Code: {referrer.memberId}</Text>
//           <Text style={styles.referrerDetail}>Mobile: {referrer.mobileNumber}</Text>
//         </View>
//       )}

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.skipButton, loading && styles.disabledButton]}
//           onPress={() => handleReferralCode(0)}
//           disabled={loading}
//         >
//           <Text style={styles.skipText}>Skip</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, (!referrer || loading) && styles.disabledButton]}
//           onPress={() => handleReferralCode(1)}
//           disabled={!referrer || loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Continue</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: Theme.colors.secondary,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: Theme.colors.text,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Theme.colors.primary,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     height: 50,
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//   },
//   validateButton: {
//     backgroundColor: Theme.colors.primary,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   validateButtonText: {
//     color: Theme.colors.secondary,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 14,
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   referrerInfo: {
//     backgroundColor: '#f8f8f8',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   referrerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   referrerDetail: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 2,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   skipButton: {
//     flex: 1,
//     backgroundColor: Theme.colors.secondary,
//     padding: 12,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Theme.colors.primary,
//     marginRight: 10,
//   },
//   skipText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Theme.colors.primary,
//   },
//   button: {
//     flex: 1,
//     backgroundColor: Theme.colors.primary,
//     padding: 12,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: Theme.colors.secondary,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default ReferralCode;

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Theme from '../components/Theme';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ReferralCode = () => {
//   const [referralCode, setReferralCode] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [validating, setValidating] = useState(false);
//   const [referrer, setReferrer] = useState(null);
//   const navigation = useNavigation();

//   // Validate referral code format (LCR + 8 digits)
//   const validateReferralFormat = (code) => {
//     const regex = /^LCR\d{8}$/;
//     return regex.test(code);
//   };

//   const handleValidateReferral = async () => {
//     if (!referralCode.trim()) {
//       setErrorMessage('Please enter a referral code');
//       return;
//     }

//     if (!validateReferralFormat(referralCode.trim())) {
//       setErrorMessage('Referral code must be LCR followed by 8 digits (e.g., LCR00000001)');
//       return;
//     }

//     setValidating(true);
//     setErrorMessage('');
//     setReferrer(null);

//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await axios.get(
//         `http://192.168.1.8:8001/validate-referral?member_id=${referralCode.trim()}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status === 1) {
//         setReferrer({
//           mobileNumber: response.data.user.MobileNumber,
//           memberId: response.data.user.member_id,
//         });
//       } else {
//         setErrorMessage(response.data.detail || 'Invalid referral code');
//       }
//     } catch (error) {
//       console.error('Validation error:', error);
//       setErrorMessage(error.response?.data?.detail || 'Failed to validate referral code');
//     } finally {
//       setValidating(false);
//     }
//   };

//   const handleReferralCode = async (sendData) => {
//     if (sendData === 1 && !referrer) {
//       setErrorMessage('Please validate the referral code first');
//       return;
//     }

//     setLoading(true);
//     setErrorMessage('');

//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (!token) {
//         throw new Error('Authentication token not found');
//       }

//       const response = await axios.post(
//         'http://192.168.1.8:8000/register/refrel/',
//         { introducer_data: sendData === 1 ? referralCode.trim() : '', type: sendData },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status === 1) {
//         await AsyncStorage.setItem('userLogged', 'true');
//         navigation.navigate('HomeScreen');
//       } else {
//         setErrorMessage(response.data.message || 'Something went wrong');
//       }
//     } catch (error) {
//       console.error('Submission error:', error);
//       setErrorMessage(error.response?.data?.detail || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Enter Referral Code</Text>
//       <Text style={styles.subtitle}>Ask your referrer for their Member ID (e.g., LCR00000001)</Text>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter your Referral Code"
//           placeholderTextColor="#888"
//           value={referralCode}
//           onChangeText={(text) => {
//             setReferralCode(text.toUpperCase());
//             setErrorMessage('');
//             setReferrer(null);
//           }}
//           editable={!loading}
//           autoCapitalize="characters"
//           maxLength={11}
//         />
//         {referralCode.trim() && (
//           <TouchableOpacity
//             style={[styles.validateButton, validating && styles.disabledButton]}
//             onPress={handleValidateReferral}
//             disabled={validating || loading}
//           >
//             {validating ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.validateButtonText}>Validate</Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>

//       {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

//       {referrer && (
//         <View style={styles.referrerInfo}>
//           <Text style={styles.referrerText}>Referrer Verified:</Text>
//           <Text style={styles.referrerDetail}>Referral Code: {referrer.memberId}</Text>
//           <Text style={styles.referrerDetail}>Mobile: {referrer.mobileNumber}</Text>
//         </View>
//       )}

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.skipButton, loading && styles.disabledButton]}
//           onPress={() => handleReferralCode(0)}
//           disabled={loading}
//         >
//           <Text style={styles.skipText}>Skip</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, (!referrer || loading) && styles.disabledButton]}
//           onPress={() => handleReferralCode(1)}
//           disabled={!referrer || loading}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Continue</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: Theme.colors.secondary,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: Theme.colors.text,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 15,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Theme.colors.primary,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     height: 50,
//     marginBottom: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 16,
//     color: '#000',
//   },
//   validateButton: {
//     backgroundColor: Theme.colors.primary,
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   validateButtonText: {
//     color: Theme.colors.secondary,
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 14,
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   referrerInfo: {
//     backgroundColor: '#f8f8f8',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   referrerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   referrerDetail: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 2,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   skipButton: {
//     flex: 1,
//     backgroundColor: Theme.colors.secondary,
//     padding: 12,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: Theme.colors.primary,
//     marginRight: 10,
//   },
//   skipText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Theme.colors.primary,
//   },
//   button: {
//     flex: 1,
//     backgroundColor: Theme.colors.primary,
//     padding: 12,
//     borderRadius: 5,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: Theme.colors.secondary,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   disabledButton: {
//     opacity: 0.6,
//   },
// });

// export default ReferralCode;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Theme from "../components/Theme";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../zustand/Store";
import { BASE_URL } from "../utils/config";

const ReferralCode = () => {
  const [referralCode, setReferralCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [referrer, setReferrer] = useState(null);
  const navigation = useNavigation();
  const { setScratchCards } = useAppStore();

  // Validate referral code format (LCR + 8 digits)
  const validateReferralFormat = (code) => {
    const regex = /^LCR\d{8}$/;
    return regex.test(code);
  };

  const handleValidateReferral = async () => {
    if (!referralCode.trim()) {
      setErrorMessage("Please enter a referral code");
      return;
    }

    if (!validateReferralFormat(referralCode.trim())) {
      setErrorMessage(
        "Referral code must be LCR followed by 8 digits (e.g., LCR00000001)"
      );
      return;
    }

    setValidating(true);
    setErrorMessage("");
    setReferrer(null);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(
        `${BASE_URL}/referral/validate-referral?member_id=${referralCode.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 1) {
        setReferrer({
          mobileNumber: response.data.user.MobileNumber,
          memberId: response.data.user.member_id,
        });
      } else {
        setErrorMessage(response.data.detail || "Invalid referral code");
      }
    } catch (error) {
      console.error("Validation error:", error);
      setErrorMessage(
        error.response?.data?.detail || "Failed to validate referral code"
      );
    } finally {
      setValidating(false);
    }
  };
//Below code comment by --priyanka
  // const handleReferralCode = async (sendData) => {
  //   if (sendData === 1 && !referrer) {
  //     setErrorMessage("Please validate the referral code first");
  //     return;
  //   }

  //   setLoading(true);
  //   setErrorMessage("");

  //   try {
  //     const token = await AsyncStorage.getItem("access_token");
  //     if (!token) {
  //       throw new Error("Authentication token not found");
  //     }

  //     const headers = {
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       Authorization: `Bearer ${token}`,
  //     };

  //     console.log(sendData===1 ? referralCode : "")
  //     // Step 1: Register the referral relationship
  //     const response = await axios.post(
  //       "http://192.168.1.4:59700/register/set-referral/",
  //       {
  //        "refererID": sendData === 1 ? referralCode : "LCR96201633"
  //       },
  //       { headers }
  //     );

  //     console.log(response.data)

  //     if (response.data.status !== 1) {
  //       throw new Error(response.data.message || "Failed to register referral");
  //     }
  // Above code Comented by --priyanka

      // Get the new user's member_id and introducer_id
      // const userId = response.data.user?.member_id;
      // if (!userId) {
      //   throw new Error("User registration failed - no member_id returned");
      // }

      // const introducerId =
      //   sendData === 1
      //     ? response.data.introducer_id || referrer?.memberId
      //     : "LCR00000001";

      // Step 2: Distribute LCR coins
      // const distributeRes = await axios.get(
      //   `https://bbpslcrapi.lcrpay.com/referral/distribute-lcr?userid=${userId}&package=0`,
      //   { headers }
      // );

      // if (
      //   distributeRes.status !== 200 ||
      //   distributeRes.data?.status !== "success"
      // ) {
      //   throw new Error("Failed to distribute LCR coins");
      // }

      // console.log("LCR Distribution Response:", distributeRes.data.message);

      // // Step 3: Fetch scratch cards for the new user
      // const scratchRes = await axios.get(
      //   `https://bbpslcrapi.lcrpay.com/referral/scratch-cards?userid=${userId}`,
      //   { headers }
      // );

      // const mappedScratchCards =
      //   scratchRes.status === 200 && Array.isArray(scratchRes.data?.data)
      //     ? scratchRes.data.data.map((item, index) => ({
      //         id: `scratch_${index}`,
      //         amount: item.amount || 0,
      //         receivedDate: item.receivedDate || new Date().toISOString(),
      //         IsScratched: item.IsScratched ?? false,
      //       }))
      //     : [];

      // setScratchCards(mappedScratchCards);

      // Step 4: If using a referrer, fetch their updated scratch cards
      // if (sendData === 1 && introducerId) {
      //   try {
      //     const referrerScratchRes = await axios.get(
      //       `https://bbpslcrapi.lcrpay.com/referral/scratch-cards?userid=${introducerId}`,
      //       { headers }
      //     );
      //     console.log("Referrer Scratch Cards:", referrerScratchRes.data?.data);
      //   } catch (err) {
      //     console.error("Error fetching referrer scratch cards:", err);
      //   }
      // }

      // Step 5: Complete registration process
      // await AsyncStorage.setItem("userLogged", "true");
      // await AsyncStorage.setItem("userMemberId", userId);

      // Navigate to home with success message

// below code uncommented and fixed by --priyanka
    //   navigation.navigate("HomeScreen", {
    //     showWelcome: true,
    //     lcrReceived: 100,
    //   });
    // } catch (error) {

    //   if (axios.isAxiosError(error)) {
    //     console.error(
    //       "Axios Error:",
    //       error.response?.status,
    //       error.response?.data
    //     );

    //     if (error.response?.status === 404) {
    //       Alert.alert("Error", "Requested resource not found (404)");
    //     }
    //   } else {
    //     console.error("Unexpected Error:", error);
    //     Alert.alert("Error", "Something went wrong!");
    //   }

      
    //   console.error("Referral submission error:", error);
// above code commented by --priyanka


// Fixed Skip and refferal submission flow-- Priyanka 
      const handleReferralCode = async (sendData) => {

  // ✅ SKIP FLOW — NO API CALL
  if (sendData === 0) {
    navigation.navigate("HomeScreen", {
      showWelcome: true,
      lcrReceived: 0,
    });
    return;
  }

  // ❌ Referral flow validation
  if (sendData === 1 && !referrer) {
    setErrorMessage("Please validate the referral code first");
    return;
  }

  setLoading(true);
  setErrorMessage("");

  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    // ✅ ONLY called when referral is submitted
    const response = await axios.post(
      //  "http://192.168.1.3:59700/register/set-referral/",
      `${BASE_URL}/register/set-referral/`,
      {
        refererID: referralCode,
      },
      { headers }
    );

    if (response.data.status !== 1) {
      throw new Error(response.data.message || "Failed to register referral");
    }

    navigation.navigate("HomeScreen", {
      showWelcome: true,
      lcrReceived: 100,
    });

  } catch (error) {
    console.error("Referral submission error:", error);

    if (axios.isAxiosError(error)) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to apply referral"
      );
    } else {
      Alert.alert("Error", "Something went wrong!");
      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "Network error - please check your connection";
      } else {
        // Other errors
        errorMessage = error.message || "Failed to process referral";
      }

      setErrorMessage(errorMessage);

      // Optionally show an alert for critical errors
      if (!error.response || error.response.status >= 500) {
        Alert.alert("Error", errorMessage);
      }
    }
  } finally {
    setLoading(false);
  }
};

// End of fix--Priyanka



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Referral Code</Text>
      <Text style={styles.subtitle}>
        Ask your referrer for their Member ID (e.g., LCR00000001)
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your Referral Code"
          placeholderTextColor="#888"
          value={referralCode}
          onChangeText={(text) => {
            setReferralCode(text.toUpperCase());
            setErrorMessage("");
            setReferrer(null);
          }}
          editable={!loading}
          autoCapitalize="characters"
          maxLength={11}
        />
        {referralCode.trim() && (
          <TouchableOpacity
            style={[styles.validateButton, validating && styles.disabledButton]}
            onPress={handleValidateReferral}
            disabled={validating || loading}
          >
            {validating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.validateButtonText}>Validate</Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {referrer && (
        <View style={styles.referrerInfo}>
          <Text style={styles.referrerText}>Referrer Verified:</Text>
          <Text style={styles.referrerDetail}>
            Referral Code: {referrer.memberId}
          </Text>
          <Text style={styles.referrerDetail}>
            Mobile: XX-XXXXX-{referrer.mobileNumber.slice(-4)}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.skipButton, loading && styles.disabledButton]}
          onPress={() => handleReferralCode(0)}
          disabled={loading}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            (!referrer || loading) && styles.disabledButton,
          ]}
          onPress={() => handleReferralCode(1)}
          disabled={!referrer || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Theme.colors.secondary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  validateButton: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  validateButtonText: {
    color: Theme.colors.secondary,
    fontSize: 14,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  referrerInfo: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  referrerText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  referrerDetail: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipButton: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    marginRight: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Theme.colors.primary,
  },
  button: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    padding: 12,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Theme.colors.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ReferralCode;
