import { apiFetch } from "./client";
import type { CreateSavingGoalRequest, DepositRequest, Id, SavingGoalResponse } from "./types";

export const savingGoalService = {
  list: () => apiFetch<SavingGoalResponse[]>("/api/saving-goals"),
  create: (body: CreateSavingGoalRequest) => apiFetch<SavingGoalResponse>("/api/saving-goals", { method: "POST", body: JSON.stringify(body) }),
  deposit: (id: Id, body: DepositRequest) => apiFetch<SavingGoalResponse>(`/api/saving-goals/${id}/deposit`, { method: "POST", body: JSON.stringify(body) }),
};

export default savingGoalService;
