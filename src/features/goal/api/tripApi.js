// src/features/goal/api/tripApi.js
import { apiFetch } from "../../../api/client";

function buildFormData(data) {
  if (data instanceof FormData) {
    return data;
  }
  const formData = new FormData();
  if (data.name) formData.append("name", data.name.trim());
  if (data.description) formData.append("description", data.description.trim());
  if (data.target) formData.append("target", data.target);
  if (data.deadline) formData.append("deadline", data.deadline);
  if (data.type) formData.append("type", data.type);

  // If a physical File object was selected
  if (data.file instanceof File) {
    formData.append("file", data.file);
  }
  // If a URL was pasted
  else if (data.imageUrl) {
    formData.append("imageUrl", data.imageUrl.trim());
  }
  return formData;
}

export async function getTripGoals() {
  return apiFetch("/trips");
}

export async function getTripGoal(id) {
  return apiFetch(`/trips/${id}`);
}

export async function createTripGoal(data) {
  const formData = buildFormData(data);
  return apiFetch("/trips", {
    method: "POST",
    body: formData,
  });
}

export async function updateTripGoal(id, data) {
  const formData = buildFormData(data);
  return apiFetch(`/trips/${id}`, {
    method: "PUT",
    body: formData,
  });
}

export async function depositTripGoal(id, amount) {
  return apiFetch(`/trips/${id}/deposit`, {
    method: "POST",
    body: { amount: Number(amount) },
  });
}

export async function deleteTripGoal(id) {
  return apiFetch(`/trips/${id}`, {
    method: "DELETE",
  });
}