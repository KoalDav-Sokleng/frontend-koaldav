// src/features/goal/api/goalApi.js
import { apiFetch } from "../../../api/client";

export const getProjectGoals = () => apiFetch("/goals/projects");
export const getTrips = () => apiFetch("/goals/trips");
export const getSavingsGoals = () => apiFetch("/goals/savings");

export const createProjectGoal = (payload) =>
  apiFetch("/goals/projects", { method: "POST", body: payload });
export const createTrip = (payload) =>
  apiFetch("/goals/trips", { method: "POST", body: payload });
export const createSavingsGoal = (payload) =>
  apiFetch("/goals/savings", { method: "POST", body: payload });
