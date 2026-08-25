import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

export const useSignup = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axiosClient.post("/auth/register", formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        }
    })
}


export const useSignIn = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axiosClient.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return response.data;
        }
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationFn: async (formData) => {
            const response = await axiosClient.post("/auth/logout", {}, {
                withCredentials: true
            });
            return response.data;
        }
    })
}



export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await axiosClient.get("/auth/checkAuth", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};