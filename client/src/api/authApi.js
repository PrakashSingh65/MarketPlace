import { useQuery, useMutation } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

export const useSignup = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axiosClient.post("/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (formData) => {
      const response = await axiosClient.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosClient.post("/auth/logout");
      return response.data;
    },
  });
};

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        return null;
      }
      const response = await axiosClient.get("/auth/checkAuth");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};