export const isValidGmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return /^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(email.trim());
};

export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long" };
  }
  if (!/\d/.test(password)) {
    return { isValid: false, message: "Password must include at least one number (0-9)" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: "Password must include at least one special character (!@#$%^&*)" };
  }
  return { isValid: true, message: "" };
};

