import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { forgotPassword } from "./api/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage("If an account exists for this email, a reset code is on its way.");
    } catch (requestError) {
      setError(requestError.message || "Unable to send a reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot your password?" subtitle="We will send a reset code to your email.">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <label htmlFor="forgot-password-email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="forgot-password-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
          />
        </div>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}
        {message && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#6C63FF] py-2.5 font-medium text-white transition-colors hover:bg-[#5B52E6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send reset code"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-[#6C63FF] hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}