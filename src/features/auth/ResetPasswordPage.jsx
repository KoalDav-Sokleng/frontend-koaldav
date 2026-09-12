import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Check,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import AuthLayout from "./AuthLayout";
import OtpInput from "./components/OtpInput";
import PasswordStrengthMeter from "./components/PasswordStrengthMeter";
import { resetPassword, resendOtp } from "./api/authApi";
import { isValidGmail, validatePassword } from "./utils/authValidation";
import AuthThemeToggle from "./components/AuthThemeToggle";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email] = useState(
    location.state?.email || sessionStorage.getItem("resetEmail") || "",
  );
  const [otpCode, setOtpCode] = useState(location.state?.otpCode || "");
  const [otpVerified, setOtpVerified] = useState(
    location.state?.verified || false,
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem("resetEmail", email);
    }
  }, [email]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpVerify = (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!isValidGmail(email.trim())) {
      setError("Please enter a valid @gmail.com address.");
      return;
    }

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setOtpVerified(true);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim();
    if (!isValidGmail(normalizedEmail)) {
      setError(
        "Email must be a valid @gmail.com address (e.g. example@gmail.com).",
      );
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: normalizedEmail,
        otpCode: otpCode.trim(),
        newPassword,
      });
      sessionStorage.removeItem("resetEmail");
      window.alert("Password reset successfully! You can now log in.");
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to reset your password. Please verify the OTP code.",
      );
      if (requestError.message?.toLowerCase().includes("otp")) {
        setOtpVerified(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending || !email) return;

    setError("");
    setSuccessMessage("");
    setResending(true);
    try {
      await resendOtp(email.trim());
      setSuccessMessage("A new 6-digit OTP has been sent to your Gmail.");
      setResendCooldown(60);
    } catch (err) {
      setError(err?.message || "Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full space-y-6 animate-fade-in-up">
        {!otpVerified ? (
          /* ── STEP 1: OTP Verification View in purple brand theme ── */
          <div className="relative space-y-6 text-center">
            {/* Sun / Moon Theme Toggle */}
            <div className="absolute right-0 top-0">
              <AuthThemeToggle />
            </div>

            {/* Top MailCheck Icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#5B52E6] to-[#6C63FF] text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] ring-8 ring-[#EDE9FE]/80 dark:ring-[#1E1B4B]/80 transition-transform duration-300 hover:scale-105">
              <div className="relative">
                <Mail size={34} strokeWidth={2.2} />
                <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-[#0F172A] text-[#6C63FF] dark:text-[#A5B4FC] shadow-md ring-2 ring-[#6C63FF]">
                  <Check size={11} strokeWidth={4} />
                </span>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Verify your email
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                We sent a 6-digit code to your Gmail account. Please enter it
                below to continue your journey.
              </p>
              {email && (
                <div className="pt-1">
                  <span className="inline-block rounded-full border border-[#6C63FF]/30 bg-[#EDE9FE]/70 px-3.5 py-1 font-mono text-xs font-bold text-[#6C63FF] dark:border-[#6C63FF]/40 dark:bg-[#1E1B4B]/80 dark:text-[#A5B4FC]">
                    {email}
                  </span>
                </div>
              )}
            </div>

            {/* 6-Box OTP Input Form */}
            <form onSubmit={handleOtpVerify} className="space-y-6 pt-2">
              <OtpInput
                length={6}
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  if (val.length === 6) setError("");
                }}
                autoFocus
              />

              {error && (
                <div className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-xs text-red-600 dark:text-red-400 font-medium shadow-xs">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="animate-fade-in-up rounded-2xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/40 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-300 font-medium shadow-xs">
                  {successMessage}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otpCode.length !== 6}
                className="w-full rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E6] py-3.5 sm:py-4 font-bold text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] dark:shadow-[0_12px_28px_rgba(108,99,255,0.2)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>Verify</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              {/* Resend link */}
              <div className="space-y-2 pt-1 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <p>
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resending}
                    className="font-bold text-[#6C63FF] dark:text-[#818CF8] hover:text-[#5B52E6] dark:hover:text-[#A5B4FC] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors inline-flex items-center gap-1"
                  >
                    {resending && (
                      <RefreshCw size={12} className="animate-spin" />
                    )}
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                </p>

                <div>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-[#6C63FF] dark:hover:text-[#818CF8] transition-colors"
                  >
                    Change Email
                  </Link>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* ── STEP 2: Set New Password Form ── */
          <form
            onSubmit={handlePasswordReset}
            className="w-full space-y-5 animate-fade-in-up"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF] dark:text-[#818CF8]">
                  Step 2 of 2
                </p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Set New Password
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Create a strong new password for your account.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-xs">
                  <Check size={22} strokeWidth={3} />
                </div>
                <AuthThemeToggle />
              </div>
            </div>

            {/* New Password with Live Strength Meter */}
            <div className="space-y-1.5">
              <label
                htmlFor="reset-password-new"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                New password
              </label>
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-4 py-3 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
                <Lock
                  size={18}
                  className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
                  aria-hidden="true"
                />
                <input
                  id="reset-password-new"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new strong password"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-[#6C63FF] dark:hover:text-[#818CF8] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Live Password Strength Progress Bar & Criteria */}
              <PasswordStrengthMeter password={newPassword} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="reset-password-confirm"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Confirm new password
              </label>
              <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-4 py-3 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
                <Lock
                  size={18}
                  className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
                  aria-hidden="true"
                />
                <input
                  id="reset-password-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-[#6C63FF] dark:hover:text-[#818CF8] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-4 py-3 text-xs text-red-600 dark:text-red-400 font-medium shadow-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E6] py-3.5 font-bold text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] dark:shadow-[0_12px_28px_rgba(108,99,255,0.2)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer text-sm"
            >
              {loading ? "Resetting..." : "Reset Password & Login"}
            </button>

            <p className="pt-2 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setOtpVerified(false)}
                className="font-semibold text-[#6C63FF] dark:text-[#818CF8] hover:underline cursor-pointer"
              >
                ← Back to OTP verification
              </button>
            </p>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
