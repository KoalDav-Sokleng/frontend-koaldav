import React, { useState } from "react";
import { X, Target, Loader2, Check } from "lucide-react";
import { CATEGORY_ICONS_MAP } from "./BudgetCard";

const CATEGORIES = [
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills",
  "Education",
  "Health",
  "Other",
];

const PERIOD_OPTIONS = [
  { id: "MONTHLY", label: "Monthly", desc: "Renews each calendar month" },
  { id: "WEEKLY", label: "Weekly", desc: "Renews every 7 days" },
  { id: "CUSTOM", label: "Custom Range", desc: "Set custom start & end date" },
];

const COLOR_OPTIONS = [
  "#6C63FF", // Purple
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F43F5E", // Rose
];

export default function CreateBudgetModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");
  const [period, setPeriod] = useState("MONTHLY");
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .slice(0, 10),
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10),
  );
  const [color, setColor] = useState("#6C63FF");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a budget name");
      return;
    }
    const limitNum = parseFloat(limitAmount);
    if (!limitNum || limitNum <= 0) {
      setError("Please enter a valid budget limit greater than 0");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await onSubmit({
        name: name.trim(),
        category,
        limitAmount: limitNum,
        period,
        startDate: period === "CUSTOM" ? startDate : null,
        endDate: period === "CUSTOM" ? endDate : null,
        icon: CATEGORY_ICONS_MAP[category] || "🎯",
        color,
      });
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to create budget");
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Create Spending Budget
              </h2>
              <p className="text-xs text-slate-400">
                Set a cap to guard your monthly and weekly expenses
              </p>
            </div>
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

          {/* Budget Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Budget Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly Grocery Cap, Dining Out, Travel Limit"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] transition-all"
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    if (!name || CATEGORIES.includes(name)) {
                      setName(`${cat} Budget`);
                    }
                  }}
                  className={`p-2 rounded-xl text-left border flex items-center gap-2 transition-all cursor-pointer ${
                    category === cat
                      ? "border-[#6C63FF] bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] font-bold"
                      : "border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  <span className="text-base">{CATEGORY_ICONS_MAP[cat]}</span>
                  <span className="text-xs truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Limit Amount & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Budget Limit ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="300.00"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  className="w-full pl-7 pr-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-[#2A2A38] bg-slate-50/50 dark:bg-[#1A1A24] text-slate-900 dark:text-white focus:outline-none focus:border-[#6C63FF] transition-all cursor-pointer"
              >
                {PERIOD_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Date Range if Period === CUSTOM */}
          {period === "CUSTOM" && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A24] border border-slate-100 dark:border-[#2A2A38]">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#12121A] text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#12121A] text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Color theme */}
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
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              <span>Create Budget</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
