import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

export default function LoginForm() {
  const {
    form,
    error,
    loading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePassword,
  } = useLogin();

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="w-full space-y-5 animate-fade-in-up"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6C63FF]">
            Welcome Back
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">
            Login
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Sign in to track your goals, habits &amp; finances.
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDE9FE] text-[#6C63FF] shadow-sm transition-transform duration-300 hover:scale-110 hover:rotate-6">
          <Sparkles size={20} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-slate-700"
            >
              Gmail address
            </label>
            <span className="text-[10px] font-medium text-slate-400">
              Must end in @gmail.com
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-4 py-3 transition-all duration-200 hover:border-slate-300 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
            <Mail
              size={18}
              className="shrink-0 text-slate-400 transition-colors duration-200"
              aria-hidden="true"
            />
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              data-lpignore="true"
              data-form-type="other"
              value={form.email}
              onChange={handleChange}
              placeholder="yourname@gmail.com"
              aria-label="Gmail address"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-inherit"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#FAFAFC] px-4 py-3 transition-all duration-200 hover:border-slate-300 focus-within:border-[#6C63FF] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6C63FF]/15 focus-within:shadow-[0_4px_16px_rgba(108,99,255,0.08)]">
            <Lock
              size={18}
              className="shrink-0 text-slate-400 transition-colors duration-200"
              aria-hidden="true"
            />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="new-password"
              data-lpignore="true"
              data-form-type="other"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              aria-label="Password"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-inherit"
            />
            <button
              type="button"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              className="shrink-0 text-slate-400 transition-all duration-200 hover:text-[#6C63FF] hover:scale-110 active:scale-95 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs sm:text-sm pt-0.5">
          <label className="flex items-center gap-2 text-slate-500 cursor-pointer transition-opacity hover:opacity-80">
            <input
              type="checkbox"
              className="h-4 w-4 rounded accent-[#6C63FF] cursor-pointer transition-transform duration-150 active:scale-90"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="font-semibold text-[#6C63FF] transition-all duration-200 hover:text-[#5B52E6] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="animate-fade-in-up rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm">
            <p className="text-xs sm:text-sm text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#6C63FF] hover:bg-[#5B52E6] py-3.5 font-bold text-white shadow-[0_12px_28px_rgba(108,99,255,0.35)] transition-all duration-300 hover:shadow-[0_16px_32px_rgba(108,99,255,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer text-sm"
        >
          {loading ? "Signing in..." : "Login Now"}
        </button>

        <p className="pt-2 text-center text-xs sm:text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#6C63FF] hover:text-[#5B52E6] transition-colors duration-200 hover:underline"
          >
            Signup now
          </Link>
        </p>
      </div>
    </form>
  );
}
