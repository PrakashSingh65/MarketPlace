import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

// ─── Raw API Functions ────────────────────────────────────────────────────────

// GET /payment/key → Fetch Razorpay public key ID
export const fetchRazorpayKeyApi = async () => {
  const response = await axiosClient.get("/payment/key");
  return response.data; // { keyId }
};

// POST /payment/create-order → Create Razorpay Order on server
export const createRazorpayOrderApi = async ({ amount, currency = "INR", receipt, orderId }) => {
  const response = await axiosClient.post("/payment/create-order", {
    amount,
    currency,
    receipt,
    orderId,
  });
  return response.data; // { success, keyId, orderId (razorpay_order_id), amount, currency }
};

// POST /payment/verify-payment → Cryptographic signature verification
export const verifyPaymentApi = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  orderId,
}) => {
  const response = await axiosClient.post("/payment/verify-payment", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  });
  return response.data; // { success, message, order }
};

// ─── TanStack Query Hooks ─────────────────────────────────────────────────────

export const useGetRazorpayKey = () => {
  return useQuery({
    queryKey: ["razorpayKey"],
    queryFn: fetchRazorpayKeyApi,
    staleTime: Infinity,
  });
};

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: createRazorpayOrderApi,
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyPaymentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
    },
  });
};
