import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    AadharDetail,
    AadharGenerateOtp,
    AadharInfo,
    AadharVerifyOtp,
    PanDetail,
    PanVerify,
} from "./AadharApi";

const initialState = {
  captchData: [],
  AadharData: [],
  AadharDetail: [],
  PanDetail: [],
  PanData: false,
  loading: false,
  otpSent: false,
  error: null,
};

// Define async thunk to fetch cities
export const adharKycInitiate = createAsyncThunk(
  "user/adharKycInitiate",
  async () => {
    try {
      const response = await AadharInfo();

      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const testApi = createAsyncThunk("user/testApi", async () => {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    const data = await response.json();

    return data;
  } catch (error) {
    throw Error("Failed to fetch data");
  }
});

export const genrateOtp = createAsyncThunk("user/genrateOtp", async (data) => {
  try {
    const response = await AadharGenerateOtp(data);

    return response;
  } catch (error) {
    throw Error("Failed to fetch data");
  }
});

export const getAadharDetail = createAsyncThunk(
  "user/getAadharDetail",
  async () => {
    try {
      const response = await AadharDetail();
      return response;
    } catch (error) {
      console.error("Error in getAadharDetail:", error);
      
      // Handle specific case where Aadhaar details are not found
      if (error?.message === "Aadhar details not found for this user.") {
        return { status: "not_found", message: error.message };
      }
      
      throw error?.response?.data || error?.message || "Failed to fetch Aadhaar details";
    }
  }
);

export const getPanData = createAsyncThunk(
  "user/getPanData",
  async () => {
    try {
      const response = await PanDetail();
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const verifyAadharOtp = createAsyncThunk(
  "user/verifyAadharOtp",
  async (data) => {
    try {
      const response = await AadharVerifyOtp(data);

      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const panVerification = createAsyncThunk(
  "user/panVerification",
  async (data) => {
    try {
      const response = await PanVerify(data);
      console.log("Pan verify response", response);
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

const AadharDataSlice = createSlice({
  name: "aadhar",
  initialState,
  reducers: {
    setOtpSent: (state, action) => {
      state.otpSent = action.payload ?? false;
      state.PanData = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Aadhar KYC
      .addCase(adharKycInitiate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adharKycInitiate.fulfilled, (state, action) => {
        state.loading = false;
        state.captchData = action.payload;
      })
      .addCase(adharKycInitiate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Generate OTP
      .addCase(genrateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(genrateOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(genrateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Verify OTP
      .addCase(verifyAadharOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyAadharOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.AadharData = action.payload;
        console.log("OTP verified", state.loading, state.otpSent);
        console.log("addhar Details which we get", action.payload);
      })
      .addCase(verifyAadharOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
        console.log("OTP rejected", state.loading, state);
      })

      // Pan Verification

      .addCase(panVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(panVerification.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = false;
        state.PanData = true;
      })
      .addCase(panVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "pan verification failed";
      })
      .addCase(getAadharDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAadharDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.AadharDetail = action.payload;
      })
      .addCase(getAadharDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch Aadhaar details";
        console.error("getAadharDetail rejected:", action.error);
      })
       .addCase(getPanData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPanData.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = false;
        state.PanDetail = action.payload;
      })
      .addCase(getPanData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Test API
      .addCase(testApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testApi.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.PanData = true;
        state.AadharData = { success: "success" };
      })
      .addCase(testApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
      });
  },
});

export const { setOtpSent } = AadharDataSlice.actions;
export default AadharDataSlice.reducer;
