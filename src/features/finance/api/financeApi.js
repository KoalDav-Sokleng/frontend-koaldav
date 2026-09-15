import { apiFetch } from "../../../api/client";

/* ------------------------------------------------------------------ */
/* 1. Overview                                                        */
/* ------------------------------------------------------------------ */
export async function getFinanceOverview(year) {
  const query = year ? `?year=${year}` : "";
  return apiFetch(`/finance/overview${query}`);
}

/* ------------------------------------------------------------------ */
/* 2. Wallets (/api/finance/wallets)                                  */
/* ------------------------------------------------------------------ */
export async function getWallets() {
  return apiFetch("/finance/wallets");
}

export async function getWalletById(walletId) {
  return apiFetch(`/finance/wallets/${walletId}`);
}

export async function createWallet(data) {
  return apiFetch("/finance/wallets", {
    method: "POST",
    body: data,
  });
}

export async function updateWallet(walletId, data) {
  return apiFetch(`/finance/wallets/${walletId}`, {
    method: "PUT",
    body: data,
  });
}

export async function depositToWallet(walletId, data) {
  return apiFetch(`/finance/wallets/${walletId}/deposit`, {
    method: "POST",
    body: data,
  });
}

export async function deleteWallet(walletId) {
  return apiFetch(`/finance/wallets/${walletId}`, {
    method: "DELETE",
  });
}

/* ------------------------------------------------------------------ */
/* 3. Budgets (/api/finance/budgets)                                  */
/* ------------------------------------------------------------------ */
export async function getBudgets() {
  return apiFetch("/finance/budgets");
}

export async function getBudgetById(budgetId) {
  return apiFetch(`/finance/budgets/${budgetId}`);
}

export async function createBudget(data) {
  return apiFetch("/finance/budgets", {
    method: "POST",
    body: data,
  });
}

export async function updateBudget(budgetId, data) {
  return apiFetch(`/finance/budgets/${budgetId}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteBudget(budgetId) {
  return apiFetch(`/finance/budgets/${budgetId}`, {
    method: "DELETE",
  });
}

/* ------------------------------------------------------------------ */
/* 4. Expenses (/api/finance/expenses)                                */
/* ------------------------------------------------------------------ */
export async function getExpenses(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.category && params.category !== "All") {
    searchParams.append("category", params.category);
  }
  if (params.year) {
    searchParams.append("year", params.year);
  }
  if (params.month && params.month !== "All") {
    searchParams.append("month", params.month);
  }
  if (params.page !== undefined && params.page !== null) {
    searchParams.append("page", params.page);
  }
  if (params.limit !== undefined && params.limit !== null) {
    searchParams.append("limit", params.limit);
  }
  if (params.walletId) {
    searchParams.append("walletId", params.walletId);
  }
  if (params.budgetId) {
    searchParams.append("budgetId", params.budgetId);
  }

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiFetch(`/finance/expenses${query}`);
}

export async function createExpense(data) {
  return apiFetch("/finance/expenses", {
    method: "POST",
    body: data,
  });
}

export async function deleteExpense(id) {
  return apiFetch(`/finance/expenses/${id}`, {
    method: "DELETE",
  });
}
