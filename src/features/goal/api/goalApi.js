// src/features/goal/api/goalApi.js
// import { apiFetch } from "../../../api/client";

// export const getProjectGoals = () => apiFetch("/goals/projects");
// export const getTrips = () => apiFetch("/goals/trips");
// export const getSavingsGoals = () => apiFetch("/goals/savings");

// export const createProjectGoal = (payload) =>
//   apiFetch("/goals/projects", { method: "POST", body: payload });
// export const createTrip = (payload) =>
// apiFetch("/goals/trips", { method: "POST", body: payload });
// export const createSavingsGoal = (payload) =>
// apiFetch("/goals/savings", { method: "POST", body: payload });

import { apiFetch } from "../../../api/client";

export function getProjectGoals() {
  return apiFetch("/goals/projects");
}
export function getProjectGoal(goalId) {
  return apiFetch(`/goals/projects/${goalId}`);
}
export function createProjectGoal({ title, deadline }) {
  return apiFetch("/goals/projects", { method: "POST", body: { title, deadline } });
}
export function addMilestone(goalId, { title }) {
  return apiFetch(`/goals/projects/${goalId}/milestones`, { method: "POST", body: { title } });
}

export function completeMilestone(goalId, milestoneId) {
  return apiFetch(`/goals/projects/${goalId}/milestones/${milestoneId}/complete`, { method: "PATCH" });
}

export function logFocusSession(milestoneId, { durationMinutes }) {
  return apiFetch(`/milestones/${milestoneId}/sessions`, {
    method: "POST",
    body: { durationMinutes },
  });
}