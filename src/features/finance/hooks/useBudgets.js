import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getBudgets,
  createBudget as createBudgetApi,
  updateBudget as updateBudgetApi,
  deleteBudget as deleteBudgetApi,
} from "../api/financeApi";

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBudgets();
      const list = Array.isArray(data) ? data : data?.budgets || [];
      setBudgets(list);
    } catch (err) {
      console.error("Failed to load budgets:", err);
      setError(err?.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(
    async (payload) => {
      const created = await createBudgetApi(payload);
      await fetchBudgets();
      return created;
    },
    [fetchBudgets]
  );

  const editBudget = useCallback(
    async (budgetId, payload) => {
      const updated = await updateBudgetApi(budgetId, payload);
      await fetchBudgets();
      return updated;
    },
    [fetchBudgets]
  );

  const removeBudget = useCallback(
    async (budgetId) => {
      const res = await deleteBudgetApi(budgetId);
      await fetchBudgets();
      return res;
    },
    [fetchBudgets]
  );

  const totalLimit = useMemo(() => {
    return budgets.reduce((acc, b) => acc + (Number(b.limitAmount) || 0), 0);
  }, [budgets]);

  const totalSpent = useMemo(() => {
    return budgets.reduce((acc, b) => acc + (Number(b.spentAmount) || 0), 0);
  }, [budgets]);

  const totalRemaining = useMemo(() => {
    return Math.max(0, totalLimit - totalSpent);
  }, [totalLimit, totalSpent]);

  const overbudgetCount = useMemo(() => {
    return budgets.filter((b) => b.isOverbudget || Number(b.spentAmount) > Number(b.limitAmount)).length;
  }, [budgets]);

  return {
    budgets,
    loading,
    error,
    totalLimit,
    totalSpent,
    totalRemaining,
    overbudgetCount,
    reload: fetchBudgets,
    addBudget,
    editBudget,
    removeBudget,
  };
}

