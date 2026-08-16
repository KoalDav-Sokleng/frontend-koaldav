// src/api/client.js
// Single place that knows how to talk to the backend.
// Every feature's api/*.js file should import `apiFetch` from here
// instead of calling fetch() directly.

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("accessToken");
}

/**
 * apiFetch("/goals", { method: "POST", body: { title: "Run 5k" } })
 */
export async function apiFetch(path, { method = "GET", body, headers = {}, auth = true } = {}) {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // token expired / invalid - let AuthContext decide what to do
    localStorage.removeItem("accessToken");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204 No Content)
  }

  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export default apiFetch;
