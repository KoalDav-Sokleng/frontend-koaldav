import { apiFetch } from "../../../api/client";

export const getHabits = () => apiFetch("/habits");
export const createHabit = (payload) =>
  apiFetch("/habits", { method: "POST", body: payload });
export const toggleHabitDone = (id, date) =>
  apiFetch(`/habits/${id}/toggle`, { method: "POST", body: { date } });
