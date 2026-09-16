import { apiFetch } from "./client";
import type { CreateHabitRequest, GardenFreezeRequest, GardenResponse, HabitResponse, Id, ToggleHabitRequest } from "./types";

export const habitGardenService = {
  listHabits: () => apiFetch<HabitResponse[]>("/api/habits"),
  createHabit: (body: CreateHabitRequest) => apiFetch<HabitResponse>("/api/habits", { method: "POST", body: JSON.stringify(body) }),
  toggleHabit: (id: Id, body: ToggleHabitRequest) => apiFetch<HabitResponse>(`/api/habits/${id}/toggle`, { method: "POST", body: JSON.stringify(body) }),
  deleteHabit: (id: Id) => apiFetch<void>(`/api/habits/${id}`, { method: "DELETE" }),
  getGarden: () => apiFetch<GardenResponse>("/api/garden"),
  useFreeze: (body: GardenFreezeRequest) => apiFetch<GardenResponse>("/api/garden/freeze", { method: "POST", body: JSON.stringify(body) }),
};

export default habitGardenService;
