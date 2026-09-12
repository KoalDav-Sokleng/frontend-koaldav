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
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    if (data.otpRequired) {
      return data;
    }
    if (data.token) {
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  const verifyLoginOtp = useCallback(async (payload) => {
    const data = await authApi.verifyLoginOtp(payload);
    if (data.token) {
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setUser(data.user);
    }
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    if (data.token) {
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data));
      setUser(data);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authUser");
      setUser(null);
    }
  }, []);

  const value = {
    user,
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
