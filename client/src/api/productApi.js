import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

export const fetchProducts = async (filters = {}) => {
  const response = await axiosClient.get("/product", { params: filters });
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axiosClient.get(`/product/${id}`);
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await axiosClient.post("/product", formData, {
    headers: {
      "Content-Type": formData instanceof FormData ? "multipart/form-data" : "application/json",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`/product/${id}`);
  return response.data;
};

export const addProductReview = async ({ id, reviewData }) => {
  const response = await axiosClient.post(`/product/${id}/reviews`, reviewData);
  return response.data;
};

export const useGetProducts = (filters) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    placeholderData: (previousData) => previousData,
  });
};

export const useGetProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAddProductReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProductReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};