// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import * as authApi from "../features/auth/api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if we have a token, try to fetch the current user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .getCurrentUser()
      .then((data) => setUser(data.user ?? data))
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const token =
      data?.token ||
      data?.accessToken ||
      data?.jwt ||
      data?.data?.token ||
      data?.data?.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    const userData = data?.user || data?.data?.user || data;
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    const token =
      data?.token ||
      data?.accessToken ||
      data?.jwt ||
      data?.data?.token ||
      data?.data?.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    const userData = data?.user || data?.data?.user || data;
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : updatedData));
  }, []);

  const value = {
    user,
    setUser,
    updateUser,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
