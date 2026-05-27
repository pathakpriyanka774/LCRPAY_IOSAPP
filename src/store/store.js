import { configureStore } from '@reduxjs/toolkit';
import registerReducer from '../features/userRegister/RegisterSlice';
import aadharReducer from '../features/aadharKyc/AadharSlice';
// import walletReducer from '../features/wallet/walletSlice';

export const store = configureStore({
  reducer: {
    register: registerReducer,
    aadhar: aadharReducer,
    // wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
