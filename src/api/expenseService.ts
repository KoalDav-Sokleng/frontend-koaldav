import { apiFetch } from "./client";
import type { CreateExpenseRequest, ExpenseOverviewResponse, ExpenseQuery, ExpenseResponse } from "./types";

export const expenseService = {
  list: (query: ExpenseQuery = {}) => {
    const params = new URLSearchParams();
    if (query.category) params.set("category", query.category);
    if (query.month !== undefined) params.set("month", String(query.month));
    if (query.year !== undefined) params.set("year", String(query.year));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return apiFetch<ExpenseResponse[]>(`/api/expenses${suffix}`);
  },
  create: (body: CreateExpenseRequest) => apiFetch<ExpenseResponse>("/api/expenses", { method: "POST", body: JSON.stringify(body) }),
  overview: () => apiFetch<ExpenseOverviewResponse>("/api/expenses/overview"),
};

export default expenseService;
