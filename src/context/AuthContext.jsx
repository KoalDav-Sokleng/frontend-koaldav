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
  const [user, setUser] = useState(() => {
    try {
      const stored =
        localStorage.getItem("authUser") || localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    const stored =
      localStorage.getItem("authUser") || localStorage.getItem("user");
    if (!token || token === "undefined" || token === "null") return false;
    return !stored;
  });

  // On first load, if we have a token, fetch the current user from backend
  useEffect(() => {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      setLoading(false);
      return;
    }

    authApi
      .getCurrentUser()
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("authUser", JSON.stringify(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch((err) => {
        if (err?.status === 401 || err?.status === 403) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("token");
          localStorage.removeItem("authUser");
          localStorage.removeItem("user");
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    if (data?.otpRequired) {
      return data;
    }
    const token =
      data?.token ||
      data?.accessToken ||
      data?.jwt ||
      data?.data?.token ||
      data?.data?.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", token);
    }
    const userData = data?.user || data?.data?.user || data;
    if (userData && token) {
      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  }, []);

  const verifyLoginOtp = useCallback(async (payload) => {
    const data = await authApi.verifyLoginOtp(payload);
    const token =
      data?.token ||
      data?.accessToken ||
      data?.jwt ||
      data?.data?.token ||
      data?.data?.accessToken;
    if (token) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("token", token);
    }
    const userData = data?.user || data?.data?.user || data;
    if (userData) {
      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
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
      localStorage.setItem("token", token);
    }
    const userData = data?.user || data?.data?.user || data;
    if (userData && token) {
      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...updatedData } : updatedData;
      localStorage.setItem("authUser", JSON.stringify(next));
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    setUser,
    updateUser,
    loading,
    isAuthenticated: !!user,
    login,
    verifyLoginOtp,
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
