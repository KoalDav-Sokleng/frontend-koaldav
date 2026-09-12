import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Mail, Check, ArrowRight, RefreshCw } from "lucide-react";
import AuthLayout from "./AuthLayout";
import AuthThemeToggle from "./components/AuthThemeToggle";
import OtpInput from "./components/OtpInput";
import { useAuthContext } from "../../context/AuthContext";
import { verifyOtp, resendOtp } from "./api/authApi";

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyLoginOtp } = useAuthContext();

  const emailFromState =
    location.state?.email || sessionStorage.getItem("otpEmail") || "";
  const flow =
    location.state?.flow || sessionStorage.getItem("otpFlow") || "login"; // "login" or "forgot-password"

  const [email] = useState(emailFromState);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem("otpEmail", email);
      sessionStorage.setItem("otpFlow", flow);
    }
  }, [email, flow]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    if (!email) {
      setError("Email address missing. Please start again.");
      return;
    }

    setLoading(true);
    try {
      if (flow === "login") {
        // Verify login 2FA OTP and log user in
        await verifyLoginOtp({ email, otpCode });
        sessionStorage.removeItem("otpEmail");
        sessionStorage.removeItem("otpFlow");
        navigate("/", { replace: true });
      } else {
        // Forgot password flow: Verify OTP then proceed to Reset Password screen
        await verifyOtp({ email, otpCode });
        navigate("/reset-password", {
          state: { email, otpCode, verified: true },
          replace: true,
        });
      }
    } catch (err) {
      setError(
        err?.message || "Invalid or expired OTP code. Please try again.",
      );
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
      await resendOtp(email);
      setSuccessMessage("A fresh 6-digit code has been sent to your Gmail.");
      setResendCooldown(60);
    } catch (err) {
      setError(err?.message || "Unable to resend OTP. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative w-full space-y-6 text-center animate-fade-in-up">
        {/* Sun / Moon Theme Toggle */}
        <div className="absolute right-0 top-0">
          <AuthThemeToggle />
        </div>

        {/* Top Icon Badge in primary purple brand theme */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#5B52E6] to-[#6C63FF] text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] ring-8 ring-[#EDE9FE]/80 dark:ring-[#1E1B4B]/80 transition-transform duration-300 hover:scale-105">
          <div className="relative">
            <Mail size={34} strokeWidth={2.2} />
            <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-[#0F172A] text-[#6C63FF] dark:text-[#A5B4FC] shadow-md ring-2 ring-[#6C63FF]">
              <Check size={11} strokeWidth={4} />
            </span>
          </div>
        </div>

        {/* Header Typography */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Verify your email
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            We sent a 6-digit code to your Gmail account. Please enter it below
            to continue your journey.
          </p>
          {email && (
            <div className="pt-1">
              <span className="inline-block rounded-full border border-[#6C63FF]/30 bg-[#EDE9FE]/70 px-3.5 py-1 font-mono text-xs font-bold text-[#6C63FF] dark:border-[#6C63FF]/40 dark:bg-[#1E1B4B]/80 dark:text-[#A5B4FC]">
                {email}
              </span>
            </div>
          )}
        </div>

        {/* 6-Digit OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6 pt-2">
          <OtpInput
            length={6}
            value={otpCode}
            onChange={(val) => {
              setOtpCode(val);
              if (val.length === 6) {
                setError("");
              }
            }}
            disabled={loading}
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

          {/* Action Button: "Verify ->" */}
          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E6] py-3.5 sm:py-4 font-bold text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] dark:shadow-[0_12px_28px_rgba(108,99,255,0.2)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>{loading ? "Verifying..." : "Verify"}</span>
            {!loading && <ArrowRight size={18} strokeWidth={2.5} />}
          </button>

          {/* Resend Link */}
          <div className="space-y-2 pt-1 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <p>
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resending}
                className="font-bold text-[#6C63FF] dark:text-[#818CF8] hover:text-[#5B52E6] dark:hover:text-[#A5B4FC] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors inline-flex items-center gap-1"
              >
                {resending && <RefreshCw size={12} className="animate-spin" />}
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"}
              </button>
            </p>

            <div>
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-[#6C63FF] dark:hover:text-[#818CF8] transition-colors"
              >
                ← Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
