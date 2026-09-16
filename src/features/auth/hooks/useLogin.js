import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { isValidGmail } from "../utils/authValidation";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      const normalizedEmail = form.email.trim();
      if (!isValidGmail(normalizedEmail)) {
        setError("Please enter a valid @gmail.com address (e.g. example@gmail.com).");
        return;
      }

      if (!form.password) {
        setError("Password is required.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const result = await login({
          email: normalizedEmail,
          password: form.password,
        });

        if (result?.token) {
          navigate("/", { replace: true });
        } else {
          navigate("/verify-otp", {
            state: { email: normalizedEmail, flow: "login" },
          });
        }
      } catch (err) {
        setError(
          err?.message || "Invalid email or password."
        );
      } finally {
        setLoading(false);
      }
    },
    [login, loading, form, navigate]
  );

  return {
    form,
    error,
    loading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
}

export default useLogin;
