import { apiFetch } from "./client";
import type { CreateGoalRequest, CreateMilestoneRequest, FocusSessionRequest, GoalResponse, Id, MilestoneResponse } from "./types";

export const goalService = {
  list: () => apiFetch<GoalResponse[]>("/api/goals"),
  get: (id: Id) => apiFetch<GoalResponse>(`/api/goals/${id}`),
  create: (body: CreateGoalRequest) => apiFetch<GoalResponse>("/api/goals", { method: "POST", body: JSON.stringify(body) }),
  addMilestone: (goalId: Id, body: CreateMilestoneRequest) =>
    apiFetch<MilestoneResponse>(`/api/goals/${goalId}/milestones`, { method: "POST", body: JSON.stringify(body) }),
  completeMilestone: (goalId: Id, milestoneId: Id) =>
    apiFetch<MilestoneResponse>(`/api/goals/${goalId}/milestones/${milestoneId}/complete`, { method: "PATCH" }),
  recordSession: (milestoneId: Id, body: FocusSessionRequest) =>
    apiFetch<MilestoneResponse>(`/api/milestones/${milestoneId}/sessions`, { method: "POST", body: JSON.stringify(body) }),
};

export default goalService;
