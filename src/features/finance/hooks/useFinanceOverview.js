import { useState, useEffect, useCallback } from "react";
import {
  getFinanceOverview,
  getExpenses,
  createExpense as createExpenseApi,
  deleteExpense as deleteExpenseApi,
} from "../api/financeApi";

const DEFAULT_MONTHLY = [
  { month: "Jan", amount: 0 },
  { month: "Feb", amount: 0 },
  { month: "Mar", amount: 0 },
  { month: "Apr", amount: 0 },
  { month: "May", amount: 0 },
  { month: "Jun", amount: 0 },
  { month: "Jul", amount: 0 },
  { month: "Aug", amount: 0 },
  { month: "Sep", amount: 0 },
  { month: "Oct", amount: 0 },
  { month: "Nov", amount: 0 },
  { month: "Dec", amount: 0 },
];

export function useFinanceOverview(year = 2026, categoryFilter = "All") {
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState(DEFAULT_MONTHLY);
  const [categoryData, setCategoryData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, expensesRes] = await Promise.all([
        getFinanceOverview(year),
        getExpenses({ year, category: categoryFilter, limit: 100 }),
      ]);

      if (overviewRes) {
        setMonthlyData(overviewRes.monthlyData || DEFAULT_MONTHLY);
        setCategoryData(overviewRes.categoryData || []);
        setTotalAmount(overviewRes.totalAmount || 0);
      }

      if (expensesRes) {
        setExpenses(
          Array.isArray(expensesRes.expenses)
            ? expensesRes.expenses
            : Array.isArray(expensesRes)
            ? expensesRes
            : []
        );
      }
    } catch (err) {
      console.error("Failed to load finance overview:", err);
      setError(err?.message || "Failed to load finance data");
    } finally {
      setLoading(false);
    }
  }, [year, categoryFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addExpense = useCallback(
    async (form) => {
      const payload = {
        title: form.title,
        amount: parseFloat(form.amount) || 0,
        category: form.category,
        date: form.date,
        note: form.description || form.note || "",
        ...(form.walletId ? { walletId: Number(form.walletId) } : {}),
        ...(form.budgetId ? { budgetId: Number(form.budgetId) } : {}),
      };

      const created = await createExpenseApi(payload);
      await loadData();
      return created;
    },
    [loadData]
  );

  const removeExpense = useCallback(
    async (id) => {
      await deleteExpenseApi(id);
      await loadData();
    },
    [loadData]
  );

  return {
    expenses,
    monthlyData,
    categoryData,
    totalAmount,
    loading,
    error,
    reload: loadData,
    addExpense,
    removeExpense,
  };
}
