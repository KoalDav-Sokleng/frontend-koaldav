// src/api/client.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token !== "mock-token" &&
    config.requiresAuth !== false
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If config.url starts with /api/, strip it since baseURL already includes /api
  if (config.url?.startsWith("/api/")) {
    config.url = config.url.substring(4);
  } else if (config.url === "/api") {
    config.url = "";
  }
  return config;
});

// Centralized error + 401/403 handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("accessToken");
    }
    const message =
      error.response?.data?.message ||
      (error.response?.status === 403
        ? "Access forbidden (403): You may need to log in or your session has expired."
        : error.message || "Request failed");
    return Promise.reject(new Error(message));
  }
);

export async function apiFetch(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const reqHeaders = { ...headers };
  if (body instanceof FormData) {
    reqHeaders["Content-Type"] = "multipart/form-data";
  }

  const res = await http.request({
    url: path,
    method,
    data: body,
    headers: reqHeaders,
    requiresAuth: auth,
  });
  return res.data;
}

export default apiFetch;