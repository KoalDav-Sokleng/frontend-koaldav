import { apiFetch } from "../../../api/client";

/**
 * Fetch core user profile data
 * GET /api/profile
 */
export async function getProfile() {
  return apiFetch("/profile");
}

/**
 * Update user profile details (fullName, lastName, gender, avatar, etc.)
 * PUT /api/profile
 */
export async function updateProfile(data) {
  return apiFetch("/profile", {
    method: "PUT",
    body: data,
  });
}
