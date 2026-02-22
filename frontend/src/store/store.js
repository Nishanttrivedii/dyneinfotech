import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './slices/analyticsSlice';
import uploadReducer from './slices/uploadSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    upload: uploadReducer,
    products: productsReducer,
  },
});
