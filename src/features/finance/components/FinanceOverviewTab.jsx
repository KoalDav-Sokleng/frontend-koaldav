import React from "react";
import {
  Wallet,
  Target,
  TrendingDown,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
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
import WalletCard from "./WalletCard";
import BudgetCard from "./BudgetCard";

const YEARS = [2024, 2025, 2026, 2027, 2028];

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-[#12121A] rounded-2xl p-5 sm:p-6 border border-[#ECEBF5] dark:border-[#1E1B2E] shadow-sm transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

function CategoryDonut({ data, year, total, isDark }) {
  const hasData = Array.isArray(data) && data.length > 0 && total > 0;

  return (
    <Card className="flex flex-col justify-between">
      <div className="mb-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Spending by Category
        </h2>
        <p className="text-xs mt-0.5 text-slate-400">
          {year} • Total: ${total.toFixed(2)}
        </p>
      </div>

      {!hasData ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-1.5 text-slate-400">
          <span className="text-3xl">📊</span>
          <p className="text-xs font-medium">No expenses recorded for {year}</p>
        </div>
      ) : (
        <>
          <div
            className="relative flex items-center justify-center mb-3"
            style={{ height: 150 }}
          >
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color || "#6C63FF"}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: isDark ? "1px solid #262438" : "1px solid #ECEBF5",
                    backgroundColor: isDark ? "#1A1A24" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827",
                    fontSize: 12,
                  }}
                  formatter={(v, name) => [`$${Number(v).toFixed(2)}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                ${Number(total || 0).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400">Total</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 max-h-44 overflow-y-auto pr-1">
            {data.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: cat.color || "#6C63FF" }}
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {cat.icon || "💸"} {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs tabular-nums font-bold text-slate-900 dark:text-white">
                    ${cat.value.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export default function FinanceOverviewTab({
  totalBalance,
  wallets = [],
  budgets = [],
  totalLimit,
  totalSpent,
  totalRemaining,
  overbudgetCount,
  selectedYear,
  onYearChange,
  monthlyData = [],
  categoryData = [],
  totalAmount,
  expenses = [],
  onOpenAddExpense,
  onNavigateTab,
  onOpenCreateWallet,
  onOpenCreateBudget,
  isDark,
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* ── 4 Top KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Net Worth */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Net Worth
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#1E1B2E]">
              <span className="text-[11px] text-slate-400">
                {wallets.length} {wallets.length === 1 ? "Wallet" : "Wallets"}
              </span>
              <button
                onClick={() => onNavigateTab("wallets")}
                className="text-[11px] font-semibold text-[#6C63FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Manage <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Total Year Expenses */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {selectedYear} Expenses
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              $
              {totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#1E1B2E]">
              <span className="text-[11px] text-slate-400">
                {expenses.length} Transactions
              </span>
              <button
                onClick={() => onNavigateTab("expenses")}
                className="text-[11px] font-semibold text-[#6C63FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                View Ledger <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Budget Limit vs Spent */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Budget Cap
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-[#1E1B2E] text-indigo-600 flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              $
              {totalLimit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#1E1B2E]">
              <span className="text-[11px] text-slate-400">
                Spent: ${totalSpent.toFixed(2)}
              </span>
              <button
                onClick={() => onNavigateTab("budgets")}
                className="text-[11px] font-semibold text-[#6C63FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Budgets <ArrowRight size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Budget Health */}
        <div className="rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] bg-white dark:bg-[#12121A] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Remaining Cushion
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                overbudgetCount > 0
                  ? "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
              }`}
            >
              {overbudgetCount > 0 ? (
                <AlertTriangle size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              $
              {totalRemaining.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-[#1E1B2E]">
              <span className="text-[11px] text-slate-400">
                {overbudgetCount > 0
                  ? `${overbudgetCount} over cap`
                  : "Within safe limits"}
              </span>
              <button
                onClick={onOpenAddExpense}
                className="text-[11px] font-semibold text-[#6C63FF] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                + Add Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-5">
        {/* Monthly Trend Bar Chart */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedYear} Monthly Outgoings
              </h2>
              <p className="text-xs mt-0.5 text-slate-400">
                Annual expense trajectory • Total: ${totalAmount.toFixed(2)}
              </p>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="appearance-none pl-3 pr-7 py-1 rounded-lg text-xs font-semibold outline-none bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] border-none cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={monthlyData}
              barSize={26}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDark ? "#6B7280" : "#9CA3AF",
                  fontSize: 11,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                tick={{
                  fill: isDark ? "#6B7280" : "#9CA3AF",
                  fontSize: 11,
                }}
              />
              <Tooltip
                cursor={{
                  fill: isDark ? "rgba(108, 99, 255, 0.15)" : "#F4F2FF",
                  radius: 8,
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: isDark ? "1px solid #262438" : "1px solid #ECEBF5",
                  backgroundColor: isDark ? "#1A1A24" : "#ffffff",
                  color: isDark ? "#ffffff" : "#111827",
                  fontSize: 12,
                }}
                formatter={(v) => [`$${Number(v).toFixed(2)}`, "Expense"]}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
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
        </Card>

        {/* Category Breakdown Donut */}
        <CategoryDonut
          data={categoryData}
          year={selectedYear}
          total={totalAmount}
          isDark={isDark}
        />
      </div>

      {/* ── Wallets & Budgets Snapshot Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Wallets Snapshot */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Accounts & Wallets
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Current balances across your accounts
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("wallets")}
              className="text-xs font-semibold text-[#6C63FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          {wallets.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs">No wallets created yet.</p>
              <button
                onClick={onOpenCreateWallet}
                className="mt-2 text-xs font-bold text-[#6C63FF] hover:underline cursor-pointer"
              >
                + Create Wallet
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {wallets.slice(0, 3).map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#1A1A24] border border-slate-100 dark:border-[#262438]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: w.color || "#6C63FF" }}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {w.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {w.type} {w.isDefault && "• Primary"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    ${Number(w.balance || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Budgets Snapshot */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Category Spending Caps
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Active limits and progress
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("budgets")}
              className="text-xs font-semibold text-[#6C63FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          {budgets.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs">No active budgets configured.</p>
              <button
                onClick={onOpenCreateBudget}
                className="mt-2 text-xs font-bold text-[#6C63FF] hover:underline cursor-pointer"
              >
                + Set a Budget
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {budgets.slice(0, 3).map((b) => {
                const limit = Number(b.limitAmount || 0);
                const spent = Number(b.spentAmount || 0);
                const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const isOver = b.isOverbudget || spent > limit;
                return (
                  <div key={b.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.icon || "🎯"} {b.name}
                      </span>
                      <span
                        className={`font-bold tabular-nums ${
                          isOver
                            ? "text-rose-600"
                            : pct >= 80
                              ? "text-amber-500"
                              : "text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        ${spent.toFixed(0)} / ${limit.toFixed(0)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-[#1E1B2E] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOver
                            ? "bg-rose-500"
                            : pct >= 80
                              ? "bg-amber-500"
                              : "bg-[#6C63FF]"
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
