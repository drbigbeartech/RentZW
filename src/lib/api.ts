import axios, { AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 403) {
      toast.error("Access denied");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;

// API endpoints
export const endpoints = {
  // Auth
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  verifyEmail: "/auth/verify-email",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",

  // Users
  profile: "/users/profile",
  updateProfile: "/users/profile",

  // Properties
  properties: "/properties",
  myProperties: "/properties/my-properties",
  propertyById: (id: string) => `/properties/${id}`,
  searchProperties: "/properties/search",

  // Applications
  applications: "/applications",
  myApplications: "/applications/my-applications",
  propertyApplications: (propertyId: string) =>
    `/applications/property/${propertyId}`,
  updateApplication: (id: string) => `/applications/${id}`,

  // Favorites
  favorites: "/favorites",
  addFavorite: "/favorites",
  removeFavorite: (id: string) => `/favorites/${id}`,

  // Stats
  dashboardStats: "/stats/dashboard",
  platformStats: "/stats/platform",

  // Currency
  exchangeRates: "/currency/rates",

  // File upload
  uploadImage: "/upload/image",
};
