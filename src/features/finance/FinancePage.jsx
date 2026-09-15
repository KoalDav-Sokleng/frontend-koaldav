import React, { useState } from "react";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  Menu,
  PieChart as PieChartIcon,
  Wallet,
  PiggyBank,
  ReceiptText,
} from "lucide-react";
import FinanceOverviewTab from "./components/FinanceOverviewTab";
import WalletsTab from "./components/WalletsTab";
import BudgetsTab from "./components/BudgetsTab";
import ExpensesTab from "./components/ExpensesTab";
import AddExpenseModal from "./components/AddExpenseModal";
import DepositWalletModal from "./components/DepositWalletModal";
import { useFinanceOverview } from "./hooks/useFinanceOverview";
import { useWallets } from "./hooks/useWallets";
import { useBudgets } from "./hooks/useBudgets";

const TABS = [
  { id: "overview", label: "Overview", icon: PieChartIcon },
  { id: "wallets", label: "Wallets", icon: Wallet },
  { id: "budgets", label: "Budgets", icon: PiggyBank },
  { id: "expenses", label: "Expenses", icon: ReceiptText },
];

export default function FinancePage() {
  const { tab: paramTab } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext();

  // Determine active tab from URL (/finance/:tab) or default to "overview"
  const activeTab = (paramTab || "overview").toLowerCase();

  const handleTabChange = (tabId) => {
    navigate(`/finance/${tabId}`);
  };

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [depositTarget, setDepositTarget] = useState(null);

  // Load finance hooks
  const {
    expenses,
    monthlyData,
    categoryData,
    totalAmount,
    loading: overviewLoading,
    error: overviewError,
    addExpense,
    reload: reloadOverview,
  } = useFinanceOverview(selectedYear, activeFilter);

  const {
    wallets,
    totalBalance,
    depositWallet,
    reload: reloadWallets,
  } = useWallets();

  const {
    budgets,
    totalLimit,
    overbudgetCount,
    reload: reloadBudgets,
  } = useBudgets();

  const handleRefreshAll = () => {
    reloadOverview();
    reloadWallets();
    reloadBudgets();
  };

  const handleAddExpenseSubmit = async (formData) => {
    await addExpense(formData);
    reloadWallets();
    reloadBudgets();
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-[#F4F2FF] dark:bg-[#0D0D12] text-slate-900 dark:text-slate-100 transition-colors"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 shrink-0 bg-white/80 dark:bg-[#12121A]/90 backdrop-blur-md gap-3 border-b border-[#ECEBF5] dark:border-[#1E1B2E] transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          {outletContext?.onMenuClick && (
            <button
              onClick={outletContext.onMenuClick}
              className="lg:hidden p-2 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] hover:bg-purple-100 dark:hover:bg-[#25223A] transition-colors shrink-0"
              title="Open menu"
            >
              <Menu size={18} />
            </button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
              Finance Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              Track accounts, budgets, and expenses with realtime safety checks
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-end sm:self-center">
          <button
            onClick={handleRefreshAll}
            title="Refresh finance data"
            className="p-2 rounded-xl flex items-center justify-center transition-all hover:bg-purple-50 dark:hover:bg-[#1E1B2E] bg-white dark:bg-[#1A1A24] border border-slate-200 dark:border-[#2A2A38] text-slate-500 hover:text-[#6C63FF] cursor-pointer"
          >
            <RefreshCw
              size={15}
              className={overviewLoading ? "animate-spin" : ""}
            />
          </button>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* ── Tab Navigation Bar ── */}
      <div className="flex items-center gap-2 px-4 sm:px-8 py-2.5 bg-white/60 dark:bg-[#12121A]/60 border-b border-[#ECEBF5] dark:border-[#1E1B2E] overflow-x-auto no-scrollbar shrink-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-[#6C63FF] text-white shadow-sm"
                  : "bg-transparent text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-[#1E1B2E] hover:text-[#6C63FF] dark:hover:text-[#A49DFF]"
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
              {t.id === "wallets" && wallets.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]"
                  }`}
                >
                  {wallets.length}
                </span>
              )}
              {t.id === "budgets" && overbudgetCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive
                      ? "bg-rose-500 text-white"
                      : "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {overbudgetCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Error Banner ── */}
      {overviewError && (
        <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center justify-between">
          <span>Connection notice: {String(overviewError)}</span>
          <button
            onClick={handleRefreshAll}
            className="font-semibold underline ml-2 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Scrollable Tab Content ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5">
        {activeTab === "overview" && (
          <FinanceOverviewTab
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            expenses={expenses}
            monthlyData={monthlyData}
            categoryData={categoryData}
            totalAmount={totalAmount}
            loading={overviewLoading}
            totalBalance={totalBalance}
            totalBudget={totalLimit}
            overbudgetCount={overbudgetCount}
            onNavigateTab={handleTabChange}
            onOpenAddExpense={() => setShowAddExpenseModal(true)}
          />
        )}

        {activeTab === "wallets" && <WalletsTab />}

        {activeTab === "budgets" && <BudgetsTab />}

        {activeTab === "expenses" && <ExpensesTab />}
      </div>

      {/* ── Add Expense Modal ── */}
      {showAddExpenseModal && (
        <AddExpenseModal
          wallets={wallets}
          budgets={budgets}
          onClose={() => setShowAddExpenseModal(false)}
          onSubmit={handleAddExpenseSubmit}
          onOpenDeposit={(w) => setDepositTarget(w)}
        />
      )}

      {/* ── Deposit / Top Up Modal ── */}
      {depositTarget && (
        <DepositWalletModal
          wallet={depositTarget}
          onClose={() => setDepositTarget(null)}
          onSubmit={async (wId, payload) => {
            await depositWallet(wId, payload);
            reloadWallets();
          }}
        />
      )}
    </div>
  );
}
