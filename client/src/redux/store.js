import { configureStore } from '@reduxjs/toolkit';
import authSlice from "./slice/authSlice";
import productSlice from "./slice/productSlice";
import cartSlice from "./slice/cartSlice";
import orderSlice from "./slice/orderSlice";
import paymentSlice from "./slice/paymentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    productUI: productSlice,
    cart: cartSlice,
    order: orderSlice,
    payment: paymentSlice,
  }
});