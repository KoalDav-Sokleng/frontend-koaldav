// src/api/client.js
import axios from "axios";

// Points to your Spring Boot server on port 8081 with /api prefix
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.auth !== false) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized error + 401 handling
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    const message =
      error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

export async function apiFetch(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const res = await http.request({
    url: path,
    method,
    data: body,
    headers,
    auth,
  });
  return res.data;
}

export default apiFetch;