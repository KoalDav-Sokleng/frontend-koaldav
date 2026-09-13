import { Link } from "react-router-dom";
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
      className="w-full max-w-sm space-y-5"
    >
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5
                     text-sm outline-none
                     focus:border-[#6C63FF]
                     focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-xl border border-gray-200
                       px-4 py-2.5 pr-16 text-sm outline-none
                       focus:border-[#6C63FF]
                       focus:ring-2 focus:ring-[#6C63FF]/20"
          />

          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-xs font-medium text-gray-500
                       hover:text-[#6C63FF]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3">
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Login button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6C63FF] text-white py-2.5
                   rounded-xl font-medium
                   hover:bg-[#5B52E6]
                   disabled:opacity-60
                   disabled:cursor-not-allowed
                   transition-colors"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {/* Register */}
      <p className="text-sm text-center text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-[#6C63FF] font-medium hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
