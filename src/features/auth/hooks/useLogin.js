import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { isValidGmail } from "../utils/authValidation";

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: location.state?.email || "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || "",
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setForm((prev) => ({ ...prev, email: location.state.email }));
    }
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
    }
  }, [location.state]);

  const handleChange = useCallback((e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccessMessage("");
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      const normalizedEmail = form.email.trim().toLowerCase();
      if (!isValidGmail(normalizedEmail)) {
        setError(
          "Please enter a valid @gmail.com address (e.g. example@gmail.com).",
        );
        return;
      }

      if (!form.password) {
        setError("Password is required.");
        return;
      }

      setError("");
      setSuccessMessage("");
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
        const backendMessage =
          err?.details?.message ||
          err?.details?.error ||
          err?.details?.msg ||
          err?.message;
        setError(backendMessage || "Invalid email or password.");
      } finally {
        setLoading(false);
      }
    },
    [login, loading, form, navigate],
  );

  return {
    form,
    error,
    successMessage,
    loading,
    showPassword,
    handleChange,
    handleSubmit,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
}

export default useLogin;
