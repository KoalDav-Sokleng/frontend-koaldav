import React, { useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Filter,
  Trash2,
  Wallet,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const FILTER_PILLS = [
  "All",
  "Food",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills",
  "Education",
  "Health",
  "Other",
];

const CATEGORY_ICONS = {
  Food: "🍔",
  Transportation: "🚗",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Bills: "💡",
  Education: "📚",
  Health: "💊",
  Other: "📦",
};

function formatDisplayDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function ExpensesTab({
  expenses = [],
  loading,
  error,
  activeFilter,
  onFilterChange,
  reload,
  onAddExpense,
  onRemoveExpense,
  wallets = [],
  budgets = [],
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Search filtering
  const filteredExpenses = expenses.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.note && item.note.toLowerCase().includes(q)) ||
      (item.walletName && item.walletName.toLowerCase().includes(q))
    );
  });

  const INITIAL_LIMIT = 10;
  const visibleExpenses = showAll
    ? filteredExpenses
    : filteredExpenses.slice(0, INITIAL_LIMIT);
  const hasMore = filteredExpenses.length > INITIAL_LIMIT;

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    setDeleteLoading(true);
    try {
      await onRemoveExpense(deletingExpense.id);
      setDeletingExpense(null);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Card */}
      <div className="rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Expense Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed record of all outgoings, categorized and tracked
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={reload}
            title="Refresh list"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-500 hover:text-[#6C63FF] transition-colors cursor-pointer"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#5B52E6] text-white text-xs font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                onFilterChange(pill);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === pill
                  ? "bg-[#6C63FF] text-white shadow-sm"
                  : "bg-white dark:bg-[#1A1A24] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#262438] hover:bg-slate-50 dark:hover:bg-[#222033]"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF] transition-all"
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between">
          <span>Failed to load expenses: {String(error)}</span>
          <button onClick={reload} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Expense List Card */}
      <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1E1B2E] text-xs font-bold text-slate-400">
          <span>TRANSACTION DETAILS</span>
          <span>AMOUNT</span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100 dark:divide-[#1E1B2E]">
          {loading && expenses.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw size={20} className="animate-spin text-[#6C63FF]" />
              <p className="text-xs">Loading recorded expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400 text-center">
              <span className="text-3xl">💸</span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                No expenses found
              </p>
              <p className="text-xs max-w-xs">
                {searchTerm
                  ? "Try changing your search query or filter"
                  : "Click 'Add Expense' above to record a new transaction"}
              </p>
            </div>
          ) : (
            <>
              {visibleExpenses.map((exp) => {
                const icon = exp.icon || CATEGORY_ICONS[exp.category] || "💸";
                const displayDate = formatDisplayDate(exp.date);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center py-4 gap-4 group hover:bg-purple-50/40 dark:hover:bg-[#1A1A26] -mx-5 px-5 transition-colors rounded-xl"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl bg-[#F4F2FF] dark:bg-[#1A1A26]">
                      {icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {exp.title}
                        </p>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]">
                          {exp.category}
                        </span>
                        {exp.walletName && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
                            <Wallet size={10} /> {exp.walletName}
                          </span>
                        )}
                        {exp.budgetName && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                            <Target size={10} /> {exp.budgetName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{displayDate}</span>
                        {exp.note && (
                          <>
                            <span>•</span>
                            <span
                              className="truncate max-w-sm"
                              title={exp.note}
                            >
                              {exp.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Amount & Delete */}
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-sm font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
                        -${Number(exp.amount || 0).toFixed(2)}
                      </p>
                      <button
                        onClick={() => setDeletingExpense(exp)}
                        title="Delete expense"
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {hasMore && (
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:bg-purple-50 dark:hover:bg-[#1E1B2E] transition-all cursor-pointer border border-slate-200 dark:border-[#262438]"
                  >
                    <span>
                      {showAll
                        ? "Show Less"
                        : `Show More (${filteredExpenses.length - INITIAL_LIMIT} more)`}
                    </span>
                    {showAll ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddExpenseModal
          wallets={wallets}
          budgets={budgets}
          onClose={() => setShowAddModal(false)}
          onSubmit={onAddExpense}
          onOpenTopUp={onOpenTopUp}
        />
      )}

      {deletingExpense && (
        <DeleteConfirmModal
          title={`Delete Expense "${deletingExpense.title}"?`}
          message="Deleting this expense will auto-refund the deducted amount back to its associated wallet balance and budget spent total."
          loading={deleteLoading}
          onClose={() => setDeletingExpense(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
