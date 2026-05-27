import { configureStore } from "@reduxjs/toolkit";
import cityReducer from "../features/city/citySlice";
import userSlice from "../features/search/searchSlice";
import AadharDataSlice from "../features/aadharKyc/AadharSlice";
import RegisterSlice from "../features/userRegister/RegisterSlice";
import wallet from "../features/wallet/walletSlice";

export const store = configureStore({
  reducer: {
    city: cityReducer,
    user: userSlice,

    aadhar: AadharDataSlice,
    register: RegisterSlice,
    wallet: wallet,
  },
});
