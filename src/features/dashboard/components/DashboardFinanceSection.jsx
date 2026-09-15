import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  PiggyBank,
  TrendingDown,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Edit2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Layers,
  Star,
  Lock,
  PlusCircle,
  History,
  CheckCircle2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";
import Swal from "sweetalert2";

import { useTheme } from "../../../context/ThemeContext";
import { useFinanceOverview } from "../../finance/hooks/useFinanceOverview";
import { useWallets } from "../../finance/hooks/useWallets";
import { useBudgets } from "../../finance/hooks/useBudgets";
import { useSavingGoals } from "../../goal/hooks/useSavingGoals";
import { getExpenses, deleteExpense } from "../../finance/api/financeApi";

// Modals
import AddExpenseModal from "../../finance/components/AddExpenseModal";
import CreateWalletModal from "../../finance/components/CreateWalletModal";
import EditWalletModal from "../../finance/components/EditWalletModal";
import DepositWalletModal from "../../finance/components/DepositWalletModal";
import CreateBudgetModal from "../../finance/components/CreateBudgetModal";
import EditBudgetModal from "../../finance/components/EditBudgetModal";
import {
  CreateSavingGoalModal,
  EditSavingGoalModal,
  DepositSavingGoalModal,
  SavingGoalHistoryModal,
} from "../../goal/components/SavingGoalModals";

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

