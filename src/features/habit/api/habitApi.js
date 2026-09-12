import { apiFetch } from "../../../api/client";

export const getHabits = () => apiFetch("/api/habits");
export const createHabit = (payload) =>
  apiFetch("/api/habits", { method: "POST", body: payload });
export const toggleHabitDone = (id, date) =>
  apiFetch(`/api/habits/${id}/toggle`, { method: "POST", body: { date } });
