import React, { useState } from "react";
import {
  Target,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileGoalProgressSection({
  goalsData,
  loading = false,
}) {
  const [filter, setFilter] = useState("ALL"); // "ALL" | "ACTIVE" | "COMPLETED"

  const rawGoals = goalsData?.goals || [];
  const totalGoals = goalsData?.totalGoals ?? rawGoals.length;
  const activeGoals =
    goalsData?.activeGoals ??
    rawGoals.filter((g) => g.status !== "COMPLETED" && g.status !== "MISSED")
      .length;
  const completedGoals =
    goalsData?.completedGoals ??
    rawGoals.filter((g) => g.status === "COMPLETED").length;

  const filteredGoals = rawGoals.filter((g) => {
    if (filter === "ACTIVE")
      return g.status !== "COMPLETED" && g.status !== "MISSED";
    if (filter === "COMPLETED") return g.status === "COMPLETED";
    return true;
  });

  const completionRate =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="bg-white dark:bg-[#12121A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] flex items-center justify-center font-bold">
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Goal Progress & Milestones
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {activeGoals} in progress • {completedGoals} completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-[#1A1A24] border border-slate-200/60 dark:border-[#242430]">
              {["ALL", "ACTIVE", "COMPLETED"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filter === f
                      ? "bg-white dark:bg-[#12121A] text-[#6C63FF] dark:text-white shadow-xs font-bold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f === "ALL" ? "All" : f === "ACTIVE" ? "Active" : "Done"}
                </button>
              ))}
            </div>

            <Link
              to="/goal"
              className="p-2 rounded-xl bg-[#6C63FF] text-white hover:bg-[#5B52E6] shadow-sm transition-all cursor-pointer"
              title="Add or manage goals"
            >
              <Plus size={15} />
            </Link>
          </div>
        </div>

        {/* Completion Overview Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#6C63FF]/10 via-indigo-500/5 to-purple-500/10 border border-[#6C63FF]/20 dark:border-[#6C63FF]/30 mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles size={14} className="text-[#6C63FF]" /> Overall
              Completion Rate
            </span>
            <span className="font-extrabold text-[#6C63FF] dark:text-[#A49DFF] tabular-nums">
              {completionRate}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-[#242430] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6C63FF] to-indigo-400 transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading goal data...
            </div>
          ) : filteredGoals.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-[#242430]">
              <Target
                size={24}
                className="text-slate-300 dark:text-slate-600"
              />
              <p>No goals found in this filter.</p>
              <Link
                to="/goal"
                className="text-xs font-bold text-[#6C63FF] hover:underline"
              >
                + Create a new goal
              </Link>
            </div>
          ) : (
            filteredGoals.slice(0, 5).map((goal, idx) => {
              const pct = Number(goal.progress || goal.percentage || 0);
              const isDone = goal.status === "COMPLETED" || pct >= 100;
              return (
                <div
                  key={goal.id || idx}
                  className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-[#171722] border border-slate-100 dark:border-[#242430] hover:border-purple-200 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">
                        {goal.icon || (isDone ? "🏆" : "🎯")}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {goal.title || goal.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{goal.category || "Project Goal"}</span>
                          {goal.deadline && (
                            <span className="flex items-center gap-0.5">
                              • <Calendar size={10} />{" "}
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          isDone
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-[#6C63FF] dark:text-[#A49DFF]"
                        }`}
                      >
                        {pct}%
                      </span>
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <Clock size={16} className="text-amber-500" />
                      )}
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#242430] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? "bg-emerald-500" : "bg-[#6C63FF]"
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
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
          Showing {Math.min(5, filteredGoals.length)} of {filteredGoals.length}{" "}
          goals
        </span>
        <Link
          to="/goal"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          View All Goals <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
