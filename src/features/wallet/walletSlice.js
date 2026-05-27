import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CreditBalance, historyApi } from "./walletApi";

const initialState = {
  transactionHistory: [],
  transactionData: [],
  loading: false,
  error: null,
};

// Define async thunk to credit amount
export const creditAmount = createAsyncThunk(
  "wallet/creditAmount",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CreditBalance(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to credit amount");
    }
  }
);

export const history = createAsyncThunk(
  "wallet/history",
  async (_, { rejectWithValue }) => {
    try {
      const response = await historyApi();
      // console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch transaction history"
      );
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(creditAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(creditAmount.fulfilled, (state, action) => {
        state.loading = false;

        state.transactionData = action.payload;
      })
      .addCase(creditAmount.rejected, (state, action) => {
        state.loading = false;
        console.log(`bbbbb`, action);
        state.error = action.payload;
      })
      .addCase(history.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(history.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionHistory = action.payload;
      })
      .addCase(history.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default walletSlice.reducer;
