import authService from "../../../api/authService";

function toUser({ email, firstName, lastName }) {
  return { email, firstName, lastName };
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

export function getCurrentUser() {
  const storedUser = localStorage.getItem("authUser");
  return Promise.resolve(storedUser ? { user: JSON.parse(storedUser) } : null);
}

export function logout() {
  return Promise.resolve({ ok: true });
}
