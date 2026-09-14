import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTheme } from "../../../context/ThemeContext";

function formatDisplayDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
}

export default function FinanceMiniWidget({
  monthlyData = [],
  categoryData = [],
  expenses = [],
  totalAmount = 0,
  loading = false,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Get last 6 months of data or full monthly data
  const currentMonthIdx = new Date().getMonth();
  const chartData =
    monthlyData && monthlyData.length > 0
      ? monthlyData.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1)
      : [];

  const recentExpenses = (expenses || []).slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#17171F] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Finance & Spending
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300">
                $
                {Number(totalAmount || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Expense distribution and recent transactions
            </p>
          </div>

          <Link
            to="/finance"
            className="p-1.5 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] hover:bg-purple-100 dark:hover:bg-[#25223A] transition-colors"
            title="Open Finance"
          >
            <Plus className="w-4 h-4" />
          </Link>
        </div>

        {/* Bar chart overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>Recent Monthly Trend</span>
            <span className="text-[11px] font-normal text-slate-400">
              USD ($)
            </span>
          </div>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.length > 0 ? chartData : monthlyData}
                barSize={20}
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
                    border: isDark ? "1px solid #2B2A3D" : "1px solid #ECEBF5",
                    backgroundColor: isDark ? "#17171F" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827",
                    fontSize: 12,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                  }}
                  itemStyle={{
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                  formatter={(v) => [`$${Number(v).toFixed(2)}`, "Expense"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {(chartData.length > 0 ? chartData : monthlyData).map(
                    (entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={
                          entry.amount > 0
                            ? "#6C63FF"
                            : isDark
                              ? "#242430"
                              : "#EDE9FE"
                        }
                      />
                    ),
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category tags */}
        {categoryData && categoryData.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Top Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categoryData.slice(0, 4).map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-50 dark:bg-[#242430] border border-slate-100 dark:border-slate-700/80"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: cat.color || "#6C63FF" }}
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                    {cat.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-[11px] tabular-nums">
                    ${Number(cat.value || 0).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent transactions */}
        <div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Recent Expenses
          </p>
          <div className="space-y-2">
            {loading ? (
              <div className="py-4 text-center text-slate-400 text-xs">
                Loading expenses...
              </div>
            ) : recentExpenses.length === 0 ? (
              <div className="py-4 text-center text-slate-400 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                No recent expenses recorded
              </div>
            ) : (
              recentExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 dark:bg-[#1A1A24]/60 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base shrink-0">
                      {exp.icon || "💸"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {exp.title}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {exp.category} • {formatDisplayDate(exp.date)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-500 dark:text-rose-400 tabular-nums shrink-0 ml-2">
                    -${Number(exp.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Track expenses & budget
        </span>
        <Link
          to="/finance"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          View Full Finance <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
