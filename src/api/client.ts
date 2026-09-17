import type { ApiErrorResponse } from "./types";

export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "").replace(/\/api$/, "");
  if (envUrl && !envUrl.includes("8080")) {
    return envUrl;
  }
  return "http://localhost:8081";
})();

export class ApiError extends Error {
  status: number;
  details?: ApiErrorResponse;

  constructor(message: string, status: number, details?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function getToken(): string | null {
  const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
  if (!token || token === "undefined" || token === "null" || token === "mock-token") {
    return null;
  }
  return token;
}

export function handleUnauthorized(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("authUser");
  const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-otp"];
  if (!publicPaths.includes(window.location.pathname)) {
    window.location.assign("/login");
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: Omit<RequestInit, "body"> & { auth?: boolean; body?: unknown } = {},
): Promise<T> {
  const { auth = true, headers, body, ...requestInit } = options;
  const requestHeaders = new Headers(headers);
  if (body && !requestHeaders.has("Content-Type") && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = auth ? getToken() : null;
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  const requestBody =
    body && typeof body !== "string" && !(body instanceof FormData)
      ? JSON.stringify(body)
      : (body as BodyInit | null | undefined);

  // Normalize path so both "/api/..." and "/..." work with API_BASE_URL
  const normalizedPath = path.startsWith("/api/")
    ? path
    : path === "/api"
    ? "/api"
    : `/api${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...requestInit,
      body: requestBody,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiError(`Unable to connect to the API at ${API_BASE_URL}.`, 0);
  }

  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const details = typeof data === "object" && data !== null ? data : undefined;
    let validationMsg = "";
    if (details?.errors && typeof details.errors === "object") {
      const errorValues = Object.values(details.errors);
      if (errorValues.length > 0) {
        validationMsg = errorValues
          .map((v) => (typeof v === "object" && v !== null ? JSON.stringify(v) : String(v)))
          .join(". ");
      }
    }

    const message =
      (typeof data === "string" && data.trim()) ||
      validationMsg ||
      details?.message ||
      details?.error ||
      details?.msg ||
      details?.errorMessage ||
      details?.detail ||
      details?.title ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, details);
  }

  return data as T;
}

export function jsonBody<T>(body: T): string {
  return JSON.stringify(body);
}

export default apiFetch;
