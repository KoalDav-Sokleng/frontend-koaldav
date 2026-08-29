// src/features/notification/api/notificationApi.js
import { apiFetch } from "../../../api/client";

export function getAllNotifications(userId = 1) {
  return apiFetch(`/notifications?userId=${userId}`);
}

export function getUnreadNotifications(userId = 1) {
  return apiFetch(`/notifications/unread?userId=${userId}`);
}

export function markAsRead(notificationId) {
  return apiFetch(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

export function triggerCheck() {
  return apiFetch("/notifications/trigger-check", { method: "POST" });
}