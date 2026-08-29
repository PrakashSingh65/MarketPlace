import { configureStore } from '@reduxjs/toolkit'
import authSlice from "./slice/authSlice"
import productSlice from "./slice/productSlice"
import cartSlice from "./slice/cartSlice"

export const store = configureStore({
    reducer: {
        auth: authSlice,
        productUI: productSlice,
        cart: cartSlice,
    }
})