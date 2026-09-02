import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Mock / seed data (replace with real API calls once backend is connected)
// ---------------------------------------------------------------------------

const SEED_EXPENSES = [
  { id: 1, icon: "🍔", title: "Lunch", category: "Food", note: "Lunch with friends", date: "Aug 25, 2026", amount: 5.0 },
  { id: 2, icon: "🚗", title: "Grab Ride", category: "Transportation", note: "", date: "Aug 24, 2026", amount: 12.0 },
  { id: 3, icon: "🛍️", title: "New Shoes", category: "Shopping", note: "", date: "Aug 22, 2026", amount: 65.0 },
  { id: 4, icon: "🎬", title: "Movie", category: "Entertainment", note: "", date: "Aug 20, 2026", amount: 15.0 },
];

const SEED_MONTHLY = [
  { month: "Jan", amount: 320 },
  { month: "Feb", amount: 410 },
  { month: "Mar", amount: 280 },
  { month: "Apr", amount: 520 },
  { month: "May", amount: 390 },
  { month: "Jun", amount: 300 },
  { month: "Jul", amount: 350 },
  { month: "Aug", amount: 430 },
];

const SEED_CATEGORIES = [
  { name: "Food",           value: 180, color: "#6C63FF", icon: "🍔" },
  { name: "Shopping",       value: 120, color: "#9C8FFF", icon: "🛍️" },
  { name: "Transportation", value: 70,  color: "#C4BEFF", icon: "🚗" },
  { name: "Entertainment",  value: 40,  color: "#DDD9FF", icon: "🎬" },
  { name: "Other",          value: 20,  color: "#EDE9FE", icon: "📦" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CATEGORY_ICONS = {
  Food: "🍔", Transportation: "🚗", Shopping: "🛍️",
  Entertainment: "🎬", Bills: "💡", Education: "📚", Health: "💊", Other: "📦",
};

function categoryIcon(cat) {
  return CATEGORY_ICONS[cat] ?? "💸";
}

function formatDisplayDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFinanceOverview() {
  const [expenses, setExpenses] = useState(SEED_EXPENSES);
  const monthlyData = SEED_MONTHLY;
  const categoryData = SEED_CATEGORIES;

  const addExpense = useCallback((form) => {
    const next = {
      id: Date.now(),
      icon: categoryIcon(form.category),
      title: form.title,
      category: form.category,
      note: form.description || "",
      date: formatDisplayDate(form.date),
      amount: parseFloat(form.amount) || 0,
    };
    setExpenses((prev) => [next, ...prev]);
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { expenses, monthlyData, categoryData, addExpense, removeExpense };
}
