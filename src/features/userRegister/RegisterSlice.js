import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Alert } from "react-native";
import {
  changePassword,
  EmailGenerateOtp,
  EmailVerifyOtpApi,
  getUserInfo,
  handleLogout,
  handleRegister,
  handleVerifyOtp,
  setPassword,
  verifyPan,
} from "./UserRegister";

const initialState = {
  logout: false,
  user: [],
  updatePassword: [],
  Register: [],
  loading: false,
  otpSent: false,
  EmailData: [],
  setPassword: null,
  error: null,
};

// Define async thunk to fetch cities
export const userRegister = createAsyncThunk(
  "user/userRegister",
  async (data) => {
    try {
      const response = await handleRegister(data);

      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const userVerifyOtp = createAsyncThunk(
  "user/userVerifyOtp",
  async (data) => {
    try {
      const response = await handleVerifyOtp(data.phoneNumber, data.otp);
      console.log(response);
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const userPassword = createAsyncThunk(
  "user/userPassword",
  async (data) => {
    try {
      const response = await setPassword(data);
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const emailGenerateOtp = createAsyncThunk(
  "user/emailGenerateOtp",
  async (data) => {
    try {
      const response = EmailGenerateOtp(data);
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const emailVerifyOtp = createAsyncThunk(
  "user/emailVerifyOtp",
  async (data) => {
    try {
      const response = await EmailVerifyOtpApi(data);
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (data) => {
    const response = await someApiForResendOtp(data);
    return response;
  }
);


export const userData = createAsyncThunk("user/userData", async () => {
  try {
    const response = await getUserInfo();
    return response;
  } catch (error) {
    throw Error("Failed to fetch data");
  }
});

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (data) => {
    try {
      const response = await changePassword(data);
      return response;
    } catch (error) {
      throw Error("Failed to fetch data");
    }
  }
);

export const panData = createAsyncThunk(
  "/verifyPan",
  async (data) => {
    try {
      const response = await verifyPan(data);
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

export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { dispatch }) => {
    await handleLogout(); // Perform the async logout operation
    dispatch(logOutSuccess()); // Dispatch a regular action to update the state
  }
);

const RegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetOtpState: (state, action) => {
      state.otpSent = action.payload ?? false;
    },
    resetSetPassword: (state, action) => {
      state.setPassword = null;
    },
    resetUpdatePassword: (state, action) => {
      state.updatePassword = [];
    },
    logOutSuccess: (state) => {
      state.logout = true; // This is now a simple synchronous reducer
    },
  },
  extraReducers: (builder) => {
    builder
      // User Register
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.Register = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // User Verify OTP
      .addCase(userVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userVerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.Register = action.payload;
      })
      .addCase(userVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // user set password
      .addCase(userPassword.pending, (state) => {
        state.setPassword = "pending";
        state.loading = true;
        state.error = null;
      })
      .addCase(userPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.setPassword = "success";
      })
      .addCase(userPassword.rejected, (state, action) => {
        state.loading = false;
        state.setPassword = "rejected";
        state.error = action.payload;
      })

      .addCase(emailGenerateOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emailGenerateOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(emailGenerateOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(emailVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(emailVerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.EmailData = action.payload;
      })
      .addCase(emailVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(userData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(userData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.updatePassword = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
       .addCase(panData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(panData.fulfilled, (state, action) => {
        state.loading = false;
        state.updatePassword = action.payload;
      })
      .addCase(panData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Test API
      .addCase(testApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(testApi.fulfilled, (state) => {
        state.loading = false;
        
        state.otpSent = true;
      })
      .addCase(testApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetOtpState, resetSetPassword, resetUpdatePassword } =
  RegisterSlice.actions;
export default RegisterSlice.reducer;

// this is previous screen
