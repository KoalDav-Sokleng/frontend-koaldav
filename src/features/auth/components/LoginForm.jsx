import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
      className="w-full max-w-[380px] rounded-3xl bg-white p-8 shadow-lg"
    >
      <h1 className="text-left text-2xl font-bold text-gray-900">Login</h1>
      <div className="mt-3 h-1 w-8 rounded-full bg-[#4C63F0]" />

      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 focus-within:border-[#4C63F0]">
          <Mail size={19} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            aria-label="Email"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 focus-within:border-[#4C63F0]">
          <Lock size={19} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Confirm a password"
            aria-label="Password"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            className="shrink-0 text-gray-400 transition-colors hover:text-[#4C63F0]"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2 text-gray-500">
            <input
              type="checkbox"
              onChange={(event) => event.target.checked}
              className="h-4 w-4 accent-[#4C63F0]"
            />
            Remember me
          </label>
          <Link
            to="/forgot-password"
            className="font-medium text-[#4C63F0] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#4C63F0] py-3 font-bold text-white transition-colors hover:bg-[#3d52d6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login Now"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-[#4C63F0] hover:underline">
            Signup now
          </Link>
        </p>
      </div>
    </form>
  );
}
