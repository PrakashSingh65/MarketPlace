import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

// ─── Raw API Functions (match cart routes exactly) ────────────────────────────

// GET /cart  → own cart only
export const fetchCart = async () => {
  const response = await axiosClient.get("/cart");
  return response.data; // { success, cart: { userId, items: [...] } }
};

// POST /cart/add  → { productId, quantity }
export const addItemToCart = async ({ productId, quantity = 1 }) => {
  const response = await axiosClient.post("/cart/add", { productId, quantity });
  return response.data;
};

// PUT /cart/update/:productId  → { quantity }
export const updateCartItem = async ({ productId, quantity }) => {
  const response = await axiosClient.put(`/cart/update/${productId}`, { quantity });
  return response.data;
};

// DELETE /cart/remove/:productId
export const removeCartItem = async (productId) => {
  const response = await axiosClient.delete(`/cart/remove/${productId}`);
  return response.data;
};

// DELETE /cart/clear
export const clearCartApi = async () => {
  const response = await axiosClient.delete("/cart/clear");
  return response.data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    retry: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
