import { apiFetch } from "../../../api/client";

export async function getFinanceOverview() {
  return apiFetch("/finance/overview");
}

export async function getExpenses(params = {}) {
  return apiFetch("/finance/expenses", { params });
}

export async function createExpense(data) {
  return apiFetch("/finance/expenses", { method: "POST", data });
}

export async function deleteExpense(id) {
  return apiFetch(`/finance/expenses/${id}`, { method: "DELETE" });
}
