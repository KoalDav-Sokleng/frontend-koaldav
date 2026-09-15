import React, { useState, useEffect } from "react";
import { X, Loader2, Check } from "lucide-react";

const CATEGORIES = [
  { id: "Food", label: "Food & Dining", icon: "🍔" },
  { id: "Transportation", label: "Transportation", icon: "🚗" },
  { id: "Shopping", label: "Shopping", icon: "🛍️" },
  { id: "Entertainment", label: "Entertainment", icon: "🎬" },
  { id: "Bills", label: "Bills & Utilities", icon: "💡" },
  { id: "Education", label: "Education", icon: "📚" },
  { id: "Health", label: "Health & Medical", icon: "💊" },
  { id: "Other", label: "Other Expenses", icon: "📦" },
];

const COLOR_OPTIONS = [
  "#6C63FF", // Indigo
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F43F5E", // Rose
];

export default function EditBudgetModal({ budget, onClose, onSubmit }) {
  const [category, setCategory] = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");
  const [period, setPeriod] = useState("MONTHLY");
  const [color, setColor] = useState("#6C63FF");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (budget) {
      setCategory(budget.category || "Food");
      setLimitAmount(String(budget.limitAmount || ""));
      setPeriod(budget.period || "MONTHLY");
      setColor(budget.color || "#6C63FF");
    }
  }, [budget]);

  if (!budget) return null;

  const selectedCatObj =
    CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const limitNum = parseFloat(limitAmount);
    if (!limitNum || limitNum <= 0) {
      setError("Please enter a valid budget limit greater than $0");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit(budget.id, {
        name: `${category} Budget`,
        category,
        limitAmount: limitNum,
        period,
        color,
        icon: selectedCatObj.icon,
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to update budget");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#12121A] rounded-2xl shadow-2xl w-full max-w-lg my-auto max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-[#1E1B2E] text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-[#1E1B2E]">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Budget
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust spending limit or settings for this category
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 flex flex-col gap-4"
        >
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Current Spent info */}
          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-[#1E1B2E]/70 border border-purple-100 dark:border-[#2A2440] flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Current Spent This Month:
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
              ${Number(budget.spentAmount || 0).toFixed(2)}
            </span>
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    category === cat.id
                      ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] shadow-sm font-bold"
                      : "border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs text-center leading-tight truncate w-full">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Limit Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Limit Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                $
              </span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 300.00"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-base font-bold border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reset Frequency
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all cursor-pointer"
            >
              <option value="MONTHLY">Monthly (Resets each month)</option>
              <option value="WEEKLY">Weekly (Resets each Monday)</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#1E1B2E] mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !limitAmount}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
