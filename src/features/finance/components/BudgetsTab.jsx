import React, { useState } from "react";
import {
  Plus,
  PiggyBank,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import BudgetCard from "./BudgetCard";
import CreateBudgetModal from "./CreateBudgetModal";
import EditBudgetModal from "./EditBudgetModal";
import { useBudgets } from "../hooks/useBudgets";

export default function BudgetsTab() {
  const {
    budgets,
    loading,
    totalLimit,
    totalSpent,
    totalRemaining,
    overbudgetCount,
    reload,
    addBudget,
    editBudget,
    removeBudget,
  } = useBudgets();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const handleDeleteBudget = async (budget) => {
    const result = await Swal.fire({
      icon: "question",
      title: `Delete ${budget.category || budget.name} Budget?`,
      html: `
        <div style="font-size: 13px; line-height: 1.5; color: #334155;">
          <p>Are you sure you want to delete this budget goal?</p>
          <p style="margin-top: 6px; color: #64748B;">Your past expenses will stay intact and won't be deleted.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (result.isConfirmed) {
      try {
        await removeBudget(budget.id);
        Swal.fire({
          icon: "success",
          title: "Budget Deleted",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err?.message || "Could not delete budget",
          confirmButtonColor: "#6C63FF",
        });
      }
    }
  };

  const overallPercentage =
    totalLimit > 0
      ? Math.min(100, Math.round((totalSpent / totalLimit) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total Budget Cap */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Total Budget Cap
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
              $
              {totalLimit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Across {budgets.length} categor
              {budgets.length !== 1 ? "ies" : "y"}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
            <PiggyBank size={22} />
          </div>
        </div>

        {/* Total Spent */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Total Spent
            </p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
              $
              {totalSpent.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {overallPercentage}% of total limit used
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
            <span className="text-lg font-bold">%</span>
          </div>
        </div>

        {/* Total Remaining */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Remaining Budget
            </p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
              $
              {totalRemaining.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
              <CheckCircle2 size={13} /> Available cushion
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Overbudget count */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12121A] border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Over Budget Alerts
            </p>
            <p
              className={`text-2xl font-extrabold tabular-nums mt-1 ${
                overbudgetCount > 0
                  ? "text-rose-500"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {overbudgetCount}{" "}
              {overbudgetCount === 1 ? "Category" : "Categories"}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {overbudgetCount > 0
                ? "Spending exceeded cap"
                : "All categories in green"}
            </p>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              overbudgetCount > 0
                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
            }`}
          >
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Budgets List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Budgets
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Spending limits per category to maintain healthy financial goals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              title="Refresh budgets"
              className="p-2 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-500 hover:text-[#6C63FF] transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Set New Budget</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#6C63FF]" />
            <p className="text-xs font-medium">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="py-16 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-[#2A2A38] flex flex-col items-center justify-center text-center gap-3 bg-white/50 dark:bg-[#12121A]/50">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                No Budgets Defined
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Set monthly spending limits for categories like Food, Bills,
                Shopping, and Entertainment to avoid overspending.
              </p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm transition-all"
            >
              <Plus size={15} />
              <span>Create First Budget</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                onEdit={(item) => setEditTarget(item)}
                onDelete={(item) => handleDeleteBudget(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {createOpen && (
        <CreateBudgetModal
          onClose={() => setCreateOpen(false)}
          onSubmit={addBudget}
        />
      )}

      {editTarget && (
        <EditBudgetModal
          budget={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={editBudget}
        />
      )}
    </div>
  );
}
