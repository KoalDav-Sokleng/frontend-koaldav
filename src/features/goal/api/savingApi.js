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

/**
 * Fetch all saving goals
 * GET /api/saving-goals
 */
export function getSavingGoals() {
  return apiFetch("/saving-goals");
}

/**
 * Fetch a single saving goal by ID
 * GET /api/saving-goals/{id}
 */
export function getSavingGoalById(id) {
  const goalId = normalizeId(id, "Saving Goal ID");
  return apiFetch(`/saving-goals/${goalId}`);
}

/**
 * Create a new saving goal
 * POST /api/saving-goals
 */
export function createSavingGoal(data) {
  const payload = {
    title: data.title?.trim(),
    icon: data.icon || "piggy",
    targetAmount: Number(data.targetAmount) || 0,
    currentAmount: Number(data.currentAmount) || 0,
    deadline: data.deadline || null,
    description: data.description?.trim() || "",
  };
  return apiFetch("/saving-goals", {
    method: "POST",
    body: payload,
  });
}

/**
 * Update an existing saving goal
 * PUT /api/saving-goals/{id}
 */
export function updateSavingGoal(id, data) {
  const goalId = normalizeId(id, "Saving Goal ID");
  const payload = {
    title: data.title?.trim(),
    icon: data.icon,
    targetAmount: data.targetAmount !== undefined ? Number(data.targetAmount) : undefined,
    currentAmount: data.currentAmount !== undefined ? Number(data.currentAmount) : undefined,
    deadline: data.deadline !== undefined ? data.deadline : undefined,
    description: data.description !== undefined ? data.description?.trim() : undefined,
  };
  return apiFetch(`/saving-goals/${goalId}`, {
    method: "PUT",
    body: payload,
  });
}

/**
 * Delete a saving goal
 * DELETE /api/saving-goals/{id}
 */
export function deleteSavingGoal(id) {
  const goalId = normalizeId(id, "Saving Goal ID");
  return apiFetch(`/saving-goals/${goalId}`, {
    method: "DELETE",
  });
}

/**
 * Add a deposit to a saving goal
 * POST /api/saving-goals/{goalId}/deposits
 */
export function addSavingDeposit(goalId, depositData) {
  const id = normalizeId(goalId, "Saving Goal ID");
  const payload = {
    title: depositData.title?.trim() || "One-time Deposit",
    date: depositData.date || new Date().toISOString().slice(0, 10),
    source: depositData.source?.trim() || "Bank Account",
    amount: Number(depositData.amount) || 0,
    notes: depositData.notes?.trim() || "",
  };
  return apiFetch(`/saving-goals/${id}/deposits`, {
    method: "POST",
    body: payload,
  });
}

