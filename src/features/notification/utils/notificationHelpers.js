// src/features/notification/utils/notificationHelpers.js

// Backend sends daysLeft as a number (already computed server-side).
export function formatDaysLeft(daysLeft) {
  return `${Math.max(0, Number(daysLeft) || 0)} days left`;
}

// Backend sends deadline as an ISO date string (e.g. "2026-09-01").
export function formatDueDate(dateStr) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}