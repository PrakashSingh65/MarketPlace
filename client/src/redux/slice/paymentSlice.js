import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  paymentMethod: "Razorpay", // 'Razorpay', 'COD', 'UPI', 'Card'
  paymentStatus: "Pending", // 'Pending', 'Processing', 'Paid', 'Failed'
  razorpayDetails: {
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
  },
  isProcessingPayment: false,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setRazorpayDetails: (state, action) => {
      state.razorpayDetails = { ...state.razorpayDetails, ...action.payload };
    },
    setIsProcessingPayment: (state, action) => {
      state.isProcessingPayment = action.payload;
    },
    resetPaymentState: () => initialState,
  },
});

export const {
  setPaymentMethod,
  setPaymentStatus,
  setRazorpayDetails,
  setIsProcessingPayment,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
