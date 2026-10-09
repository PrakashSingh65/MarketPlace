import axios from "axios";

const getBaseApiUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || "").trim();
  if (envUrl) {
    let clean = envUrl.replace(/\/+$/, "");
    // Strip redundant trailing /api/v1 or /api if already provided in the env var
    clean = clean.replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
    return `${clean}/api/v1`;
  }
  // Fallback in local development
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api/v1";
  }
  // Relative fallback in production
  return "/api/v1";
};

let memoryToken = null;

export const setAuthToken = (token) => {
  memoryToken = token || null;
  try {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
  } catch (err) {
    console.warn("Storage access restricted by browser:", err);
  }
};

export const getAuthToken = () => {
  if (memoryToken) return memoryToken;
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("token");
      if (stored) {
        memoryToken = stored;
        return stored;
      }
    }
  } catch (err) {
    console.warn("Storage access restricted by browser:", err);
  }
  return null;
};

export const axiosClient = axios.create({
  baseURL: getBaseApiUrl(),
  withCredentials: true,
});

// Attach Authorization header if token exists
axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle unauthorized responses safely
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      const isAuthCall =
        url.includes("/auth/login") ||
        url.includes("/auth/register") ||
        url.includes("/auth/signin") ||
        url.includes("/auth/signup");

      if (!isAuthCall) {
        setAuthToken(null);
        try {
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
          }
        } catch {
          // ignore
        }
      }
    }
    return Promise.reject(error);
  }
);