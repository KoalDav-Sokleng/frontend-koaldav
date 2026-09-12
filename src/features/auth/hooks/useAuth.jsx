// src/features/auth/hooks/useAuth.jsx
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

// Must match the key client.js reads in getToken()/removes on 401.
const TOKEN_KEY = "accessToken";
const USER_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  // Backend's AuthResponse shape: { token, email, firstName, lastName }
  const persistSession = useCallback((authResponse) => {
    const nextUser = {
      email: authResponse.email,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
    };
    setToken(authResponse.token);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return authResponse;
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // client.js dispatches this whenever a request comes back 401 and it has
  // already wiped the token from storage — sync React state to match.
  useEffect(() => {
    const handleUnauthorized = () => clearSession();
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [clearSession]);

  // Does NOT log the user in — backend creates an unverified account and
  // emails an OTP. Returns { message }.
  const register = useCallback((payload) => authApi.register(payload), []);

  // Verifying the registration OTP DOES log the user in (backend returns AuthResponse).
  const verifyOtp = useCallback(
    ({ email, otpCode }) => authApi.verifyOtp({ email, otpCode }).then(persistSession),
    [persistSession]
  );

  const resendOtp = useCallback((email) => authApi.resendOtp(email), []);

  const login = useCallback(
    ({ email, password }) => authApi.login({ email, password }).then(persistSession),
    [persistSession]
  );

  const forgotPassword = useCallback((email) => authApi.forgotPassword(email), []);

  const resetPassword = useCallback(
    ({ email, otpCode, newPassword }) => authApi.resetPassword({ email, otpCode, newPassword }),
    []
  );

  const logout = useCallback(() => {
    clearSession();
    authApi.logout?.().catch(() => {}); // best-effort; ignore network errors on logout
  }, [clearSession]);

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    register,
    verifyOtp,
    resendOtp,
    login,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}