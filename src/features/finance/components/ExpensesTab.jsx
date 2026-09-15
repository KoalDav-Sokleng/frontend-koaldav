import React, { useState, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Calendar,
  Wallet,
  Tag,
  ChevronDown,
} from "lucide-react";
import Swal from "sweetalert2";
import { useFinanceOverview } from "../hooks/useFinanceOverview";
import AddExpenseModal from "./AddExpenseModal";
import DepositWalletModal from "./DepositWalletModal";
import { useWallets } from "../hooks/useWallets";
import { useBudgets } from "../hooks/useBudgets";

const CATEGORIES = [
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

export default function ExpensesTab() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [depositWalletTarget, setDepositWalletTarget] = useState(null);

  const {
    expenses,
    totalAmount,
    loading,
    error,
    addExpense,
    removeExpense,
    reload,
  } = useFinanceOverview(selectedYear, activeCategory);

  const { wallets, depositWallet, reload: reloadWallets } = useWallets();
  const { budgets, reload: reloadBudgets } = useBudgets();

  const filteredExpenses = useMemo(() => {
    if (!searchQuery.trim()) return expenses;
    const q = searchQuery.toLowerCase();
    return expenses.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.note?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q),
    );
  }, [expenses, searchQuery]);

  const handleDeleteExpense = async (exp) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Delete Expense?",
      html: `
        <div style="font-size: 13px; color: #334155;">
          <p>Delete <b>"${exp.title}"</b> for <b>$${Number(exp.amount || 0).toFixed(2)}</b>?</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (result.isConfirmed) {
      try {
        await removeExpense(exp.id);
        reloadWallets();
        reloadBudgets();
        Swal.fire({
          icon: "success",
          title: "Expense Removed",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err?.message || "Could not delete expense",
          confirmButtonColor: "#6C63FF",
        });
      }
    }
  };

  const handleAddExpenseSubmit = async (formData) => {
    await addExpense(formData);
    reloadWallets();
    reloadBudgets();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Expense Transaction History
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Total recorded in {selectedYear}: ${totalAmount.toFixed(2)} (
            {filteredExpenses.length} items)
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <button
            onClick={reload}
            title="Refresh list"
            className="p-2 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-500 hover:text-[#6C63FF] transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-[#6C63FF] text-white shadow-sm"
                : "bg-white dark:bg-[#12121A] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-[#1E1B2E] hover:border-[#6C63FF] dark:hover:border-[#6C63FF]"
            }`}
          >
            {cat !== "All" && (
              <span className="mr-1">{CATEGORY_ICONS[cat]}</span>
            )}
            {cat}
          </button>
        ))}
      </div>

      {/* Expense List Container */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw size={24} className="animate-spin text-[#6C63FF]" />
            <p className="text-xs font-medium">Loading transactions...</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="py-16 p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center text-2xl">
              💸
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                No Transactions Found
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {searchQuery
                  ? "No expenses matched your search query."
                  : `No expenses recorded for ${activeCategory === "All" ? "any category" : activeCategory}.`}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Record Expense</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#1E1B2E]">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between p-4 hover:bg-purple-50/40 dark:hover:bg-[#161622] transition-colors gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F2FF] dark:bg-[#1A1A26] flex items-center justify-center text-lg shrink-0">
                    {exp.icon || CATEGORY_ICONS[exp.category] || "💸"}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {exp.title}
                      </p>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]">
                        {exp.category}
                      </span>
                      {exp.walletName && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-[#1E1B2E] text-slate-600 dark:text-slate-400">
                          <Wallet size={10} /> {exp.walletName}
                        </span>
                      )}
                    </div>
                    {exp.note && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-md">
                        {exp.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-500 dark:text-rose-400 tabular-nums">
                      -${Number(exp.amount || 0).toFixed(2)}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {exp.date
                        ? new Date(exp.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteExpense(exp)}
                    title="Delete expense"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <AddExpenseModal
          wallets={wallets}
          budgets={budgets}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddExpenseSubmit}
          onOpenDeposit={(w) => setDepositWalletTarget(w)}
        />
      )}

      {/* Deposit Modal Triggered from Insufficient Funds Guard */}
      {depositWalletTarget && (
        <DepositWalletModal
          wallet={depositWalletTarget}
          onClose={() => setDepositWalletTarget(null)}
          onSubmit={async (wId, payload) => {
            await depositWallet(wId, payload);
            reloadWallets();
          }}
        />
      )}
    </div>
  );
}
