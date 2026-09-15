import React, { useState } from "react";
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
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import FinanceSummaryCard from "./FinanceSummaryCard";
import { useTheme } from "../../../context/ThemeContext";

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

const YEARS = [2024, 2025, 2026, 2027, 2028];

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white dark:bg-[#12121A] rounded-2xl p-5 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

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

export default function FinanceOverviewTab({
  selectedYear,
  onYearChange,
  activeFilter,
  onFilterChange,
  expenses,
  monthlyData,
  categoryData,
  totalAmount,
  loading,
  totalBalance = 0,
  totalBudget = 0,
  overbudgetCount = 0,
  onNavigateTab,
  onOpenAddExpense,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showAll, setShowAll] = useState(false);
  const INITIAL_LIMIT = 5;

  const visibleExpenses = showAll ? expenses : expenses.slice(0, INITIAL_LIMIT);
  const hasMore = expenses.length > INITIAL_LIMIT;

  return (
    <div className="flex flex-col gap-5">
      {/* KPI Stats Overview */}
      <FinanceSummaryCard
        totalBalance={totalBalance}
        totalBudget={totalBudget}
        totalSpent={totalAmount}
        overbudgetCount={overbudgetCount}
        onNavigateTab={onNavigateTab}
      />

      {/* Top Row: Monthly Chart + Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-5">
        {/* Monthly Bar Chart */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedYear} Monthly Expenses
              </h2>
              <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">
                Annual expense breakdown • Total: ${totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-xs cursor-pointer outline-none bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] border-none font-semibold"
              >
                {YEARS.map((y) => (
                  <option
                    key={y}
                    value={y}
                    className="bg-white dark:bg-[#1A1A24] text-slate-800 dark:text-slate-100"
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

          <ResponsiveContainer
            width="100%"
            height={200}
            className="outline-none"
          >
            <BarChart
              data={monthlyData}
              barSize={24}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              accessibilityLayer={false}
              className="outline-none select-none"
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: isDark ? "#6B7280" : "#9CA3AF",
                  fontSize: 11,
                  fontFamily: "inherit",
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                tick={{
                  fill: isDark ? "#6B7280" : "#9CA3AF",
                  fontSize: 11,
                  fontFamily: "inherit",
                }}
              />
              <Tooltip
                cursor={{
                  fill: isDark ? "rgba(108, 99, 255, 0.15)" : "#F4F2FF",
                  radius: 8,
                  stroke: "none",
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: isDark ? "1px solid #262438" : "1px solid #ECEBF5",
                  backgroundColor: isDark ? "#1A1A24" : "#ffffff",
                  color: isDark ? "#ffffff" : "#111827",
                  fontSize: 12,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                }}
                formatter={(v) => [`$${Number(v).toFixed(2)}`, "Expense"]}
              />
              <Bar
                dataKey="amount"
                radius={[6, 6, 0, 0]}
                className="outline-none"
              >
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

        {/* Category Donut */}
        <Card className="flex flex-col justify-between">
          <div className="mb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Spending by Category
            </h2>
            <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">
              {selectedYear} • Total: ${totalAmount.toFixed(2)}
            </p>
          </div>

          {!categoryData || categoryData.length === 0 || totalAmount === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-1.5 text-slate-400 dark:text-slate-500">
              <span className="text-3xl">📊</span>
              <p className="text-xs font-medium">
                No expenses recorded for {selectedYear}
              </p>
            </div>
          ) : (
            <>
              <div
                className="relative flex items-center justify-center mb-3"
                style={{ height: 140 }}
              >
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart accessibilityLayer={false}>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={66}
                      paddingAngle={3}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {categoryData.map((entry, i) => (
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
                        border: isDark
                          ? "1px solid #262438"
                          : "1px solid #ECEBF5",
                        backgroundColor: isDark ? "#1A1A24" : "#ffffff",
                        color: isDark ? "#ffffff" : "#111827",
                        fontSize: 12,
                      }}
                      formatter={(v, name) => [
                        `$${Number(v).toFixed(2)}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    ${Number(totalAmount || 0).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Total
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-1 max-h-44 overflow-y-auto pr-1">
                {categoryData.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between"
                  >
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
                      <div
                        className="rounded-full"
                        style={{
                          width: Math.min(
                            70,
                            Math.max(
                              8,
                              Math.round((cat.value / (totalAmount || 1)) * 70),
                            ),
                          ),
                          height: 4,
                          background: cat.color || "#6C63FF",
                          opacity: 0.7,
                        }}
                      />
                      <span className="text-xs tabular-nums font-semibold text-slate-900 dark:text-white min-w-[40px] text-right">
                        ${cat.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Recorded Expenses preview */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Expenses
            </h2>
            <p className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">
              Latest transactions recorded across your accounts
            </p>
          </div>
          <button
            onClick={() => onNavigateTab?.("expenses")}
            className="text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] hover:underline cursor-pointer"
          >
            View All ({expenses.length})
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                onFilterChange(pill);
                setShowAll(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer font-semibold ${
                activeFilter === pill
                  ? "bg-[#6C63FF] text-white border border-[#6C63FF]"
                  : "bg-[#F4F2FF] dark:bg-[#1A1A26] text-[#6C63FF] dark:text-[#A49DFF] border border-[#EDE9FE] dark:border-[#262438] hover:bg-purple-100 dark:hover:bg-[#222033]"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Expense list */}
        <div className="flex flex-col divide-y divide-slate-100 dark:divide-[#1E1B2E] min-h-[140px]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw size={20} className="animate-spin text-[#6C63FF]" />
              <p className="text-xs">Loading expenses…</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
              <span className="text-3xl">💸</span>
              <p className="text-sm font-medium">
                No expenses found in this category
              </p>
              <button
                onClick={onOpenAddExpense}
                className="mt-2 text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
              >
                + Add an expense
              </button>
            </div>
          ) : (
            <>
              {visibleExpenses.map((exp) => {
                const displayDate = formatDisplayDate(exp.date);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center py-3.5 gap-4 group hover:bg-purple-50/70 dark:hover:bg-[#1A1A26] -mx-5 px-5 transition-colors rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg bg-[#F4F2FF] dark:bg-[#1A1A26]">
                      {exp.icon || "💸"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {exp.title}
                        </p>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EDE9FE] dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]">
                          {exp.category}
                        </span>
                      </div>
                      {exp.note && (
                        <p className="text-xs mt-0.5 truncate text-slate-400 dark:text-slate-500">
                          {exp.note}
                        </p>
                      )}
                    </div>
                    <p className="text-xs shrink-0 text-slate-400 dark:text-slate-500">
                      {displayDate}
                    </p>
                    <p className="text-sm tabular-nums shrink-0 font-bold text-rose-500 dark:text-rose-400 min-w-[65px] text-right">
                      -${Number(exp.amount || 0).toFixed(2)}
                    </p>
                  </div>
                );
              })}

              {hasMore && (
                <div className="pt-3.5 pb-1 flex justify-center">
                  <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:bg-purple-50 dark:hover:bg-[#1E1B2E] transition-all cursor-pointer border border-[#EDE9FE] dark:border-[#262438]"
                  >
                    <span>
                      {showAll
                        ? "Show Less"
                        : `View More (${expenses.length - INITIAL_LIMIT} more)`}
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
      </Card>
    </div>
  );
}
