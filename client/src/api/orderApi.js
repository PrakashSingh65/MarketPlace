import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

// ─── Raw API Functions ────────────────────────────────────────────────────────

// POST /order → Create new order
export const createOrderApi = async (orderPayload) => {
  const response = await axiosClient.post("/order", orderPayload);
  return response.data; // { success, message, order }
};

// GET /order/my-orders → Fetch user's orders
export const fetchMyOrdersApi = async () => {
  const response = await axiosClient.get("/order/my-orders");
  return response.data; // { success, orders: [...] } or array
};

// GET /order/:id → Fetch single order by orderId or _id
export const fetchOrderByIdApi = async (id) => {
  if (!id) return null;
  const response = await axiosClient.get(`/order/${id}`);
  return response.data; // { success, order }
};

// PUT /order/cancel/:id → Cancel an existing order
export const cancelOrderApi = async (id) => {
  const response = await axiosClient.put(`/order/cancel/${id}`);
  return response.data; // { success, message, order }
};

// PUT /order/update-status/:id → Update order status (Admin/Supplier)
export const updateOrderStatusApi = async ({ id, status }) => {
  const response = await axiosClient.put(`/order/update-status/${id}`, { status });
  return response.data;
};

// ─── TanStack Query Hooks ─────────────────────────────────────────────────────

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: ["myOrders"],
    queryFn: fetchMyOrdersApi,
    retry: 1,
  });
};

export const useGetOrderById = (id) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderByIdApi(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrderApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
};
