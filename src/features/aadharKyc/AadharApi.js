import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../../utils/config';
import { getToken } from '../userRegister/UserRegister';

// Configure axios defaults for React Native
axios.defaults.timeout = 15000;
axios.defaults.headers.common['Accept'] = 'application/json';

// const BASE_URL = `http://192.168.1.5:8000`

// Generic API Request Function
// const apiRequest = async (method, endpoint, data = null) => {
//   try {
//     const access_token = await getToken(); // Retrieve access token
//     const session_id = await AsyncStorage.getItem("session_id"); // Retrieve session ID

//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${access_token}`, // Attach token
//       session_id: session_id || "", // Attach session_id if available
//     };

//     const response = await axios({
//       method,
//       url: `${BASE_URL}/${endpoint}`,
//       data,
//       headers,
//       withCredentials: true, // Ensure cookies are sent
//     });

//     return response.data;
//   } catch (error) {
//     console.error(
//       `Error in ${endpoint}:`,
//       error?.response?.data || error.message
//     );
//     throw error?.response?.data || { message: "Something went wrong" };
//   }
// };

const apiRequest = async (method, endpoint, data = null, retryCount = 0) => {
  try {
    const access_token = await getToken();
    const session_id = await AsyncStorage.getItem("session_id");
    console.log(`[apiRequest] Session ID: ${session_id}, Endpoint: ${endpoint}, Token: ${access_token ? 'Present' : 'Missing'}`);

    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${access_token}`,
       ...(session_id ? { Cookie: `session_id=${session_id}` } : {}),
    };

    console.log(`[apiRequest] Making request to: ${BASE_URL}/${endpoint}`);
    console.log(`[apiRequest] Headers:`, headers);

    // Try with fetch first as fallback
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log(`[apiRequest] Response for ${endpoint}:`, responseData);
    return responseData;
  } catch (error) {
    console.error(`Error in ${endpoint}:`, error?.response?.data || error.message);
    console.error(`Full error details:`, {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config?.url,
      code: error.code,
      errno: error.errno
    });
    
    // Retry logic for network errors
    if ((error.code === 'ERR_NETWORK' || error.message.includes('Network')) && retryCount < 2) {
      console.log(`Retrying request (${retryCount + 1}/2)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return apiRequest(method, endpoint, data, retryCount + 1);
    }
    
    // For network errors, try to provide more context
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('Network Error - Possible causes: SSL, CORS, or connectivity issues');
    }
    
    throw error?.response?.data || { message: error.message || "Something went wrong" };
  }
};

// AadharInfo API Call (Stores session_id in AsyncStorage)
// export const AadharInfo = async () => {
//   try {
//     const data = await apiRequest("get", "InitiateSession/");

//     // Store session_id in AsyncStorage
//     const sessionId = data?.session_id;
//     if (sessionId) {
//       await AsyncStorage.setItem("session_id", sessionId);
//     } else {
//       console.warn("Session ID not found in response");
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching Aadhaar info:", error);
//   }
// };

export const AadharInfo = async () => {
  try {
    const data = await apiRequest("get", "InitiateSession/");
    const sessionId = data?.session_id;
    if (sessionId) {
      await AsyncStorage.setItem("session_id", sessionId);
      console.log(`[AadharInfo] Session ID stored: ${sessionId}`); // Debug log'
    } else {
      console.warn("Session ID not found in response");
    }
    return data;
  } catch (error) {
    console.error("Error fetching Aadhaar info:", error);
    throw error;
  }
};

// AadharGenerateOtp API Call
export const AadharGenerateOtp = (data) =>
  apiRequest("post", "otp_generate/", data);

// AadharVerifyOtp API Call
export const AadharVerifyOtp = (data) =>
  apiRequest("post", "verify-otp/", data);

export const AadharDetail = () =>
  apiRequest("get", "userAadharDetail/", null, true);

export const PanDetail = () =>
  apiRequest("get", "getPanDetails/", null, true);

// PanVerify API Call
export const PanVerify = (data) => apiRequest("post", "verify-pan", data);
