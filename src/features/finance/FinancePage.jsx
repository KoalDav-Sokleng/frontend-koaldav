import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, ChevronDown, ChevronUp, RefreshCw, Menu } from "lucide-react";
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
import AddExpenseModal from "./components/AddExpenseModal";
import { useFinanceOverview } from "./hooks/useFinanceOverview";

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

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 ${className}`}
      style={{
        border: "1px solid #ECEBF5",
        boxShadow: "0 2px 16px rgba(108,99,255,0.06)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Year selector ────────────────────────────────────────────────────────────

function YearSelector({ value, onChange }) {
  const [customMode, setCustomMode] = useState(false);
  const [raw, setRaw] = useState(String(value));

  if (customMode) {
    return (
      <input
        autoFocus
        type="number"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={() => {
          const n = parseInt(raw, 10);
          if (!isNaN(n) && n > 1900 && n < 2100) onChange(n);
          else setRaw(String(value));
          setCustomMode(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") {
            setRaw(String(value));
            setCustomMode(false);
          }
        }}
        className="w-16 text-center rounded-lg text-xs outline-none"
        style={{
          background: "#EDE9FE",
          color: "#6C63FF",
          fontWeight: 600,
          border: "1.5px solid #6C63FF",
          padding: "3px 6px",
          fontFamily: "inherit",
        }}
      />
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setCustomMode(true);
            setRaw(String(value));
          } else onChange(Number(e.target.value));
        }}
        className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-xs cursor-pointer outline-none"
        style={{
          background: "#EDE9FE",
          color: "#6C63FF",
          fontWeight: 600,
          border: "none",
          fontFamily: "inherit",
        }}
      >
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
        <option value="__custom__">Custom…</option>
      </select>
      <ChevronDown
        size={10}
        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2"
        style={{ color: "#6C63FF" }}
      />
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function CategoryDonut({ data, year, total }) {
  const hasData = Array.isArray(data) && data.length > 0 && total > 0;

  return (
    <Card className="flex flex-col justify-between">
      <div className="mb-3">
        <h2 className="text-base" style={{ fontWeight: 700, color: "#111827" }}>
          Spending by Category
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
          {year} • Total: ${total.toFixed(2)}
        </p>
      </div>

      {!hasData ? (
        <div
          className="py-10 flex flex-col items-center justify-center text-center gap-1.5"
          style={{ color: "#9CA3AF" }}
        >
          <span className="text-3xl">📊</span>
          <p className="text-xs font-medium">No expenses recorded for {year}</p>
        </div>
      ) : (
        <>
          <div
            className="relative flex items-center justify-center mb-3"
            style={{ height: 140 }}
          >
            <ResponsiveContainer
              width="100%"
              height={140}
              className="outline-none focus:outline-none"
            >
              <PieChart
                accessibilityLayer={false}
                className="outline-none focus:outline-none select-none"
              >
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={66}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                  className="outline-none focus:outline-none"
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.color || "#6C63FF"}
                      stroke="none"
                      className="outline-none focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 10,
                    border: "1px solid #ECEBF5",
                    fontSize: 12,
                    fontFamily: "inherit",
                  }}
                  formatter={(v, name) => [`$${Number(v).toFixed(2)}`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-base sm:text-lg font-extrabold text-slate-900">
                ${Number(total || 0).toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400">Total</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 flex-1 max-h-44 overflow-y-auto pr-1">
            {data.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: cat.color || "#6C63FF" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "#374151", fontWeight: 500 }}
                  >
                    {cat.icon || "💸"} {cat.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-full"
                    style={{
                      width: Math.min(
                        70,
                        Math.max(8, Math.round((cat.value / total) * 70)),
                      ),
                      height: 4,
                      background: cat.color || "#6C63FF",
                      opacity: 0.7,
                    }}
                  />
                  <span
                    className="text-xs tabular-nums"
                    style={{
                      fontWeight: 600,
                      color: "#111827",
                      minWidth: 40,
                      textAlign: "right",
                    }}
                  >
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

// ─── Expense row ──────────────────────────────────────────────────────────────

function ExpenseRow({ expense }) {
  const displayDate = formatDisplayDate(expense.date);
  return (
    <div className="flex items-center py-3.5 gap-4 group hover:bg-purple-50 -mx-5 px-5 transition-colors rounded-xl">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
        style={{ background: "#F4F2FF" }}
      >
        {expense.icon || "💸"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {expense.title}
          </p>
          <span
            className="px-2 py-0.5 rounded-md text-[10px]"
            style={{ background: "#EDE9FE", color: "#6C63FF", fontWeight: 600 }}
          >
            {expense.category}
          </span>
        </div>
        {expense.note && (
          <p
            className="text-xs mt-0.5 truncate text-slate-400"
            title={expense.note}
          >
            {expense.note}
          </p>
        )}
      </div>
      <p className="text-xs shrink-0 text-slate-400">{displayDate}</p>
      <p className="text-sm tabular-nums shrink-0 font-bold text-rose-500 min-w-[65px] text-right">
        -${Number(expense.amount || 0).toFixed(2)}
      </p>
    </div>
  );
}

// ─── Expense records card ────────────────────────────────────────────────────

function ExpenseRecords({ expenses, activeFilter, onFilterChange, loading }) {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_LIMIT = 5;

  const visibleExpenses = showAll ? expenses : expenses.slice(0, INITIAL_LIMIT);
  const hasMore = expenses.length > INITIAL_LIMIT;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recorded Expenses
          </h2>
          <p className="text-xs mt-0.5 text-slate-400">
            Your recent transactions
          </p>
        </div>
        <span className="text-xs tabular-nums text-slate-400">
          {expenses.length} items
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill}
            onClick={() => {
              onFilterChange(pill);
              setShowAll(false);
            }}
            className="px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
            style={{
              background: activeFilter === pill ? "#6C63FF" : "#F4F2FF",
              color: activeFilter === pill ? "#fff" : "#6C63FF",
              fontWeight: 600,
              border:
                activeFilter === pill
                  ? "1.5px solid #6C63FF"
                  : "1.5px solid #EDE9FE",
              fontFamily: "inherit",
            }}
          >
            {pill}
          </button>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-slate-50 min-h-[140px]">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw size={20} className="animate-spin text-[#6C63FF]" />
            <p className="text-xs">Loading expenses…</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
            <span className="text-3xl">💸</span>
            <p className="text-sm font-medium">
              No expenses found in this category
            </p>
            <p className="text-xs text-slate-400">
              Add an expense to start tracking your spending.
            </p>
          </div>
        ) : (
          <>
            {visibleExpenses.map((exp) => (
              <ExpenseRow key={exp.id} expense={exp} />
            ))}
            {hasMore && (
              <div className="pt-3.5 pb-1 flex justify-center">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#6C63FF] hover:bg-purple-50 transition-all cursor-pointer border border-[#EDE9FE]"
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
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeFilter, setActiveFilter] = useState("All");
  const outletContext = useOutletContext();

  const {
    expenses,
    monthlyData,
    categoryData,
    totalAmount,
    loading,
    error,
    addExpense,
    reload,
  } = useFinanceOverview(selectedYear, activeFilter);

  const handleAddExpense = async (form) => {
    try {
      await addExpense(form);
    } catch (err) {
      console.error("Failed to add expense", err);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden bg-[#F4F2FF]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-3.5 sm:px-8 py-3 sm:py-4 shrink-0 bg-white/80 backdrop-blur-md gap-2"
        style={{ borderBottom: "1px solid #ECEBF5" }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {outletContext?.onMenuClick && (
            <button
              onClick={outletContext.onMenuClick}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-purple-50 text-[#6C63FF] hover:bg-purple-100 transition-colors shrink-0"
              title="Open menu"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight truncate">
              Finance
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
              Where am I actually spending my money? Track and analyze your real
              expenses.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={reload}
            title="Refresh data"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all hover:bg-purple-50 bg-white border border-slate-200 text-slate-500 hover:text-[#6C63FF] cursor-pointer shrink-0"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all bg-[#6C63FF] hover:bg-[#5B52E6] shadow-sm active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus size={15} className="shrink-0" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 flex items-center justify-between">
          <span>Failed to connect to backend: {String(error)}</span>
          <button onClick={reload} className="font-semibold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 flex flex-col gap-5">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.65fr] gap-5">
          {/* Bar chart */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedYear} Monthly Expenses
                </h2>
                <p className="text-xs mt-0.5 text-slate-400">
                  Annual expense breakdown • Total: ${totalAmount.toFixed(2)}
                </p>
              </div>
              <YearSelector value={selectedYear} onChange={setSelectedYear} />
            </div>
            <ResponsiveContainer
              width="100%"
              height={200}
              className="outline-none focus:outline-none"
            >
              <BarChart
                data={monthlyData}
                barSize={26}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                accessibilityLayer={false}
                className="outline-none focus:outline-none select-none"
              >
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#9CA3AF",
                    fontSize: 11,
                    fontFamily: "inherit",
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                  tick={{
                    fill: "#9CA3AF",
                    fontSize: 11,
                    fontFamily: "inherit",
                  }}
                />
                <Tooltip
                  cursor={{ fill: "#F4F2FF", radius: 8, stroke: "none" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #ECEBF5",
                    fontFamily: "inherit",
                    fontSize: 12,
                  }}
                  formatter={(v) => [`$${Number(v).toFixed(2)}`, "Expense"]}
                />
                <Bar
                  dataKey="amount"
                  radius={[6, 6, 0, 0]}
                  className="outline-none focus:outline-none"
                >
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={entry.amount > 0 ? "#6C63FF" : "#EDE9FE"}
                      stroke="none"
                      className="outline-none focus:outline-none"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <CategoryDonut
            data={categoryData}
            year={selectedYear}
            total={totalAmount}
          />
        </div>

        {/* Expense records */}
        <ExpenseRecords
          expenses={expenses}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          loading={loading}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddExpense}
        />
      )}
    </div>
  );
}
