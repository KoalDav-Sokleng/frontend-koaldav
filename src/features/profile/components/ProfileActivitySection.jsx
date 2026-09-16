import React from "react";
import {
  Activity,
  CheckCircle2,
  PlusCircle,
  PiggyBank,
  Flame,
  CreditCard,
  Target,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

function getActivityIcon(type) {
  switch (type?.toUpperCase()) {
    case "GOAL_COMPLETED":
    case "COMPLETED":
      return {
        icon: CheckCircle2,
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        color: "text-emerald-500",
      };
    case "DEPOSIT":
    case "SAVING":
      return {
        icon: PiggyBank,
        bg: "bg-teal-50 dark:bg-teal-950/40",
        color: "text-teal-500",
      };
    case "HABIT":
    case "STREAK":
      return {
        icon: Flame,
        bg: "bg-orange-50 dark:bg-orange-950/40",
        color: "text-orange-500",
      };
    case "EXPENSE":
    case "FINANCE":
      return {
        icon: CreditCard,
        bg: "bg-rose-50 dark:bg-rose-950/40",
        color: "text-rose-500",
      };
    case "GOAL_CREATED":
    default:
      return {
        icon: Target,
        bg: "bg-purple-50 dark:bg-[#1E1B2E]",
        color: "text-[#6C63FF]",
      };
  }
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return "Recently";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const now = new Date();
  const diffMs = now - d;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProfileActivitySection({
  activities = [],
  loading = false,
}) {
  return (
    <div className="bg-white dark:bg-[#12121A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Recent Activity History
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Your actions across goals, habits, and finances
              </p>
            </div>
          </div>
        </div>

        {/* Activity Timeline List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading recent activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-[#242430]">
            <Activity
              size={24}
              className="text-slate-300 dark:text-slate-600"
            />
            <p>No recent activity recorded yet.</p>
            <p className="text-[11px] text-slate-400">
              Complete habits, add goals, or deposit to see actions here.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-[#242430]">
            {activities.slice(0, 5).map((act, idx) => {
              const {
                icon: IconComp,
                bg,
                color,
              } = getActivityIcon(act.type || act.category);
              return (
                <div
                  key={act.id || idx}
                  className="relative flex items-start justify-between gap-3"
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full ${bg} ${color} flex items-center justify-center border-2 border-white dark:border-[#12121A] shrink-0`}
                  >
                    <IconComp size={10} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {act.title || act.description || "Activity logged"}
                    </p>
                    {act.details && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {act.details}
                      </p>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatRelativeTime(
                        act.timestamp || act.date || act.createdAt,
                      )}
                    </span>
                  </div>

                  {act.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-[#1E1B2E] text-slate-600 dark:text-slate-300 shrink-0">
                      {act.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#242430] flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Showing latest {Math.min(5, activities.length)} activities
        </span>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          Dashboard <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}