const MONTHS = [
  { id: "All", label: "All Months" },
  { id: "1", label: "Jan" },
  { id: "2", label: "Feb" },
  { id: "3", label: "Mar" },
  { id: "4", label: "Apr" },
  { id: "5", label: "May" },
  { id: "6", label: "Jun" },
  { id: "7", label: "Jul" },
  { id: "8", label: "Aug" },
  { id: "9", label: "Sep" },
  { id: "10", label: "Oct" },
  { id: "11", label: "Nov" },
  { id: "12", label: "Dec" },
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

export default function DashboardFinanceSection({ onDataChanged }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Navigation sub-view inside the dashboard finance hub
  const [subView, setSubView] = useState("overview"); // "overview" | "expenses" | "wallets" | "budgets" | "savings"

  // Filter & Pagination state for expenses
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 5;

  // Expenses data with server pagination
  const [pagedExpenses, setPagedExpenses] = useState([]);
  const [totalExpensesCount, setTotalExpensesCount] = useState(0);
  const [expensesLoading, setExpensesLoading] = useState(false);

  // Core finance hooks
  const {
    monthlyData,
    categoryData,
    totalAmount: overviewTotalSpent,
    loading: overviewLoading,
    reload: reloadOverview,
    addExpense,
  } = useFinanceOverview(selectedYear, selectedCategory);

  const {
    wallets,
    totalBalance,
    defaultWallet,
    loading: walletsLoading,
    reload: reloadWallets,
    addWallet,
    editWallet,
    depositWallet,
    removeWallet,
  } = useWallets();

  const {
    budgets,
    totalLimit: totalBudgetLimit,
    totalSpent: totalBudgetSpent,
    overbudgetCount,
    loading: budgetsLoading,
    reload: reloadBudgets,
    addBudget,
    editBudget,
    removeBudget,
  } = useBudgets();

  const {
    allGoals: savingGoals,
    loading: savingsLoading,
    refresh: reloadSavings,
    createGoal: createSavingGoal,
    updateGoal: updateSavingGoal,
    removeGoal: deleteSavingGoal,
    depositFunds: depositSavingGoal,
  } = useSavingGoals();

  // Modal control states
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
  const [editWalletTarget, setEditWalletTarget] = useState(null);
  const [depositWalletTarget, setDepositWalletTarget] = useState(null);
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState(false);
  const [editBudgetTarget, setEditBudgetTarget] = useState(null);
  const [showCreateSavingModal, setShowCreateSavingModal] = useState(false);
  const [editSavingTarget, setEditSavingTarget] = useState(null);
  const [depositSavingTarget, setDepositSavingTarget] = useState(null);
  const [historySavingTarget, setHistorySavingTarget] = useState(null);

  // Fetch paginated expenses
  const fetchExpensesList = useCallback(async () => {
    setExpensesLoading(true);
    try {
      const res = await getExpenses({
        year: selectedYear,
        month: selectedMonth !== "All" ? selectedMonth : undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        page,
        limit: pageSize,
      });

      if (res) {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res.expenses)
            ? res.expenses
            : Array.isArray(res.content)
              ? res.content
              : [];
        setPagedExpenses(list);
        const total =
          res.totalElements !== undefined
            ? res.totalElements
            : res.total !== undefined
              ? res.total
              : list.length;
        setTotalExpensesCount(total);
      }
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setExpensesLoading(false);
    }
  }, [selectedYear, selectedMonth, selectedCategory, page, pageSize]);

  useEffect(() => {
    fetchExpensesList();
  }, [fetchExpensesList]);

  // Master refresh across all finance datasets
  const refreshAllFinance = useCallback(async () => {
    await Promise.allSettled([
      reloadOverview?.(),
      reloadWallets?.(),
      reloadBudgets?.(),
      reloadSavings?.(),
      fetchExpensesList?.(),
    ]);
    onDataChanged?.();
  }, [
    reloadOverview,
    reloadWallets,
    reloadBudgets,
    reloadSavings,
    fetchExpensesList,
    onDataChanged,
  ]);

  // Handle Expense Add with full refresh
  const handleAddExpenseSubmit = async (formData) => {
    try {
      await addExpense(formData);
      await refreshAllFinance();
      Swal.fire({
        icon: "success",
        title: "Expense Recorded",
        text: `"${formData.title}" was saved and deducted from wallet.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Expense",
        text: err?.message || "Error adding expense",
        confirmButtonColor: "#6C63FF",
      });
    }
  };

  // Handle Expense Delete
  const handleDeleteExpense = async (exp) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Delete Expense?",
      html: `Delete <b>"${exp.title}"</b> for <b>$${Number(exp.amount || 0).toFixed(2)}</b>?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (result.isConfirmed) {
      try {
        await deleteExpense(exp.id);
        await refreshAllFinance();
        Swal.fire({
          icon: "success",
          title: "Expense Deleted",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed to Delete",
          text: err?.message || "Could not delete expense",
          confirmButtonColor: "#6C63FF",
        });
      }
    }
  };

  // Handle Wallet Delete with funds safety rule
  const handleDeleteWallet = async (wallet) => {
    const bal = Number(wallet.balance || 0);
    if (bal > 0) {
      Swal.fire({
        icon: "warning",
        title: "Wallet Has Funds",
        html: `Cannot delete <b>${wallet.name}</b> because it still has <b>$${bal.toFixed(2)}</b>. Please spend or withdraw the funds first.`,
        confirmButtonColor: "#6C63FF",
      });
      return;
    }

    const res = await Swal.fire({
      icon: "question",
      title: "Delete Empty Wallet?",
      html: `Are you sure you want to remove <b>${wallet.name}</b>?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (res.isConfirmed) {
      try {
        await removeWallet(wallet.id);
        await refreshAllFinance();
        Swal.fire({
          icon: "success",
          title: "Wallet Deleted",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err?.message || "Could not delete wallet",
          confirmButtonColor: "#6C63FF",
        });
      }
    }
  };

  // Handle Budget Delete
  const handleDeleteBudget = async (budget) => {
    const res = await Swal.fire({
      icon: "question",
      title: `Delete ${budget.category || budget.name} Budget?`,
      text: "Your past expense history will stay safe.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (res.isConfirmed) {
      try {
        await removeBudget(budget.id);
        await refreshAllFinance();
        Swal.fire({
          icon: "success",
          title: "Budget Removed",
          timer: 1200,
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

  // Handle Saving Goal Delete
  const handleDeleteSavingGoal = async (goal) => {
    const res = await Swal.fire({
      icon: "question",
      title: `Delete “${goal.title}”?`,
      text: "Are you sure you want to delete this saving goal?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
    });

    if (res.isConfirmed) {
      try {
        await deleteSavingGoal(goal.id);
        await refreshAllFinance();
        Swal.fire({
          icon: "success",
          title: "Goal Deleted",
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Deletion Failed",
          text: err?.message || "Could not delete goal",
          confirmButtonColor: "#6C63FF",
        });
      }
    }
  };

  // Filter client-side search on current paged expenses
  const displayedExpenses = useMemo(() => {
    if (!searchQuery.trim()) return pagedExpenses;
    const q = searchQuery.toLowerCase();
    return pagedExpenses.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.category?.toLowerCase().includes(q) ||
        e.note?.toLowerCase().includes(q) ||
        e.walletName?.toLowerCase().includes(q),
    );
  }, [pagedExpenses, searchQuery]);

  // Aggregate metrics
  const totalSavedSavings = useMemo(() => {
    return savingGoals.reduce(
      (sum, g) => sum + (Number(g.currentAmount) || 0),
      0,
    );
  }, [savingGoals]);

  const totalTargetSavings = useMemo(() => {
    return savingGoals.reduce(
      (sum, g) => sum + (Number(g.targetAmount) || 0),
      0,
    );
  }, [savingGoals]);

  const savingProgressPercent =
    totalTargetSavings > 0
      ? Math.min(
          100,
          Math.round((totalSavedSavings / totalTargetSavings) * 100),
        )
      : 0;

  const budgetUsagePercent =
    totalBudgetLimit > 0
      ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100))
      : 0;

  const totalPages = Math.max(1, Math.ceil(totalExpensesCount / pageSize));

  return (
    <div className="bg-white dark:bg-[#17171F] rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm flex flex-col gap-6 transition-colors">
      {/* ── 1. Header & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#242430]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Finance & Wealth Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage live wallets, budget limits, expenses, and savings goals
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          <button
            onClick={refreshAllFinance}
            title="Refresh all finance data"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] text-slate-600 dark:text-slate-300 hover:text-[#6C63FF] dark:hover:text-[#A49DFF] transition-all cursor-pointer"
          >
            <RefreshCw
              size={15}
              className={
                overviewLoading ||
                walletsLoading ||
                budgetsLoading ||
                savingsLoading
                  ? "animate-spin text-[#6C63FF]"
                  : ""
              }
            />
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Expense</span>
          </button>

          <Link
            to="/finance"
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] bg-[#F4F2FF] dark:bg-[#1E1B2E] hover:bg-[#EDE9FE] dark:hover:bg-[#2A2440] transition-colors"
          >
            <span>Full Finance</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── 2. Summary KPI Cards (Total Expenses, Total Wallet, Budget Usage, Saving Goals) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card A: Total Wallet Balance */}
        <div
          onClick={() => setSubView("wallets")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subView === "wallets"
              ? "border-[#6C63FF] bg-[#F4F2FF]/60 dark:bg-[#1E1B2E]/60 shadow-sm"
              : "border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A]/60 hover:border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Wallet Balance
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-slate-400">
                {wallets.length} account{wallets.length !== 1 ? "s" : ""}
              </span>
              {defaultWallet && (
                <span className="font-semibold text-[#6C63FF] dark:text-[#A49DFF] flex items-center gap-0.5">
                  <Star size={10} className="fill-amber-400 text-amber-400" />
                  {defaultWallet.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card B: Total Expenses */}
        <div
          onClick={() => setSubView("expenses")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subView === "expenses"
              ? "border-rose-400 bg-rose-50/40 dark:bg-rose-950/20 shadow-sm"
              : "border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A]/60 hover:border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Expenses ({selectedYear})
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-rose-500 dark:text-rose-400 tabular-nums">
              $
              {overviewTotalSpent.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-slate-400">Recorded spending</span>
              <span className="font-semibold text-rose-500">
                {totalExpensesCount} items
              </span>
            </div>
          </div>
        </div>

        {/* Card C: Budget Usage */}
        <div
          onClick={() => setSubView("budgets")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subView === "budgets"
              ? "border-[#6C63FF] bg-[#F4F2FF]/60 dark:bg-[#1E1B2E]/60 shadow-sm"
              : "border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A]/60 hover:border-purple-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Budget Usage
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                overbudgetCount > 0
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
              }`}
            >
              <PiggyBank size={16} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                ${totalBudgetSpent.toFixed(0)} / ${totalBudgetLimit.toFixed(0)}
              </p>
              <span
                className={`text-xs font-bold ${
                  overbudgetCount > 0 ? "text-rose-500" : "text-emerald-600"
                }`}
              >
                {budgetUsagePercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#242430] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  overbudgetCount > 0 ? "bg-rose-500" : "bg-[#6C63FF]"
                }`}
                style={{ width: `${budgetUsagePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card D: Saving-Goal Progress */}
        <div
          onClick={() => setSubView("savings")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            subView === "savings"
              ? "border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
              : "border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A]/60 hover:border-emerald-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Saving Goals
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${totalSavedSavings.toFixed(0)}
              </p>
              <span className="text-xs font-bold text-slate-500">
                of ${totalTargetSavings.toFixed(0)} ({savingProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-[#242430] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${savingProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#242430] pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview & Charts", icon: Layers },
          {
            id: "expenses",
            label: `Recent Expenses (${totalExpensesCount})`,
            icon: TrendingDown,
          },
          { id: "wallets", label: `Wallets (${wallets.length})`, icon: Wallet },
          {
            id: "budgets",
            label: `Budgets (${budgets.length})`,
            icon: PiggyBank,
          },
          {
            id: "savings",
            label: `Saving Goals (${savingGoals.length})`,
            icon: CheckCircle2,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubView(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#6C63FF] text-white shadow-sm"
                  : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E1B2E] hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Tab Views ── */}

      {/* VIEW 1: Overview & Charts */}
      {subView === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Monthly Spending Chart (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-50/60 dark:bg-[#12121A]/80 border border-slate-200/80 dark:border-[#242430]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Expense Breakdown
                </h3>
                <p className="text-[11px] text-slate-400">
                  {selectedYear} Annual Trend • Total: $
                  {overviewTotalSpent.toFixed(2)}
                </p>
              </div>

              {/* Year selector */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-xs font-bold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] border-none outline-none cursor-pointer"
                >
                  {YEARS.map((y) => (
                    <option
                      key={y}
                      value={y}
                      className="bg-white dark:bg-[#1A1A24] text-slate-800 dark:text-white"
                    >
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={10}
                  className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[#6C63FF] dark:text-[#A49DFF]"
                />
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  barSize={18}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#818898" : "#94A3B8",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}`}
                    tick={{
                      fill: isDark ? "#818898" : "#94A3B8",
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: isDark
                        ? "1px solid #2B2A3D"
                        : "1px solid #ECEBF5",
                      backgroundColor: isDark ? "#17171F" : "#ffffff",
                      color: isDark ? "#ffffff" : "#111827",
                      fontSize: 12,
                    }}
                    formatter={(v) => [`$${Number(v).toFixed(2)}`, "Expense"]}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {monthlyData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={
                          entry.amount > 0
                            ? "#6C63FF"
                            : isDark
                              ? "#1E1B2E"
                              : "#EDE9FE"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spending by Category (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50/60 dark:bg-[#12121A]/80 border border-slate-200/80 dark:border-[#242430] flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Category Distribution
              </h3>
              <p className="text-[11px] text-slate-400">
                Where your funds go in {selectedYear}
              </p>
            </div>

            {!categoryData ||
            categoryData.length === 0 ||
            overviewTotalSpent === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No expense data recorded for {selectedYear}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="relative h-28 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={110}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={52}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((entry, i) => (
                          <Cell
                            key={i}
                            fill={entry.color || "#6C63FF"}
                            stroke="none"
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      ${overviewTotalSpent.toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {categoryData.slice(0, 5).map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: c.color || "#6C63FF" }}
                        />
                        <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                          {c.icon || "💸"} {c.name}
                        </span>
                      </div>
                      <span className="font-bold tabular-nums text-slate-900 dark:text-white">
                        ${Number(c.value || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: Recent Expenses List with Server Filter & Pagination */}
      {subView === "expenses" && (
        <div className="flex flex-col gap-4">
          {/* Controls row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search description, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-[#2A2A38] bg-slate-50 dark:bg-[#1A1A24] text-slate-900 dark:text-white outline-none focus:border-[#6C63FF]"
              />
            </div>

            {/* Filter Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category selector */}
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(0);
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#2A2A38] bg-slate-50 dark:bg-[#1A1A24] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Categories" : c}
                  </option>
                ))}
              </select>

              {/* Month selector */}
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setPage(0);
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#2A2A38] bg-slate-50 dark:bg-[#1A1A24] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>

              {/* Year selector */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setPage(0);
                }}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-[#2A2A38] bg-slate-50 dark:bg-[#1A1A24] text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-[#242430] overflow-hidden">
            {expensesLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                <RefreshCw size={20} className="animate-spin text-[#6C63FF]" />
                <p className="text-xs">Loading expenses...</p>
              </div>
            ) : displayedExpenses.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <span className="text-2xl">💸</span>
                <p>No transactions found for the selected filters.</p>
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="mt-1 text-xs font-bold text-[#6C63FF] hover:underline cursor-pointer"
                >
                  + Add your first expense
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-[#242430]">
                {displayedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3.5 hover:bg-purple-50/40 dark:hover:bg-[#161622] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#F4F2FF] dark:bg-[#1A1A26] flex items-center justify-center text-base shrink-0">
                        {exp.icon || "💸"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {exp.title}
                          </p>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]">
                            {exp.category}
                          </span>
                          {exp.walletName && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-[#242430] text-slate-600 dark:text-slate-400">
                              <Wallet size={9} /> {exp.walletName}
                            </span>
                          )}
                          {exp.budgetName && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                              <PiggyBank size={9} /> {exp.budgetName}
                            </span>
                          )}
                        </div>
                        {exp.note && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-sm">
                            {exp.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-xs font-bold text-rose-500 dark:text-rose-400 tabular-nums">
                          -${Number(exp.amount || 0).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {exp.date ? exp.date.slice(0, 10) : "Recent"}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteExpense(exp)}
                        title="Delete expense"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalExpensesCount > pageSize && (
            <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
              <span>
                Showing page {page + 1} of {totalPages} ({totalExpensesCount}{" "}
                total items)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 0 || expensesLoading}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
                <button
                  disabled={page >= totalPages - 1 || expensesLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#2A2A38] bg-white dark:bg-[#1A1A24] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Wallets & Accounts Grid */}
      {subView === "wallets" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active funding accounts with locked funds protection
            </p>
            <button
              onClick={() => setShowCreateWalletModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] transition-all cursor-pointer"
            >
              <Plus size={13} /> New Wallet
            </button>
          </div>

          {wallets.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No wallets created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallets.map((w) => {
                const bal = Number(w.balance || 0);
                const hasFunds = bal > 0;
                return (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A] flex flex-col justify-between"
                    style={{ borderTop: `3px solid ${w.color || "#6C63FF"}` }}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs"
                            style={{
                              backgroundColor: `${w.color || "#6C63FF"}20`,
                              color: w.color || "#6C63FF",
                            }}
                          >
                            <Wallet size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {w.name}
                              </h4>
                              {w.isDefault && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">
                              {w.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditWalletTarget(w)}
                            title="Edit"
                            className="p-1 rounded-lg text-slate-400 hover:text-[#6C63FF]"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteWallet(w)}
                            title={hasFunds ? "Locked (has funds)" : "Delete"}
                            className={`p-1 rounded-lg ${hasFunds ? "text-slate-300 dark:text-slate-600" : "text-slate-400 hover:text-rose-500"}`}
                          >
                            {hasFunds ? (
                              <Lock size={12} />
                            ) : (
                              <Trash2 size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Balance
                        </span>
                        <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                          ${bal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setDepositWalletTarget(w)}
                      className="mt-3 w-full py-1.5 rounded-xl text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] bg-[#EDE9FE] dark:bg-[#1E1B2E] hover:bg-[#E5E0FE] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PlusCircle size={13} /> Top Up
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: Budgets Grid */}
      {subView === "budgets" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Category caps with real-time overspending alerts
            </p>
            <button
              onClick={() => setShowCreateBudgetModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#6C63FF] hover:bg-[#5B52E6] transition-all cursor-pointer"
            >
              <Plus size={13} /> Set Budget
            </button>
          </div>

          {budgets.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No budgets configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((b) => {
                const limit = Number(b.limitAmount || 0);
                const spent = Number(b.spentAmount || 0);
                const remaining = Math.max(0, limit - spent);
                const pct =
                  limit > 0
                    ? Math.min(100, Math.round((spent / limit) * 100))
                    : 0;
                const isOver = spent > limit;
                const isNear = !isOver && pct >= 80;

                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A] flex flex-col justify-between"
                    style={{
                      borderTop: `3px solid ${isOver ? "#EF4444" : isNear ? "#F59E0B" : b.color || "#6C63FF"}`,
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{b.icon || "🎯"}</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {b.category || b.name}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              {b.period || "Monthly"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditBudgetTarget(b)}
                            className="p-1 rounded text-slate-400 hover:text-[#6C63FF]"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(b)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500">
                            ${spent.toFixed(2)} / ${limit.toFixed(2)}
                          </span>
                          <span
                            className={`font-bold ${isOver ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}`}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-[#242430] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOver ? "bg-rose-500" : isNear ? "bg-amber-500" : "bg-[#6C63FF]"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-[#242430] flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Remaining</span>
                      <span
                        className={`font-bold ${isOver ? "text-rose-500" : "text-emerald-600"}`}
                      >
                        {isOver
                          ? `-$${(spent - limit).toFixed(2)}`
                          : `$${remaining.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: Saving Goals Grid */}
      {subView === "savings" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track target goals and record contributions
            </p>
            <button
              onClick={() => setShowCreateSavingModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer"
            >
              <Plus size={13} /> New Saving Goal
            </button>
          </div>

          {savingGoals.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No saving goals created yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savingGoals.map((g) => {
                const cur = Number(g.currentAmount || 0);
                const tar = Number(g.targetAmount || 0);
                const rem = Math.max(0, tar - cur);
                const pct =
                  tar > 0 ? Math.min(100, Math.round((cur / tar) * 100)) : 0;

                return (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl border border-slate-200/80 dark:border-[#242430] bg-slate-50/50 dark:bg-[#12121A] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💰</span>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {g.title}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Deadline:{" "}
                              {g.deadline ? g.deadline.slice(0, 10) : "Open"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setHistorySavingTarget(g)}
                            title="Deposit History"
                            className="p-1 rounded text-slate-400 hover:text-[#6C63FF]"
                          >
                            <History size={12} />
                          </button>
                          <button
                            onClick={() => setEditSavingTarget(g)}
                            className="p-1 rounded text-slate-400 hover:text-[#6C63FF]"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteSavingGoal(g)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-500">
                            ${cur.toFixed(0)} / ${tar.toFixed(0)}
                          </span>
                          <span className="font-bold text-emerald-600">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-[#242430] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-[#242430] flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-medium">
                        ${rem.toFixed(0)} remaining
                      </span>
                      <button
                        onClick={() => setDepositSavingTarget(g)}
                        disabled={rem <= 0}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        + Deposit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 5. All Reusable Finance Modals ── */}
      {showAddExpenseModal && (
        <AddExpenseModal
          wallets={wallets}
          budgets={budgets}
          onClose={() => setShowAddExpenseModal(false)}
          onSubmit={handleAddExpenseSubmit}
          onOpenDeposit={(w) => setDepositWalletTarget(w)}
        />
      )}

      {showCreateWalletModal && (
        <CreateWalletModal
          onClose={() => setShowCreateWalletModal(false)}
          onSubmit={async (payload) => {
            await addWallet(payload);
            await refreshAllFinance();
          }}
        />
      )}

      {editWalletTarget && (
        <EditWalletModal
          wallet={editWalletTarget}
          onClose={() => setEditWalletTarget(null)}
          onSubmit={async (wId, payload) => {
            await editWallet(wId, payload);
            await refreshAllFinance();
          }}
        />
      )}

      {depositWalletTarget && (
        <DepositWalletModal
          wallet={depositWalletTarget}
          onClose={() => setDepositWalletTarget(null)}
          onSubmit={async (wId, payload) => {
            await depositWallet(wId, payload);
            await refreshAllFinance();
          }}
        />
      )}

      {showCreateBudgetModal && (
        <CreateBudgetModal
          onClose={() => setShowCreateBudgetModal(false)}
          onSubmit={async (payload) => {
            await addBudget(payload);
            await refreshAllFinance();
          }}
        />
      )}

      {editBudgetTarget && (
        <EditBudgetModal
          budget={editBudgetTarget}
          onClose={() => setEditBudgetTarget(null)}
          onSubmit={async (bId, payload) => {
            await editBudget(bId, payload);
            await refreshAllFinance();
          }}
        />
      )}

      {showCreateSavingModal && (
        <CreateSavingGoalModal
          open={showCreateSavingModal}
          onClose={() => setShowCreateSavingModal(false)}
          onSubmit={async (payload) => {
            await createSavingGoal(payload);
            await refreshAllFinance();
          }}
        />
      )}

      {editSavingTarget && (
        <EditSavingGoalModal
          open={Boolean(editSavingTarget)}
          goal={editSavingTarget}
          onClose={() => setEditSavingTarget(null)}
          onSubmit={async (gId, payload) => {
            await updateSavingGoal(gId, payload);
            await refreshAllFinance();
          }}
        />
      )}

      {depositSavingTarget && (
        <DepositSavingGoalModal
          open={Boolean(depositSavingTarget)}
          goal={depositSavingTarget}
          onClose={() => setDepositSavingTarget(null)}
          onSubmit={async (gId, payload) => {
            await depositSavingGoal(gId, payload);
            await refreshAllFinance();
          }}
        />
      )}

      {historySavingTarget && (
        <SavingGoalHistoryModal
          open={Boolean(historySavingTarget)}
          goal={historySavingTarget}
          onClose={() => setHistorySavingTarget(null)}
        />
      )}
    </div>
  );
}
