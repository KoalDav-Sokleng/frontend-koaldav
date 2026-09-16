import authService from "../../../api/authService";
import { apiFetch } from "../../../api/client";

function toUser(res) {
  if (!res) return null;
  return {
    id: res.id,
    email: res.email,
    firstName: res.firstName,
    lastName: res.lastName,
    name:
      res.firstName && res.lastName
        ? `${res.firstName} ${res.lastName}`
        : res.firstName || res.name || res.email?.split("@")[0],
    avatar: res.avatar,
    createdAt: res.createdAt,
  };
}

export async function login(credentials) {
  const response = await authService.login(credentials);
  if (response.token) {
    return { ...response, user: toUser(response) };
  }
  return response;
}

export async function verifyLoginOtp(payload) {
  const response = await authService.verifyLoginOtp(payload);
  return { ...response, user: toUser(response) };
}

export const register = (payload) => authService.register(payload);

export const verifyOtp = (payload) => authService.verifyOtp(payload);

export const resendOtp = (email) => authService.resendOtp(email);

export const forgotPassword = (email) => authService.forgotPassword({ email });

export const resetPassword = (payload) => authService.resetPassword(payload);

export async function getCurrentUser() {
  try {
    const data = await authService.getMe();
    const user = toUser(data?.user ?? data);
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("user", JSON.stringify(user));
      return { user };
    }
  } catch (err) {
    // If /api/auth/me fails, try /api/profile as fallback
    try {
      const prof = await apiFetch("/profile");
      const user = toUser(prof?.data ?? prof?.user ?? prof);
      if (user) {
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));
        return { user };
      }
    } catch {
      // If network fails or offline, read cached user from localStorage
      const stored = localStorage.getItem("authUser") || localStorage.getItem("user");
      if (stored) {
        return { user: JSON.parse(stored) };
      }
      throw err;
    }
  }
  return null;
}

export function logout() {
  return Promise.resolve({ ok: true });
}
