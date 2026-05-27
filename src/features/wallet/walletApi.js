import { getToken } from '../userRegister/UserRegister';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, DEFAULT_HEADERS } from '../../../utils/config';

const apiRequest = async (method, endpoint, data, isMultipart = false) => {
  console.log("✅ Inside apiRequest...");
  console.log("Request Data:", data);

  try {
    const access_token = await getToken();
    const session_id = await AsyncStorage.getItem("session_id");

    console.log("✅ Retrieved Token:", access_token);
    console.log("✅ Retrieved Session ID:", session_id);

    const headers = {
      ...DEFAULT_HEADERS,
      Authorization: `Bearer ${access_token}`,
      session_id: session_id || "",
    };

    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    } else {
      headers["Content-Type"] = "application/json";
    }

    console.log("✅ Making API Request to:", `${BASE_URL}/${endpoint}`);

    const response = await axios({
      method,
      url: `${BASE_URL}/${endpoint}`,
      data,
      headers,
    });

    // console.log(`✅ ${endpoint} Response:`, response.data);
    return response.data;
  } catch (error) {
    // console.error(`🚨 Error in ${endpoint}:`, error?.response?.data || error.message);
    throw error?.response?.data || { message: "Something went wrong" };
  }
};

// export const CreditBalance = async (data) => {
//   console.log("✅ thisis request,,,,,,,,,,");

//   const formData = new FormData();

//   // Append form fields
//   formData.append('transaction_amount', data.transaction_amount);
//   formData.append('utr_no', data.utr_no);
//   formData.append('purpose', data.purpose);
//   formData.append('remark', data.remark);
//   formData.append('reference_id', data.reference_id);
//   formData.append('transaction_by', data.transaction_by);
//   formData.append('transaction_type', data.transaction_type);

//   // Append file (payment screenshot)
//   if (data.payment_screenshot && data.payment_screenshot.uri) {
//     console.log("✅ Image Found!");

//     const { uri } = data.payment_screenshot;
//     const match = /\.(\w+)$/.exec(uri);
//     const fileExtension = match ? match[1] : "jpg";
//     const mimeType = match ? `image/${fileExtension}` : "image/jpeg";

//     formData.append('payment_screenshot', {
//       uri: uri,
//       type: mimeType,
//       name: `payment_screenshot.${fileExtension}`,
//     });
//   } else {
//     console.log("🚨 No Image Found!");
//   }

//   // 🔍 Check if FormData is correctly created
//   console.log("🔍 FormData Contents:");
//   console.log(formData);

//   try {
//     const response = await apiRequest('post', 'transaction/credit/', formData, true);
//     console.log("✅ API Request Success:", response);
//     return response;
//   } catch (error) {
//     console.error("🚨 API Request Failed:", error);
//   }
// };

// 🔹 Function to fetch transaction history

export const CreditBalance = async (data) => {
  console.log("✅ Sending request...");
  console.log(data);

  const formData = new FormData();

  formData.append("transaction_amount", data.transaction_amount);
  formData.append("utr_no", data.utr_no);
  formData.append("remark", data.remark || "");

  if (data.payment_screenshot) {
    console.log("✅ Image Found!");

    const uri = data.payment_screenshot;
    const fileName = uri.split("/").pop();
    const fileType = fileName.split(".").pop();

    formData.append("payment_screenshot", {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    });
  } else {
    console.log("🚨 No Image Found!");
  }

  console.log("🔍 FormData:", formData);

  try {
    const response = await apiRequest(
      "post",
      "transaction/credit/",
      formData,
      true
    );
    return response;
  } catch (error) {
    console.error("🚨 API Request Failed:", error);
    throw error;
  }
};

export const historyApi = async () => {
  const data = await apiRequest("get", "transaction/history/");
  // console.log(data)
  return data;
};
