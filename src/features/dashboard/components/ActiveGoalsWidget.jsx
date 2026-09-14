import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  PiggyBank,
  Compass,
  ArrowRight,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
} from "lucide-react";
import { goalProgress } from "../../goal/utils/goalHelpers";

function formatCurrency(n) {
  return (
    "$" + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "No deadline";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function ActiveGoalsWidget({
  projectGoals = [],
  savingGoals = [],
  tripGoals = [],
  loading = false,
}) {
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  // Normalize project goals
  const activeProjects = projectGoals
    .filter((g) => g.status !== "COMPLETED" && g.status !== "MISSED")
    .map((g) => ({
      id: g.id,
      title: g.title,
      type: "PROJECT",
      progress: goalProgress(g),
      deadline: g.deadline,
      category: g.category || "Project",
      meta: `${g.milestones?.length || 0} milestones`,
      link: `/goal?goalId=${g.id}`,
    }));

  // Normalize saving goals
  const activeSavings = savingGoals
    .filter((g) => {
      const target = Number(g.targetAmount) || 0;
      const current = Number(g.currentAmount) || 0;
      return (
        g.status !== "COMPLETED" &&
        g.status !== "MISSED" &&
        !(target > 0 && current >= target)
      );
    })
    .map((g) => {
      const target = Number(g.targetAmount) || 1;
      const current = Number(g.currentAmount) || 0;
      const pct = Math.min(100, Math.round((current / target) * 100));
      return {
        id: g.id,
        title: g.title,
        type: "SAVING",
        progress: pct,
        deadline: g.deadline,
        category: "Saving",
        meta: `${formatCurrency(current)} of ${formatCurrency(target)}`,
        link: `/goal/saving?goalId=${g.id}`,
      };
    });

  // Normalize trip goals
  const activeTrips = tripGoals
    .filter((g) => {
      const target = Number(g.target) || 0;
      const saved = Number(g.saved) || 0;
      return (
        g.status !== "COMPLETED" &&
        g.status !== "MISSED" &&
        !(target > 0 && saved >= target)
      );
    })
    .map((g) => {
      const target = Number(g.target) || 1;
      const saved = Number(g.saved) || 0;
      const pct = Math.min(100, Math.round((saved / target) * 100));
      return {
        id: g.id,
        title: g.name || g.title,
        type: "TRIP",
        progress: pct,
        deadline: g.deadline,
        category: "Trip",
        meta: `${formatCurrency(saved)} of ${formatCurrency(target)}`,
        link: `/goal/trip?goalId=${g.id}`,
      };
    });

  let displayedGoals = [];
  if (filter === "ALL") {
    displayedGoals = [...activeProjects, ...activeSavings, ...activeTrips];
  } else if (filter === "PROJECT") {
    displayedGoals = activeProjects;
  } else if (filter === "SAVING") {
    displayedGoals = activeSavings;
  } else if (filter === "TRIP") {
    displayedGoals = activeTrips;
  }

  // Sort by deadline urgency
  displayedGoals.sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const topGoals = displayedGoals.slice(0, 5);

  const getTypeIcon = (type) => {
    switch (type) {
      case "PROJECT":
        return <FolderKanban className="w-4 h-4 text-[#6C63FF]" />;
      case "SAVING":
        return <PiggyBank className="w-4 h-4 text-emerald-500" />;
      case "TRIP":
        return <Compass className="w-4 h-4 text-sky-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#6C63FF]" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "PROJECT":
        return "bg-purple-50 dark:bg-purple-950/40 text-[#6C63FF] dark:text-[#A49DFF] border-purple-200 dark:border-purple-800/50";
      case "SAVING":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
      case "TRIP":
        return "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/50";
      default:
        return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <div className="bg-white dark:bg-[#17171F] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-colors flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Ongoing Goals
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF]">
              {displayedGoals.length} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track milestones, budgets, and deadlines in progress
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#242430] p-1 rounded-xl shrink-0 self-start sm:self-auto">
          {[
            { id: "ALL", label: "All" },
            { id: "PROJECT", label: "Projects" },
            { id: "SAVING", label: "Savings" },
            { id: "TRIP", label: "Trips" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-white dark:bg-[#17171F] text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goal list */}
      <div className="flex-1 space-y-3">
        {loading ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
            Loading active goals...
          </div>
        ) : topGoals.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6">
            <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No active goals in this view
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
              Create a new project, savings, or trip goal to get started!
            </p>
            <Link
              to="/goal"
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#6C63FF] hover:bg-[#5B52E6] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create Goal
            </Link>
          </div>
        ) : (
          topGoals.map((goal) => {
            const leftDays = daysLeft(goal.deadline);
            const isUrgent =
              leftDays !== null && leftDays <= 3 && leftDays >= 0;
            const isPastDue = leftDays !== null && leftDays < 0;

            return (
              <div
                key={`${goal.type}-${goal.id}`}
                onClick={() => navigate(goal.link)}
                className="group p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1A1A24]/60 hover:bg-white dark:hover:bg-[#1E1E2A] hover:border-slate-200 dark:hover:border-slate-700 shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white dark:bg-[#242430] border border-slate-200/60 dark:border-slate-700 shrink-0">
                      {getTypeIcon(goal.type)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#6C63FF] dark:group-hover:text-[#A49DFF] transition-colors">
                        {goal.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {goal.meta}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getTypeColor(
                        goal.type,
                      )}`}
                    >
                      {goal.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {goal.progress}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-200/70 dark:bg-slate-700/60 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      goal.progress >= 100
                        ? "bg-emerald-500"
                        : goal.type === "PROJECT"
                          ? "bg-[#6C63FF]"
                          : goal.type === "SAVING"
                            ? "bg-emerald-500"
                            : "bg-sky-500"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {/* Bottom row: deadline and urgency */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {formatDate(goal.deadline)}
                  </span>
                  {leftDays !== null && (
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        isPastDue
                          ? "text-rose-500 dark:text-rose-400"
                          : isUrgent
                            ? "text-amber-500 dark:text-amber-400"
                            : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {isPastDue
                        ? "Past deadline"
                        : leftDays === 0
                          ? "Due today"
                          : `${leftDays}d remaining`}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Showing up to 5 priority goals
        </span>
        <Link
          to="/goal"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          View All Goals <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
