import type { ApiErrorResponse } from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "").replace(/\/api$/, "") ||
  "http://localhost:8081";

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

function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

function handleUnauthorized(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authUser");
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function apiFetch<T>(
  path: string,
  options: Omit<RequestInit, "body"> & { auth?: boolean; body?: unknown } = {},
): Promise<T> {
  const { auth = true, headers, body, ...requestInit } = options;
  const requestHeaders = new Headers(headers);
  if (body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const token = auth ? getToken() : null;
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  const requestBody =
    body && typeof body !== "string" ? JSON.stringify(body) : (body as BodyInit | null | undefined);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestInit,
      body: requestBody,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiError(`Unable to connect to the API at ${API_BASE_URL}.`, 0);
  }

  if (response.status === 401) {
    handleUnauthorized();
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const details = typeof data === "object" && data !== null ? data : undefined;
    const message =
      (typeof data === "string" && data.trim()) ||
      details?.message ||
      details?.error ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, details);
  }

  return data as T;
}

export function jsonBody<T>(body: T): string {
  return JSON.stringify(body);
}

export default apiFetch;
