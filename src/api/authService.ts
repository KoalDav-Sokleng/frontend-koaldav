import { apiFetch } from "./client";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyOtpRequest,
  VerifyRegistrationOtpRequest,
} from "./types";

const publicPost = <TRequest, TResponse>(path: string, body: TRequest) =>
  apiFetch<TResponse>(path, { method: "POST", body: JSON.stringify(body), auth: false });

export const authService = {
  register: (body: RegisterRequest) => publicPost<RegisterRequest, AuthResponse>("/api/auth/register", body),
  verifyRegistrationOtp: (body: VerifyRegistrationOtpRequest) =>
    publicPost<VerifyRegistrationOtpRequest, AuthResponse>("/api/auth/verify-registration-otp", body),
  login: (body: LoginRequest) => publicPost<LoginRequest, AuthResponse>("/api/auth/login", body),
  verifyLoginOtp: (body: VerifyOtpRequest) =>
    publicPost<VerifyOtpRequest, AuthResponse>("/api/auth/verify-login-otp", body),
  verifyOtp: (body: VerifyOtpRequest) =>
    publicPost<VerifyOtpRequest, string>("/api/auth/verify-otp", body),
  resendOtp: (email: string) =>
    publicPost<{ email: string }, string>("/api/auth/resend-otp", { email }),
  forgotPassword: (body: ForgotPasswordRequest) =>
    publicPost<ForgotPasswordRequest, string>("/api/auth/forgot-password", body),
  resetPassword: (body: ResetPasswordRequest) =>
    publicPost<ResetPasswordRequest, string>("/api/auth/reset-password", body),
  getMe: () => apiFetch<AuthResponse>("/api/auth/me"),
};

export default authService;
