import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

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

      setError("");
      setLoading(true);

      try {
        await login({
          email: form.email.trim(),
          password: form.password,
        });
        navigate("/", { replace: true });
      } catch (err) {
        setError(
          err?.message || "Unable to sign in. Please check your email and password."
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
