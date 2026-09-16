import React from "react";
import {
  PiggyBank,
  CheckCircle2,
  ChevronRight,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

function formatCurrency(n) {
  return (
    "$" +
    Number(n || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
}

export default function ProfileSavingsSection({
  savingsData,
  loading = false,
}) {
  const savingsList = savingsData?.savings || [];
  const totalSaved = Number(
    savingsData?.totalSaved ??
      savingsList.reduce((sum, s) => sum + (Number(s.currentAmount) || 0), 0),
  );
  const totalTarget = Number(
    savingsData?.totalTarget ??
      savingsList.reduce((sum, s) => sum + (Number(s.targetAmount) || 0), 0),
  );

  const overallPercent =
    totalTarget > 0
      ? Math.min(100, Math.round((totalSaved / totalTarget) * 100))
      : 0;

  const remaining = Math.max(0, totalTarget - totalSaved);

  return (
    <div className="bg-white dark:bg-[#12121A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <PiggyBank size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Savings Overview & Progress
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {savingsList.length} saving goals active
              </p>
            </div>
          </div>

          <Link
            to="/goal/saving"
            className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
            title="Manage Saving Goals"
          >
            <Plus size={15} />
          </Link>
        </div>

        {/* Savings KPI Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/30 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Total Accumulated Savings
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {formatCurrency(totalSaved)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold text-slate-400">
                Target Cap: {formatCurrency(totalTarget)}
              </p>
              <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {overallPercent}% Reached
              </p>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#242430] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>
              {formatCurrency(remaining)} remaining to achieve all targets
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={11} /> Healthy Growth
            </span>
          </div>
        </div>

        {/* Saving Goals Items */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading savings data...
            </div>
          ) : savingsList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-[#242430]">
              <PiggyBank
                size={24}
                className="text-slate-300 dark:text-slate-600"
              />
              <p>No saving goals active right now.</p>
              <Link
                to="/goal/saving"
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                + Create a saving goal
              </Link>
            </div>
          ) : (
            savingsList.slice(0, 4).map((goal, idx) => {
              const cur = Number(goal.currentAmount || 0);
              const tar = Number(goal.targetAmount || 0);
              const pct =
                tar > 0 ? Math.min(100, Math.round((cur / tar) * 100)) : 0;
              const isDone = pct >= 100;

              return (
                <div
                  key={goal.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#171722] border border-slate-100 dark:border-[#242430] hover:border-emerald-200 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">
                        {goal.icon === "laptop"
                          ? "💻"
                          : goal.icon === "plane"
                            ? "✈️"
                            : goal.icon === "car"
                              ? "🚗"
                              : "💰"}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {goal.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {formatCurrency(cur)} of {formatCurrency(tar)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-xs font-extrabold tabular-nums ${
                          isDone
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {pct}%
                      </span>
                      {isDone && (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#242430] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#242430] flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Showing {Math.min(4, savingsList.length)} of {savingsList.length}{" "}
          savings goals
        </span>
        <Link
          to="/goal/saving"
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          View Full Savings <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
