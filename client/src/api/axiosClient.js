import axios from "axios";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const VITE_API_URL = rawApiUrl.replace(/\/+$/, "");

export const axiosClient = axios.create({
  baseURL: `${VITE_API_URL}/api/v1`,
  withCredentials: true,
});

// Attach Authorization header if token exists in localStorage
axiosClient.interceptors.request.use((config) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("Storage access restricted by browser:", err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});