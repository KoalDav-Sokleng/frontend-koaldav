import React, { useState } from "react";
import {
  Target,
  Plus,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  PieChart as PieIcon,
  CheckCircle2,
} from "lucide-react";
import BudgetCard from "./BudgetCard";
import CreateBudgetModal from "./CreateBudgetModal";
import EditBudgetModal from "./EditBudgetModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function BudgetsTab({
  budgets,
  loading,
  error,
  totalLimit,
  totalSpent,
  totalRemaining,
  overbudgetCount,
  reload,
  onAddBudget,
  onEditBudget,
  onRemoveBudget,
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingBudget, setDeletingBudget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const overallPercent =
    totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  const handleDeleteConfirm = async () => {
    if (!deletingBudget) return;
    setDeleteLoading(true);
    try {
      await onRemoveBudget(deletingBudget.id);
      setDeletingBudget(null);
    } catch (err) {
      console.error("Failed to delete budget:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budgeted */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Budgeted
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            $
            {totalLimit.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Across {budgets.length} spending caps
          </p>
        </div>

        {/* Total Spent */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Spent
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            $
            {totalSpent.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {overallPercent}% of total allocation
          </p>
        </div>

        {/* Total Remaining */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Remaining Cushion
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
            $
            {totalRemaining.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            Available to spend safely
          </p>
        </div>

        {/* Overbudget Alert Card */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Budget Status
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                overbudgetCount > 0
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              }`}
            >
              <AlertTriangle size={16} />
            </div>
          </div>
          <p
            className={`text-2xl font-extrabold tabular-nums tracking-tight ${
              overbudgetCount > 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {overbudgetCount > 0 ? `${overbudgetCount} Over Limit` : "On Track"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {overbudgetCount > 0
              ? "Exceeded budget caps!"
              : "All categories healthy"}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between">
          <span>Failed to load budgets: {String(error)}</span>
          <button onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Active Category Budgets
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live spending progress against your defined caps
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reload}
              title="Refresh budgets"
              className="p-2 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-500 hover:text-[#6C63FF] transition-colors cursor-pointer"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus size={15} />
              <span>Create Budget</span>
            </button>
          </div>
        </div>

        {loading && budgets.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#6C63FF]" />
            <p className="text-xs font-semibold">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          /* Empty state */
          <div className="p-10 rounded-3xl border-2 border-dashed border-slate-200 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#F4F2FF] dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center mb-3">
              <Target size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Budgets Created
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
              Create monthly spending limits for Groceries, Dining Out,
              Entertainment, or Bills to stay on top of your financial goals.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Create First Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={(b) => setEditingBudget(b)}
                onDelete={(b) => setDeletingBudget(b)}
              />
            ))}

            {/* Quick Add Budget Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="border-2 border-dashed border-slate-200 dark:border-[#1E1B2E] hover:border-[#6C63FF] dark:hover:border-[#6C63FF] rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all hover:bg-purple-50/30 dark:hover:bg-[#1A1A24] min-h-[190px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
                <Plus size={20} />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Add Another Budget
              </p>
              <p className="text-[11px] text-slate-400 text-center max-w-[170px]">
                Create a budget for custom period or category
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateBudgetModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={onAddBudget}
        />
      )}

      {editingBudget && (
        <EditBudgetModal
          budget={editingBudget}
          onClose={() => setEditingBudget(null)}
          onSubmit={onEditBudget}
        />
      )}

      {deletingBudget && (
        <DeleteConfirmModal
          title={`Delete "${deletingBudget.name}"?`}
          message="Are you sure you want to delete this budget limit? Past recorded expenses will remain intact."
          loading={deleteLoading}
          onClose={() => setDeletingBudget(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
