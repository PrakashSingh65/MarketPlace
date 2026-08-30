import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shippingAddress: {
    name: "",
    phone: "",
    address: "",
    street: "",
    city: "",
    pincode: "",
  },
  currentOrder: null,
  checkoutStep: 1,
  orderStatusFilter: "ALL",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload };
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setCheckoutStep: (state, action) => {
      state.checkoutStep = action.payload;
    },
    setOrderStatusFilter: (state, action) => {
      state.orderStatusFilter = action.payload;
    },
    clearOrderState: () => initialState,
  },
});

export const {
  setShippingAddress,
  setCurrentOrder,
  setCheckoutStep,
  setOrderStatusFilter,
  clearOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
