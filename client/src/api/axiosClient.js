import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosClient = axios.create({
  baseURL: `${VITE_API_URL}/api/v1`,
  withCredentials: true,
});

// Attach Authorization header if token exists in localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});