import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

export default function RegistrationForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    console.log(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[380px] rounded-3xl border-2 border-[#4C63F0] bg-white p-8 shadow-lg"
    >
      <h1 className="text-left text-2xl font-bold text-gray-900">Registration</h1>
      <div className="mt-3 h-1 w-8 rounded-full bg-[#4C63F0]" />

      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 focus-within:border-[#4C63F0]">
          <User size={19} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            id="registration-first-name"
            type="text"
            name="firstName"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            aria-label="First name"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 focus-within:border-[#4C63F0]">
          <User size={19} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            id="registration-last-name"
            type="text"
            name="lastName"
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            aria-label="Last name"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 focus-within:border-[#4C63F0]">
          <Mail size={19} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            id="registration-email"
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
            id="registration-password"
            type={showPassword ? "text" : "password"}
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            aria-label="Password"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 focus-within:border-[#4C63F0]">
          <Lock size={19} className="shrink-0 text-gray-400" aria-hidden="true" />
          <input
            id="registration-confirm-password"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            required
            minLength={6}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm a password"
            aria-label="Confirm password"
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword((currentValue) => !currentValue)}
            aria-label={showPassword ? "Hide passwords" : "Show passwords"}
            title={showPassword ? "Hide passwords" : "Show passwords"}
            className="shrink-0 text-gray-400 transition-colors hover:text-[#4C63F0]"
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            required
            className="h-4 w-4 accent-[#4C63F0]"
          />
          I accept all terms &amp; conditions
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-xl bg-[#4C63F0] py-3 font-bold text-white transition-colors hover:bg-[#3d52d6]"
        >
          Register Now
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#4C63F0] hover:underline">
            Login now
          </Link>
        </p>
      </div>
    </form>
  );
}
