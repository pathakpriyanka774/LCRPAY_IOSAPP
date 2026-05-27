import { combineSlices, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { allCities } from "./cityApi";

const initialState = {
  cities: [],
  loading: false,
  error: null,
};

// Define async thunk to fetch cities
export const getCity = createAsyncThunk("city/getCity", async () => {
  try {
    const response = await allCities();

    return response;
  } catch (error) {
    throw Error("Failed to fetch cities");
  }
});

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(getCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default citySlice.reducer;
