import React, { useState } from "react";
import { useOutletContext, useParams, useSearchParams } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Target,
  Receipt,
  Plus,
  RefreshCw,
  Menu,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useWallets } from "./hooks/useWallets";
import { useBudgets } from "./hooks/useBudgets";
import { useFinanceOverview } from "./hooks/useFinanceOverview";

import FinanceOverviewTab from "./components/FinanceOverviewTab";
import WalletsTab from "./components/WalletsTab";
import BudgetsTab from "./components/BudgetsTab";
import ExpensesTab from "./components/ExpensesTab";
import AddExpenseModal from "./components/AddExpenseModal";
import CreateWalletModal from "./components/CreateWalletModal";
import CreateBudgetModal from "./components/CreateBudgetModal";
import DepositWalletModal from "./components/DepositWalletModal";

const FINANCE_TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "wallets", label: "Wallets & Accounts", icon: Wallet },
  { id: "budgets", label: "Budgets & Caps", icon: Target },
  { id: "expenses", label: "Expenses & Ledger", icon: Receipt },
];

const VALID_TABS = ["overview", "wallets", "budgets", "expenses"];

export default function FinancePage() {
  const { tab: paramTab } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get("tab");

  // Determine active tab from URL param (:tab) or query string (?tab=)
  const activeTab =
    paramTab && VALID_TABS.includes(paramTab.toLowerCase())
      ? paramTab.toLowerCase()
      : queryTab && VALID_TABS.includes(queryTab.toLowerCase())
        ? queryTab.toLowerCase()
        : "overview";

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");

  // Global modals
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState(false);
  const [depositingWallet, setDepositingWallet] = useState(null);

  const outletContext = useOutletContext();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Data Hooks
  const {
    wallets,
    loading: walletsLoading,
    error: walletsError,
    totalBalance,
    defaultWallet,
    reload: reloadWallets,
    addWallet,
    editWallet,
    depositWallet,
    removeWallet,
  } = useWallets();

  const {
    budgets,
    loading: budgetsLoading,
    error: budgetsError,
    totalLimit,
    totalSpent,
    totalRemaining,
    overbudgetCount,
    reload: reloadBudgets,
    addBudget,
    editBudget,
    removeBudget,
  } = useBudgets();

  const {
    expenses,
    monthlyData,
    categoryData,
    totalAmount,
    loading: overviewLoading,
    error: overviewError,
    reload: reloadOverview,
    addExpense,
    removeExpense,
  } = useFinanceOverview(selectedYear, activeCategoryFilter);

  // Unified reload
  const handleReloadAll = async () => {
    await Promise.all([reloadWallets(), reloadBudgets(), reloadOverview()]);
  };

  // When an expense is added, update wallets & budgets too
  const handleAddExpenseSubmit = async (formData) => {
    await addExpense(formData);
    await Promise.all([reloadWallets(), reloadBudgets()]);
  };

  // When an expense is deleted, update wallets & budgets too
  const handleRemoveExpense = async (id) => {
    await removeExpense(id);
    await Promise.all([reloadWallets(), reloadBudgets()]);
  };

  // Open Top Up for a wallet
  const handleOpenTopUp = (walletToTopUp) => {
    const target = walletToTopUp || defaultWallet || wallets[0];
    if (target) {
      setDepositingWallet(target);
    }
  };

  const isGlobalLoading = walletsLoading || budgetsLoading || overviewLoading;

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-[#F4F2FF] dark:bg-[#0D0D12] text-slate-900 dark:text-slate-100 transition-colors"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Top Header ── */}
      <div className="px-4 sm:px-8 py-3.5 sm:py-4 shrink-0 bg-white/85 dark:bg-[#12121A]/90 backdrop-blur-md border-b border-[#ECEBF5] dark:border-[#1E1B2E] transition-colors flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                Finance Management
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                Manage accounts, define spending budgets, and track expenses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handleReloadAll}
              title="Refresh all finance data"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-purple-50 dark:hover:bg-[#1E1B2E] bg-white dark:bg-[#1A1A24] border border-slate-200 dark:border-[#2A2A38] text-slate-500 dark:text-slate-400 hover:text-[#6C63FF] dark:hover:text-[#6C63FF] cursor-pointer"
            >
              <RefreshCw
                size={16}
                className={isGlobalLoading ? "animate-spin" : ""}
              />
            </button>

            <button
              onClick={() => setShowAddExpenseModal(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all bg-[#6C63FF] hover:bg-[#5B52E6] shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} className="shrink-0" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* ── Sub-Navigation Tabs ── */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {FINANCE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#6C63FF] text-white shadow-sm"
                    : "bg-slate-100/80 dark:bg-[#1A1A24] text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#201D30] hover:text-[#6C63FF]"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.id === "wallets" && wallets.length > 0 && (
                  <span
                    className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-[#262438] text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {wallets.length}
                  </span>
                )}
                {tab.id === "budgets" && overbudgetCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full font-bold bg-rose-500 text-white">
                    !
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable Body Content ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        {activeTab === "overview" && (
          <FinanceOverviewTab
            totalBalance={totalBalance}
            wallets={wallets}
            budgets={budgets}
            totalLimit={totalLimit}
            totalSpent={totalSpent}
            totalRemaining={totalRemaining}
            overbudgetCount={overbudgetCount}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            monthlyData={monthlyData}
            categoryData={categoryData}
            totalAmount={totalAmount}
            expenses={expenses}
            onOpenAddExpense={() => setShowAddExpenseModal(true)}
            onNavigateTab={handleTabChange}
            onOpenCreateWallet={() => setShowCreateWalletModal(true)}
            onOpenCreateBudget={() => setShowCreateBudgetModal(true)}
            isDark={isDark}
          />
        )}

        {activeTab === "wallets" && (
          <WalletsTab
            wallets={wallets}
            loading={walletsLoading}
            error={walletsError}
            totalBalance={totalBalance}
            defaultWallet={defaultWallet}
            reload={reloadWallets}
            onAddWallet={addWallet}
            onEditWallet={editWallet}
            onDepositWallet={depositWallet}
            onRemoveWallet={removeWallet}
          />
        )}

        {activeTab === "budgets" && (
          <BudgetsTab
            budgets={budgets}
            loading={budgetsLoading}
            error={budgetsError}
            totalLimit={totalLimit}
            totalSpent={totalSpent}
            totalRemaining={totalRemaining}
            overbudgetCount={overbudgetCount}
            reload={reloadBudgets}
            onAddBudget={addBudget}
            onEditBudget={editBudget}
            onRemoveBudget={removeBudget}
          />
        )}

        {activeTab === "expenses" && (
          <ExpensesTab
            expenses={expenses}
            loading={overviewLoading}
            error={overviewError}
            activeFilter={activeCategoryFilter}
            onFilterChange={setActiveCategoryFilter}
            reload={reloadOverview}
            onAddExpense={handleAddExpenseSubmit}
            onRemoveExpense={handleRemoveExpense}
            wallets={wallets}
            budgets={budgets}
            onOpenTopUp={handleOpenTopUp}
          />
        )}
      </div>

      {/* ── Modals ── */}
      {showAddExpenseModal && (
        <AddExpenseModal
          wallets={wallets}
          budgets={budgets}
          onClose={() => setShowAddExpenseModal(false)}
          onSubmit={handleAddExpenseSubmit}
          onOpenTopUp={handleOpenTopUp}
        />
      )}

      {showCreateWalletModal && (
        <CreateWalletModal
          onClose={() => setShowCreateWalletModal(false)}
          onSubmit={addWallet}
        />
      )}

      {showCreateBudgetModal && (
        <CreateBudgetModal
          onClose={() => setShowCreateBudgetModal(false)}
          onSubmit={addBudget}
        />
      )}

      {depositingWallet && (
        <DepositWalletModal
          wallet={depositingWallet}
          onClose={() => setDepositingWallet(null)}
          onSubmit={depositWallet}
        />
      )}
    </div>
  );
}
