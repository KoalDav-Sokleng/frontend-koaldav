// src/features/auth/api/authApi.js
import { apiFetch } from "../../../api/client";

// TEMPORARY: while there's no real backend yet, set VITE_MOCK_AUTH=true
// in .env and any email/password will "log in" with a fake user + token.
// Delete this flag (and the mock branches below) once /auth/* exists for real.
const MOCK_AUTH = import.meta.env.VITE_MOCK_AUTH === "true";

function mockDelay(data, ms = 400) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export function login({ email, password }) {
  if (MOCK_AUTH) {
    if (!email || !password) {
      return Promise.reject(new Error("Email and password are required."));
    }
    return mockDelay({
      token: "mock-token",
      user: { id: "mock-1", name: email.split("@")[0], email },
    });
  }
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function register({ name, email, password }) {
  if (MOCK_AUTH) {
    if (!name || !email || !password) {
      return Promise.reject(new Error("All fields are required."));
    }
    return mockDelay({
      token: "mock-token",
      user: { id: "mock-1", name, email },
    });
  }
  return apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
}

export function getCurrentUser() {
  if (MOCK_AUTH) {
    return mockDelay({ user: { id: "mock-1", name: "Demo User", email: "demo@example.com" } });
  }
  return apiFetch("/auth/me");
}

export function logout() {
  if (MOCK_AUTH) {
    return mockDelay({ ok: true }, 100);
  }
  return apiFetch("/auth/logout", { method: "POST" });
}
