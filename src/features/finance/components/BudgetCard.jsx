import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  TrendingUp,
} from "lucide-react";

export const BUDGET_ICONS = {
  Food: "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Bills: "💡",
  Education: "📚",
  Health: "💊",
  Other: "📦",
};

export default function BudgetCard({ budget, onEdit, onDelete }) {
  const limit = Number(budget.limitAmount || 0);
  const spent = Number(budget.spentAmount || 0);
  const remaining = Math.max(0, limit - spent);
  const percentage =
    limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const isOver = spent > limit;
  const isNear = !isOver && percentage >= 80;
  const color = budget.color || "#6C63FF";
  const icon = budget.icon || BUDGET_ICONS[budget.category] || "🎯";

  return (
    <div
      className="relative rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col justify-between"
      style={{
        borderTop: `4px solid ${isOver ? "#EF4444" : isNear ? "#F59E0B" : color}`,
      }}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-xl transition-transform group-hover:scale-105"
              style={{
                backgroundColor: `${color}18`,
              }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {budget.category || budget.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {budget.period || "Monthly"} Budget
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(budget)}
                title="Edit Budget"
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#6C63FF] hover:bg-purple-50 dark:hover:bg-[#1E1B2E] transition-all cursor-pointer"
              >
                <Edit2 size={14} />
              </button>
            )}
            <button
              onClick={() => onDelete(budget)}
              title="Delete Budget"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Status badges */}
        <div className="mb-3">
          {isOver ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              <AlertTriangle size={12} /> Over Budget by $
              {(spent - limit).toFixed(2)}
            </span>
          ) : isNear ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
              <TrendingUp size={12} /> {percentage}% Spent (Near Limit)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
              <CheckCircle2 size={12} /> On Track ({percentage}%)
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Spent:{" "}
              <strong className="text-slate-900 dark:text-white">
                ${spent.toFixed(2)}
              </strong>
            </span>
            <span className="text-slate-400 dark:text-slate-500">
              Cap: ${limit.toFixed(2)}
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#1E1B2E] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (spent / (limit || 1)) * 100)}%`,
                backgroundColor: isOver
                  ? "#EF4444"
                  : isNear
                    ? "#F59E0B"
                    : color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Remaining footer */}
      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1E1B2E] flex items-center justify-between text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-medium">
          Remaining
        </span>
        <span
          className={`font-bold tabular-nums ${
            isOver
              ? "text-rose-500 dark:text-rose-400"
              : "text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {isOver
            ? `-$${(spent - limit).toFixed(2)}`
            : `$${remaining.toFixed(2)}`}
        </span>
      </div>
    </div>
  );
}
