// src/features/notification/api/notificationApi.js
import { apiFetch } from "../../../api/client";

export async function getAllNotifications() {
  return apiFetch("/notifications");
}

export async function getUnreadNotifications() {
  return apiFetch("/notifications/unread");
}

export function markAsRead(notificationId) {
  return apiFetch(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

export function triggerCheck() {
  return Promise.resolve();
}