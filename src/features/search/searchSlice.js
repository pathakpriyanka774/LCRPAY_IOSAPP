import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  from_loc: null,
  to_loc: null,
  selectedDate: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFromLoc: (state, action) => {
      state.from_loc = action.payload;
    },
    setToLoc: (state, action) => {
      state.to_loc = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    swapLoc: (state, action) => {
      const temp = state.from_loc;
      state.from_loc = state.to_loc;
      state.to_loc = temp;
    },
  },
});

export const { setFromLoc, setToLoc, setSelectedDate, swapLoc } =
  userSlice.actions;

export default userSlice.reducer;
