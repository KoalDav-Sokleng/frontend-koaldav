import { useState, useCallback } from "react";
import { Bell, Plus, ChevronDown, Trash2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer,
  PieChart, Pie, Tooltip,
} from "recharts";
import AddExpenseModal from "./components/AddExpenseModal";

// ─── Seed data ───────────────────────────────────────────────────────────────

const SEED_EXPENSES = [
  { id: 1, icon: "🍔", title: "Lunch",     category: "Food",           note: "Lunch with friends", date: "Aug 25, 2026", amount: 5.0 },
  { id: 2, icon: "🚗", title: "Grab Ride", category: "Transportation", note: "",                   date: "Aug 24, 2026", amount: 12.0 },
  { id: 3, icon: "🛍️", title: "New Shoes", category: "Shopping",       note: "",                   date: "Aug 22, 2026", amount: 65.0 },
  { id: 4, icon: "🎬", title: "Movie",      category: "Entertainment",  note: "",                   date: "Aug 20, 2026", amount: 15.0 },
];

const MONTHLY_DATA = [
  { month: "Jan", amount: 320 }, { month: "Feb", amount: 410 },
  { month: "Mar", amount: 280 }, { month: "Apr", amount: 520 },
  { month: "May", amount: 390 }, { month: "Jun", amount: 300 },
  { month: "Jul", amount: 350 }, { month: "Aug", amount: 430 },
];

const CATEGORY_DATA = [
  { name: "Food",           value: 180, color: "#6C63FF", icon: "🍔" },
  { name: "Shopping",       value: 120, color: "#9C8FFF", icon: "🛍️" },
  { name: "Transportation", value: 70,  color: "#C4BEFF", icon: "🚗" },
  { name: "Entertainment",  value: 40,  color: "#DDD9FF", icon: "🎬" },
  { name: "Other",          value: 20,  color: "#EDE9FE", icon: "📦" },
];

const FILTER_PILLS = ["All", "Food", "Transportation", "Shopping", "Entertainment", "Bills", "Health"];
const YEARS = [2024, 2025, 2026, 2027, 2028];

const CATEGORY_ICONS = {
  Food: "🍔", Transportation: "🚗", Shopping: "🛍️",
  Entertainment: "🎬", Bills: "💡", Education: "📚", Health: "💊", Other: "📦",
};

function categoryIcon(cat) { return CATEGORY_ICONS[cat] ?? "💸"; }

function formatDisplayDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 ${className}`}
      style={{ border: "1px solid #ECEBF5", boxShadow: "0 2px 16px rgba(108,99,255,0.06)" }}
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
          const n = parseInt(raw);
          if (!isNaN(n) && n > 1900 && n < 2100) onChange(n);
          else setRaw(String(value));
          setCustomMode(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") { setRaw(String(value)); setCustomMode(false); }
        }}
        className="w-16 text-center rounded-lg text-xs outline-none"
        style={{ background: "#EDE9FE", color: "#6C63FF", fontWeight: 600, border: "1.5px solid #6C63FF", padding: "3px 6px", fontFamily: "inherit" }}
      />
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          if (e.target.value === "__custom__") { setCustomMode(true); setRaw(String(value)); }
          else onChange(Number(e.target.value));
        }}
        className="appearance-none pl-2.5 pr-6 py-1 rounded-lg text-xs cursor-pointer outline-none"
        style={{ background: "#EDE9FE", color: "#6C63FF", fontWeight: 600, border: "none", fontFamily: "inherit" }}
      >
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        <option value="__custom__">Custom…</option>
      </select>
      <ChevronDown size={10} className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" style={{ color: "#6C63FF" }} />
    </div>
  );
}

// ─── Charts ───────────────────────────────────────────────────────────────────

function CategoryDonut({ data }) {
  const total = data.reduce((s, c) => s + c.value, 0);
  return (
    <Card className="flex flex-col">
      <div className="mb-3">
        <h2 className="text-base" style={{ fontWeight: 700, color: "#111827" }}>Spending by Category</h2>
        <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>August 2026 • Total: ${total}</p>
      </div>
      <div className="relative flex items-center justify-center mb-3" style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={46} outerRadius={66} paddingAngle={3} dataKey="value" startAngle={90} endAngle={450}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #ECEBF5", fontSize: 12, fontFamily: "inherit" }} formatter={(v, name) => [`$${v}`, name]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-xl" style={{ fontWeight: 800, color: "#111827" }}>${total}</p>
          <p className="text-[10px]" style={{ color: "#9CA3AF" }}>Total</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {data.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
              <span className="text-xs" style={{ color: "#374151", fontWeight: 500 }}>{cat.icon} {cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full" style={{ width: Math.round((cat.value / total) * 70), height: 4, background: cat.color, opacity: 0.7 }} />
              <span className="text-xs tabular-nums" style={{ fontWeight: 600, color: "#111827", minWidth: 32, textAlign: "right" }}>${cat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Expense row ──────────────────────────────────────────────────────────────

function ExpenseRow({ expense, onDelete }) {
  return (
    <div className="flex items-center py-3.5 gap-4 group hover:bg-purple-50 -mx-5 px-5 transition-colors rounded-xl">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background: "#F4F2FF" }}>{expense.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm" style={{ fontWeight: 600, color: "#111827" }}>{expense.title}</p>
          <span className="px-2 py-0.5 rounded-md text-[10px]" style={{ background: "#EDE9FE", color: "#6C63FF", fontWeight: 600 }}>{expense.category}</span>
        </div>
        {expense.note && <p className="text-xs mt-0.5 truncate" style={{ color: "#9CA3AF" }}>{expense.note}</p>}
      </div>
      <p className="text-xs shrink-0" style={{ color: "#9CA3AF" }}>{expense.date}</p>
      <p className="text-sm tabular-nums shrink-0" style={{ fontWeight: 700, color: "#EF4444", minWidth: 60, textAlign: "right" }}>
        -${expense.amount.toFixed(2)}
      </p>
      <button
        onClick={() => onDelete(expense.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 shrink-0"
        style={{ color: "#EF4444" }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Expense records card ────────────────────────────────────────────────────

function ExpenseRecords({ expenses, onDelete }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? expenses : expenses.filter((e) => e.category === activeFilter);

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base" style={{ fontWeight: 700, color: "#111827" }}>Recorded Expenses</h2>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Your recent transactions</p>
        </div>
        <span className="text-xs tabular-nums" style={{ color: "#9CA3AF" }}>{filtered.length} items</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTER_PILLS.map((pill) => (
          <button key={pill} onClick={() => setActiveFilter(pill)} className="px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ background: activeFilter === pill ? "#6C63FF" : "#F4F2FF", color: activeFilter === pill ? "#fff" : "#6C63FF", fontWeight: 600, border: activeFilter === pill ? "1.5px solid #6C63FF" : "1.5px solid #EDE9FE", fontFamily: "inherit" }}>
            {pill}
          </button>
        ))}
      </div>
      <div className="flex flex-col divide-y" style={{ borderColor: "#F9F8FF" }}>
        {filtered.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2" style={{ color: "#9CA3AF" }}>
            <span className="text-3xl">💸</span>
            <p className="text-sm">No expenses in this category</p>
          </div>
        ) : filtered.map((exp) => (
          <ExpenseRow key={exp.id} expense={exp} onDelete={onDelete} />
        ))}
      </div>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [expenses, setExpenses]       = useState(SEED_EXPENSES);
  const [showModal, setShowModal]     = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);

  const addExpense = useCallback((form) => {
    setExpenses((prev) => [{
      id: Date.now(),
      icon: categoryIcon(form.category),
      title: form.title,
      category: form.category,
      note: form.description || "",
      date: formatDisplayDate(form.date),
      amount: parseFloat(form.amount) || 0,
    }, ...prev]);
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-8 py-5 shrink-0"
        style={{ borderBottom: "1px solid #ECEBF5", background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
        <div>
          <h1 className="text-2xl leading-tight" style={{ fontWeight: 800, color: "#111827" }}>Finance</h1>
          <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
            Where am I actually spending my money? Track and analyze your real expenses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-purple-50"
            style={{ border: "1.5px solid #ECEBF5", color: "#6B7280", background: "#fff" }}>
            <Bell size={18} />
          </button>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "#6C63FF", fontWeight: 700 }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-5" style={{ background: "#F4F2FF" }}>

        {/* Top row */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 0.65fr" }}>

          {/* Bar chart */}
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-base" style={{ fontWeight: 700, color: "#111827" }}>{selectedYear} Monthly Expenses</h2>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>Annual expense breakdown</p>
              </div>
              <YearSelector value={selectedYear} onChange={setSelectedYear} />
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_DATA} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontFamily: "inherit" }} />
                <YAxis axisLine={false} tickLine={false} ticks={[100, 200, 300, 400, 500]} tickFormatter={(v) => `$${v}`} tick={{ fill: "#9CA3AF", fontSize: 11, fontFamily: "inherit" }} />
                <Tooltip cursor={{ fill: "#F4F2FF", radius: 8 }} contentStyle={{ borderRadius: 12, border: "1px solid #ECEBF5", fontFamily: "inherit", fontSize: 12 }} formatter={(v) => [`$${v}`, "Expense"]} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {MONTHLY_DATA.map((entry) => (
                    <Cell key={entry.month} fill={entry.month === "Aug" ? "#6C63FF" : "#EDE9FE"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <CategoryDonut data={CATEGORY_DATA} />
        </div>

        {/* Expense records */}
        <ExpenseRecords expenses={expenses} onDelete={removeExpense} />
      </div>

      {/* Modal */}
      {showModal && (
        <AddExpenseModal onClose={() => setShowModal(false)} onSubmit={addExpense} />
      )}
    </div>
  );
}
