// src/features/notification/api/notificationApi.js
import { apiFetch } from "../../../api/client";

export async function getAllNotifications(userId) {
  const query = userId ? `?userId=${userId}` : "";
  return apiFetch(`/notifications${query}`);
}

export async function getUnreadNotifications(userId) {
  const query = userId ? `?userId=${userId}` : "";
  return apiFetch(`/notifications/unread${query}`);
}

export const getGoalNotifications = getAllNotifications;

export function markAsRead(notificationId) {
  return apiFetch(`/notifications/${notificationId}/read`, { method: "PATCH" });
}

export function triggerCheck() {
  return Promise.resolve();
}