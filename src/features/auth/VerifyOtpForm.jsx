import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyOtpForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await verifyRegistrationOtp({ email, otpCode });
      localStorage.setItem("accessToken", result.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <h2 className="text-lg font-semibold">Verify your email</h2>
      <p className="text-sm text-gray-500">
        We sent a 6-digit code to your email. Enter it below to activate your account.
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
        <input
          type="text"
          required
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          placeholder="123456"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6C63FF] text-white py-2.5 rounded-xl font-medium hover:bg-[#5B52E6] disabled:opacity-60 transition-colors"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}