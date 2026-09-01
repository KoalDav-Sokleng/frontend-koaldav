// src/features/notification/utils/notificationHelpers.js
import { Target, PiggyBank, Plane, HelpCircle } from "lucide-react";

// Backend sends daysLeft as a number (already computed server-side).
export function formatDaysLeft(daysLeft) {
  const count = Number(daysLeft) || 0;
  if (count <= 0) return "Due today / overdue";
  if (count === 1) return "1 day left";
  return `${count} days left`;
}

// Backend sends deadline as an ISO date string (e.g. "2026-09-01").
export function formatDueDate(dateStr) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns metadata (icon, label, styling, route) for a given goalType
 * Supported goalType values: "PROJECT", "SAVING", "TRIP"
 */
export function getGoalTypeMeta(goalType) {
  const normalized = (goalType || "PROJECT").toUpperCase();
  switch (normalized) {
    case "SAVING":
      return {
        label: "Saving Goal",
        type: "SAVING",
        icon: PiggyBank,
        routeBase: "/goal/saving",
        badgeBg: "bg-purple-100 text-purple-700 border-purple-200",
        iconBg: "bg-purple-50 text-purple-600",
        accentColor: "#7C3AED",
      };
    case "TRIP":
      return {
        label: "Trip Goal",
        type: "TRIP",
        icon: Plane,
        routeBase: "/goal/trip",
        badgeBg: "bg-sky-100 text-sky-700 border-sky-200",
        iconBg: "bg-sky-50 text-sky-600",
        accentColor: "#0284C7",
      };
    case "PROJECT":
      return {
        label: "Project Goal",
        type: "PROJECT",
        icon: Target,
        routeBase: "/goal",
        badgeBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
        iconBg: "bg-indigo-50 text-indigo-600",
        accentColor: "#4F46E5",
      };
    default:
      return {
        label: goalType || "Goal",
        type: normalized,
        icon: HelpCircle,
        routeBase: "/goal",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        iconBg: "bg-slate-50 text-slate-600",
        accentColor: "#64748B",
      };
  }
}

/**
 * Returns the navigation destination for a notification based on its goalType
 */
export function getNotificationRoute(notification) {
  if (!notification) return "/goal";
  const goalType = (notification.goalType || "PROJECT").toUpperCase();
  const goalId = notification.goalId;

  switch (goalType) {
    case "PROJECT":
      return goalId ? `/goal?goalId=${goalId}` : "/goal";
    case "SAVING":
      return goalId ? `/goal/saving?goalId=${goalId}` : "/goal/saving";
    case "TRIP":
      return goalId ? `/goal/trip?goalId=${goalId}` : "/goal/trip";
    default:
      return "/goal";
  }
}