import { apiFetch } from "../../../api/client";

export async function getFinanceOverview(year) {
  const query = year ? `?year=${year}` : "";
  return apiFetch(`/finance/overview${query}`);
}

export async function getExpenses(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== "All") {
    searchParams.append("category", params.category);
  }
  if (params.year) {
    searchParams.append("year", params.year);
  }
  if (params.month) {
    searchParams.append("month", params.month);
  }
  if (params.page) {
    searchParams.append("page", params.page);
  }
  if (params.limit) {
    searchParams.append("limit", params.limit);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiFetch(`/finance/expenses${query}`);
}

export async function createExpense(data) {
  return apiFetch("/finance/expenses", { method: "POST", body: data });
}

export async function deleteExpense(id) {
  return apiFetch(`/finance/expenses/${id}`, { method: "DELETE" });
}
