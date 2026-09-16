import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import AuthThemeToggle from "./AuthThemeToggle";
import { isValidGmail, validatePassword } from "../utils/authValidation";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = form.email.trim();
    if (!isValidGmail(normalizedEmail)) {
      setError(
        "Email must be a valid @gmail.com address (e.g. example@gmail.com).",
      );
      return;
    }

    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: normalizedEmail,
        password: form.password,
      };
      const res = await register(payload);
      if (res?.otpRequired) {
        navigate("/verify-otp", {
          state: { email: normalizedEmail, flow: "register" },
          replace: true,
        });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4 animate-fade-in-up"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF] dark:text-[#818CF8]">
            Get Started
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Create Account
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Join to start tracking your goals, trips &amp; daily habits.
          </p>
        </div>

        {/* Sun / Moon Theme Toggle */}
        <AuthThemeToggle />
      </div>

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="first-name"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            First name
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-3.5 py-2.5 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
            <User
              size={16}
              className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
              aria-hidden="true"
            />
            <input
              id="first-name"
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              aria-label="First name"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="last-name"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Last name
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-3.5 py-2.5 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
            <User
              size={16}
              className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
              aria-hidden="true"
            />
            <input
              id="last-name"
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              aria-label="Last name"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
            />
          </div>
        </div>
      </div>

      {/* Gmail Address */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Gmail address
          </label>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Must end in @gmail.com
          </span>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-3.5 py-2.5 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
          <Mail
            size={16}
            className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
            aria-hidden="true"
          />
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="yourname@gmail.com"
            aria-label="Gmail address"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
          />
        </div>
      </div>

      {/* Password with Strength Meter */}
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Password
        </label>
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-3.5 py-2.5 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
          <Lock
            size={16}
            className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
            aria-hidden="true"
          />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create strong password"
            aria-label="Password"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-[#6C63FF] dark:hover:text-[#818CF8] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Live Password Strength Progress Bar & Criteria */}
        <PasswordStrengthMeter password={form.password} />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label
          htmlFor="confirm-password"
          className="text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Confirm password
        </label>
        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-3.5 py-2.5 transition-all duration-200 hover:border-slate-300 dark:border-slate-800 dark:bg-[#151C2C] dark:hover:border-slate-700 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 dark:focus-within:border-[#6C63FF] dark:focus-within:bg-[#1E293B] focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
          <Lock
            size={16}
            className="shrink-0 text-slate-400 dark:text-slate-500 transition-colors duration-200"
            aria-hidden="true"
          />
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            aria-label="Confirm password"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-inherit"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
            className="shrink-0 text-slate-400 dark:text-slate-500 hover:text-[#6C63FF] dark:hover:text-[#818CF8] transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Terms and conditions */}
      <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1 transition-opacity hover:opacity-80">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-4 w-4 rounded accent-[#6C63FF] cursor-pointer transition-transform duration-150 active:scale-90"
        />
        <span>I accept all terms &amp; conditions</span>
      </label>

      {error && (
        <div className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/40 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400 font-medium shadow-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E6] py-3.5 font-bold text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] dark:shadow-[0_12px_28px_rgba(108,99,255,0.2)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer text-sm"
      >
        {loading ? "Creating account..." : "Register Now"}
      </button>

      <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-[#6C63FF] dark:text-[#818CF8] hover:text-[#5B52E6] dark:hover:text-[#A5B4FC] transition-colors duration-200 hover:underline"
        >
          Login now
        </Link>
      </p>
    </form>
  );
}
