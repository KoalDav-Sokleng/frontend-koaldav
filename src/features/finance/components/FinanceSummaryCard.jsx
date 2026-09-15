import React from "react";
import {
  Wallet,
  PiggyBank,
  TrendingDown,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

export default function FinanceSummaryCard({
  totalBalance = 0,
  totalBudget = 0,
  totalSpent = 0,
  overbudgetCount = 0,
  onNavigateTab,
}) {
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const budgetUsage =
    totalBudget > 0
      ? Math.min(100, Math.round((totalSpent / totalBudget) * 100))
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Wallet Balance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total Net Balance
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
            <Wallet size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            $
            {Number(totalBalance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Across all active wallets
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("wallets")}
                className="text-[11px] font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Wallets <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Total Monthly Expense */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Spent This Month
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <TrendingDown size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-rose-500 dark:text-rose-400 tabular-nums tracking-tight">
            $
            {Number(totalSpent || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Recorded transactions
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("expenses")}
                className="text-[11px] font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                History <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Monthly Budget Limit */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Monthly Budget Cap
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <PiggyBank size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            $
            {Number(totalBudget || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              ${remainingBudget.toFixed(2)} remaining ({budgetUsage}%)
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("budgets")}
                className="text-[11px] font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Budgets <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Budget Status / Overbudget Alerts */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Budget Health
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              overbudgetCount > 0
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="mt-3">
          <div
            className={`text-2xl font-extrabold tabular-nums tracking-tight ${
              overbudgetCount > 0
                ? "text-rose-500 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {overbudgetCount > 0 ? `${overbudgetCount} Over Budget` : "Healthy"}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {overbudgetCount > 0
                ? "Review exceeding caps"
                : "All caps in green"}
            </span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab("budgets")}
                className="text-[11px] font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Manage <ArrowUpRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
