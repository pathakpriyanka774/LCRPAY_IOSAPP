import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { busChartApi, busDataApi } from "./busApi";

const initialState = {
  busAll: [],
  busSeat: [],
  loading: false,
  error: null,
};

// Define async thunk to fetch cities
export const busData = createAsyncThunk("city/busData", async (data) => {
  try {
    const response = await busDataApi(data);

    return response;
  } catch (error) {
    throw Error("Failed to fetch cities");
  }
});

export const busChart = createAsyncThunk("bus/busChart", async (data) => {
  try {
    const response = await busChartApi(data);

    return response;
  } catch (error) {
    throw Error("Failed to fetch cities");
  }
});
const busSlice = createSlice({
  name: "bus",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(busData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(busData.fulfilled, (state, action) => {
        state.loading = false;
        state.busAll = action.payload;
      })
      .addCase(busData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(busChart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(busChart.fulfilled, (state, action) => {
        state.loading = false;
        state.busSeat = action.payload;
      })
      .addCase(busChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default busSlice.reducer;
