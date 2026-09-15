import React from "react";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Edit2,
  Trash2,
  TrendingUp,
} from "lucide-react";

export const CATEGORY_ICONS_MAP = {
  Food: "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Bills: "💡",
  Education: "📚",
  Health: "💊",
  Other: "📦",
};

export const PERIOD_LABELS = {
  MONTHLY: "Monthly",
  WEEKLY: "Weekly",
  CUSTOM: "Custom Period",
};

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const limit = Number(budget.limitAmount || 0);
  const spent = Number(budget.spentAmount || 0);
  const remaining = Math.max(0, limit - spent);
  const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
  const isOverbudget = budget.isOverbudget || spent > limit;

  // Status color
  const statusColor = isOverbudget
    ? "#F43F5E" // Rose / Red
    : percent >= 80
      ? "#F59E0B" // Amber
      : "#10B981"; // Emerald

  const catIcon = budget.icon || CATEGORY_ICONS_MAP[budget.category] || "🎯";

  return (
    <div
      className={`rounded-2xl p-5 border transition-all flex flex-col justify-between group ${
        isOverbudget
          ? "border-rose-300 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 shadow-sm"
          : "border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm hover:shadow-md"
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: isOverbudget
                  ? "#FFE4E6"
                  : `${budget.color || "#6C63FF"}15`,
              }}
            >
              {catIcon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {budget.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]">
                  {PERIOD_LABELS[budget.period] || budget.period || "Monthly"}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {budget.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(budget)}
              title="Edit / Expand Budget"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#6C63FF] hover:bg-purple-50 dark:hover:bg-[#1E1B2E] transition-colors cursor-pointer"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => onDelete(budget)}
              title="Delete Budget"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Overbudget Warning Alert */}
        {isOverbudget && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-rose-100/70 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertTriangle size={15} className="shrink-0 text-rose-600" />
            <span className="font-semibold truncate">
              Over budget by ${(spent - limit).toFixed(2)} ({percent}%)!
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="my-3">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">
              {percent}% Used
            </span>
            <span
              style={{ color: statusColor }}
              className="font-bold tabular-nums"
            >
              ${spent.toFixed(2)} / ${limit.toFixed(2)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-[#1E1B2E] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, percent)}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1A1A24] border border-slate-100 dark:border-[#262438]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Spent
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              ${spent.toFixed(2)}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1A1A24] border border-slate-100 dark:border-[#262438]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Remaining
            </span>
            <span
              className={`text-sm font-bold tabular-nums ${
                isOverbudget
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              ${remaining.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 mt-2 border-t border-slate-100 dark:border-[#1E1B2E] flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {budget.startDate && budget.endDate
            ? `${new Date(budget.startDate).toLocaleDateString()} - ${new Date(budget.endDate).toLocaleDateString()}`
            : "Active Period"}
        </span>
        <button
          onClick={() => onEdit(budget)}
          className="font-semibold text-[#6C63FF] hover:underline cursor-pointer"
        >
          Adjust Limit
        </button>
      </div>
    </div>
  );
}
