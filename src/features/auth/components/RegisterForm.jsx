import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.gender) {
      setError("Please select a gender.");
      return;
    }

    setLoading(true);
    try {
      // Drop confirmPassword before sending to the API
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input
          type="text"
          name="fullName"
          required
          value={form.fullName}
          onChange={handleChange}
          placeholder="Alex"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          required
          value={form.lastName}
          onChange={handleChange}
          placeholder="Rivera"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          name="gender"
          required
          value={form.gender}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 bg-white"
        >
          <option value="" disabled>
            Select gender
          </option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Re-type Password</label>
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={6}
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6C63FF] text-white py-2.5 rounded-xl font-medium hover:bg-[#5B52E6] disabled:opacity-60 transition-colors"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-sm text-center text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-[#6C63FF] font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}