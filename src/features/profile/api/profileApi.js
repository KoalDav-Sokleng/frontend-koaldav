import { apiFetch } from "../../../api/client";

/**
 * Fetch current user profile
 * GET /api/profile
 */
export async function getProfile() {
  return apiFetch("/api/profile");
}

/**
 * Update user profile details
 * PUT /api/profile
 * JSON body: { firstName, lastName, avatar }
 */
export async function updateProfile(data) {
  return apiFetch("/api/profile", {
    method: "PUT",
    body: data,
  });
}

/**
 * Upload profile image
 * POST /api/profile/image
 * multipart/form-data with field name "file"
 */
export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/api/profile/image", {
    method: "POST",
    body: formData,
  });
}

/**
 * Delete profile image
 * DELETE /api/profile/image
 */
export async function deleteProfileImage() {
  return apiFetch("/api/profile/image", {
    method: "DELETE",
  });
}
