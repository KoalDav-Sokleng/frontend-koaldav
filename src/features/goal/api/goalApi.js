// src/features/goal/api/goalApi.js
// import { apiFetch } from "../../../api/client";

// export const getProjectGoals = () => apiFetch("/goals/projects");
// export const getTrips = () => apiFetch("/goals/trips");
// export const getSavingsGoals = () => apiFetch("/goals/savings");

// export const createProjectGoal = (payload) =>
//   apiFetch("/goals/projects", { method: "POST", body: payload });
// export const createTrip = (payload) =>
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

function normalizeId(value, label) {
  if (value === null || value === undefined || value === "") {
    throw new Error(`${label} is missing.`);
  }

  const numericId = Number(value);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error(`${label} must be a valid positive number.`);
  }

  return numericId;
}

export function getProjectGoals(status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiFetch(`/goals${query}`);
}

export function getProjectGoal(goalId) {
  const id = normalizeId(goalId, "Goal ID");
  return apiFetch(`/goals/${id}`);
}

export function createProjectGoal({ title, deadline }) {
  return apiFetch("/goals", { method: "POST", body: { title, deadline } });
}

export function updateProjectGoal(goalId, { title, deadline }) {
  const id = normalizeId(goalId, "Goal ID");
  return apiFetch(`/goals/${id}`, { method: "PUT", body: { title, deadline } });
}

export function deleteProjectGoal(goalId) {
  const id = normalizeId(goalId, "Goal ID");
  return apiFetch(`/goals/${id}`, { method: "DELETE" });
}

export function addMilestone(goalId, { title }) {
  const id = normalizeId(goalId, "Goal ID");
  return apiFetch(`/goals/${id}/milestones`, { method: "POST", body: { title } });
}

export function completeMilestone(goalId, milestoneId) {
  const goal = normalizeId(goalId, "Goal ID");
  const milestone = normalizeId(milestoneId, "Milestone ID");
  return apiFetch(`/goals/${goal}/milestones/${milestone}/complete`, { method: "PATCH" });
}

export function updateMilestone(goalId, milestoneId, { title }) {
  const goal = normalizeId(goalId, "Goal ID");
  const milestone = normalizeId(milestoneId, "Milestone ID");
  return apiFetch(`/goals/${goal}/milestones/${milestone}`, { method: "PUT", body: { title } });
}

export function deleteMilestone(goalId, milestoneId) {
  const goal = normalizeId(goalId, "Goal ID");
  const milestone = normalizeId(milestoneId, "Milestone ID");
  return apiFetch(`/goals/${goal}/milestones/${milestone}`, { method: "DELETE" });
}

export function logFocusSession(milestoneId, { durationMinutes }) {
  const milestone = normalizeId(milestoneId, "Milestone ID");
  return apiFetch(`/milestones/${milestone}/sessions`, {
    method: "POST",
    body: { durationMinutes },
  });
}
