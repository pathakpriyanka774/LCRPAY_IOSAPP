import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";
import { CommonActions } from '@react-navigation/native'; // Make sure this is at the top

import { getIntegrityToken } from "../../../utils/integrity";
import { BASE_URL } from "../../../utils/config";


// Centralized API request function
const apiRequest = async (
  method,
  endpoint,
  data = null,
  requireAuth = false,
  sendAsBody = false
) => {
  try {



    const headers = {
      "Content-Type": "application/json",
    };

    if (endpoint.includes("/misc/send-otp") || endpoint.includes("/misc/verify-otp")) {
      const { token, nonce } = await getIntegrityToken();
      headers["X-Integrity-Token"] = token;
      headers["X-Integrity-Nonce"] = nonce;
    }

    // Include token in headers if required
    if (requireAuth) {
      const access_token = await AsyncStorage.getItem("access_token");
      if (access_token) {
        headers["Authorization"] = `Bearer ${access_token}`;
      }
    }

    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      headers,
      ...(sendAsBody ? { data } : { params: data }), // Send as body or params
    });

    // console.log(`${endpoint} Response:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios Error:",
        error.response?.status,
        error.response?.data
      );

      if (error.response?.status === 429) {
        Alert.alert("Too many Request");
      }

      if (error.response?.status === 404) {
        Alert.alert("Error", "Requested resource not found (404)");
      }
    } else {
      console.error("Unexpected Error:", error);
      Alert.alert("Error", "Something went wrong!");
    }
  }
};

// Register & Send OTP
export const handleRegister = async (mobileNumber) => {
  if (!mobileNumber) throw new Error("Mobile number is required");

  return apiRequest("post", `/misc/send-otp`, {
    mobile_number: mobileNumber.trim(),
  });
};

// Verify OTP
export const handleVerifyOtp = async (mobileNumber, otp) => {
  if (!mobileNumber || !otp)
    throw new Error("Mobile number and OTP are required");

  const data = await apiRequest("post", `/misc/verify-otp`, {
    otp: otp.trim(),
    mobile_number: mobileNumber.trim(),
  });

  // Store token if available
  if (data?.access_token) {
    await AsyncStorage.setItem("access_token", data.access_token);
  }

  return data;
};

// Set Password (Requires Token)
export const setPassword = async (data) => {
  if (!data.password && !data.fname)
    throw new Error("Password & Username is required");
  console.log(`${data.password}---${data.fname}`);
  console.log(data);

  return apiRequest("post", "/register/setPassword/", data, true, true);
};

// Email Generate OTP
export const EmailGenerateOtp = async (data) => {
  try {
    // const sessionId = await AsyncStorage.getItem('session_id'); // Retrieve session ID

    return apiRequest(
      "post",
      "/register/emailVerification/",
      { email: data },
      true
    );
  } catch (error) {
    console.error("Error in EmailGenerateOtp:", error);
  }
};

export const EmailVerifyOtpApi = (data) =>
  apiRequest("post", "/register/VerifyEmailOtp/", data, true, true);

//check_user
export const checkUser = async () => {
  const token = await AsyncStorage.getItem("access_token");
  return token ? true : false;
};

//getuserInfo
export const getUserInfo = async () => {
  return apiRequest("get", "/register/check_user", null, true, false);
};


export const changePassword = async (data) => {
  return apiRequest("post", "/register/change_password", data, true, true);
};

export const verifyPan = async (data) => {
  return apiRequest("post", "/verify-pan", data, true, true);
};

// Logout User
export const handleLogout = async () => {
  try {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Register" }],
      })
    );
  } catch (error) {
    console.error("Logout Error", error);
  }
};


// Get Token from Local Storage
export const getToken = async () => {
  return await AsyncStorage.getItem("access_token");
};

// this is previous screen
