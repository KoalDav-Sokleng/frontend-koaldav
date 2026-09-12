import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { forgotPassword } from "./api/authApi";
import { isValidGmail } from "./utils/authValidation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const normalizedEmail = email.trim();

    if (!isValidGmail(normalizedEmail)) {
      setError(
        "Email must be a valid @gmail.com address (e.g. example@gmail.com).",
      );
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(normalizedEmail);
      navigate("/reset-password", { state: { email: normalizedEmail } });
    } catch (requestError) {
      setError(requestError.message || "Unable to send a reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-5 animate-fade-in-up"
      >
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF]">
            Password Recovery
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
            Forgot Password?
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Enter your registered Gmail address and we'll send you a 6-digit
            reset code.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="forgot-password-email"
              className="text-xs font-semibold text-slate-700"
            >
              Gmail address
            </label>
            <span className="text-[10px] font-medium text-slate-400">
              Must end in @gmail.com
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-4 py-3 transition-all duration-200 hover:border-slate-300 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
            <Mail
              size={18}
              className="shrink-0 text-slate-400 transition-colors duration-200"
              aria-hidden="true"
            />
            <input
              id="forgot-password-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="yourname@gmail.com"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 font-inherit"
            />
          </div>
        </div>

        {error && (
          <div className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
            <p className="text-xs sm:text-sm text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}
        {message && (
          <div className="animate-fade-in-up rounded-2xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
            <p className="text-xs sm:text-sm text-green-700 font-medium">
              {message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E6] py-3.5 font-bold text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer text-sm"
        >
          {loading ? "Sending Code..." : "Send Reset Code"}
        </button>

        <p className="pt-2 text-center text-xs sm:text-sm text-slate-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-bold text-[#6C63FF] hover:text-[#5B52E6] transition-colors duration-200 hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
