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
  apiFetch<TResponse>(path, { method: "POST", body, auth: false });

export const authService = {
  register: (body: RegisterRequest) =>
    publicPost("/api/auth/register", {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      password: body.password,
    }),

  verifyRegistrationOtp: (body: VerifyRegistrationOtpRequest) =>
    publicPost("/api/auth/verify-registration-otp", {
      email: body.email.trim().toLowerCase(),
      otpCode: body.otpCode.trim(),
    }),

  login: (body: LoginRequest) =>
    publicPost("/api/auth/login", {
      email: body.email.trim().toLowerCase(),
      password: body.password,
    }),

  verifyLoginOtp: (body: VerifyOtpRequest) =>
    publicPost("/api/auth/verify-login-otp", {
      email: body.email.trim().toLowerCase(),
      otpCode: body.otpCode.trim(),
    }),

  verifyOtp: (body: VerifyOtpRequest) =>
    publicPost("/api/auth/verify-otp", {
      email: body.email.trim().toLowerCase(),
      otpCode: body.otpCode.trim(),
    }),

  resendOtp: (email: string) =>
    publicPost("/api/auth/resend-otp", { email: email.trim().toLowerCase() }),

  forgotPassword: (body: ForgotPasswordRequest) =>
    publicPost("/api/auth/forgot-password", { email: body.email.trim().toLowerCase() }),

  resetPassword: (body: ResetPasswordRequest) =>
    publicPost("/api/auth/reset-password", {
      email: body.email.trim().toLowerCase(),
      otpCode: body.otpCode.trim(),
      newPassword: body.newPassword,
    }),

  getMe: () => apiFetch<AuthResponse>("/api/auth/me"),
};

export default authService;
