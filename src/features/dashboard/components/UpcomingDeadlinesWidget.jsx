import { Link } from "react-router-dom";
import {
  Bell,
  Calendar,
  AlertTriangle,
  ArrowRight,
  FolderKanban,
  PiggyBank,
  Compass,
} from "lucide-react";

function formatDueDate(dateStr) {
  if (!dateStr) return "No date set";
  const d = new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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

export default function UpcomingDeadlinesWidget({
  notifications = [],
  unreadCount = 0,
  projectGoals = [],
  savingGoals = [],
  tripGoals = [],
}) {
  // Collect all items with deadlines
  const allDeadlines = [];

  // Prioritize unread deadline notifications if available
  if (Array.isArray(notifications) && notifications.length > 0) {
    notifications.forEach((n) => {
      allDeadlines.push({
        id: `n-${n.id}`,
        title: n.goalTitle || "Goal Target Deadline",
        type: "Alert",
        icon: AlertTriangle,
        deadline: n.deadline,
        link: "/notification",
        iconColor: "text-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-950/60",
      });
    });
  }

  projectGoals
    .filter((g) => g.deadline && g.status !== "COMPLETED")
    .forEach((g) => {
      allDeadlines.push({
        id: `p-${g.id}`,
        title: g.title,
        type: "Project",
        icon: FolderKanban,
        deadline: g.deadline,
        link: `/goal?goalId=${g.id}`,
        iconColor: "text-[#6C63FF]",
        iconBg: "bg-purple-100 dark:bg-[#1E1B2E]",
      });
    });

  savingGoals
    .filter((g) => g.deadline && g.status !== "COMPLETED")
    .forEach((g) => {
      allDeadlines.push({
        id: `s-${g.id}`,
        title: g.title,
        type: "Saving",
        icon: PiggyBank,
        deadline: g.deadline,
        link: `/goal/saving?goalId=${g.id}`,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-100 dark:bg-emerald-950/60",
      });
    });

  tripGoals
    .filter((g) => g.deadline && g.status !== "COMPLETED")
    .forEach((g) => {
      allDeadlines.push({
        id: `t-${g.id}`,
        title: g.name || g.title,
        type: "Trip",
        icon: Compass,
        deadline: g.deadline,
        link: `/goal/trip?goalId=${g.id}`,
        iconColor: "text-sky-600 dark:text-sky-400",
        iconBg: "bg-sky-100 dark:bg-sky-950/60",
      });
    });

  // Sort upcoming first
  allDeadlines.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const upcomingItems = allDeadlines.slice(0, 4);

  return (
    <div className="bg-white dark:bg-[#17171F] rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Upcoming Deadlines
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {unreadCount} Alerts
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep an eye on key goal target milestones
            </p>
          </div>

          <Link
            to="/notification"
            className="p-2 rounded-xl bg-purple-50 dark:bg-[#1E1B2E] text-[#6C63FF] dark:text-[#A49DFF] hover:bg-purple-100 dark:hover:bg-[#25223A] transition-colors relative"
            title="View Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#17171F]" />
            )}
          </Link>
        </div>

        {/* Deadlines list */}
        <div className="space-y-2.5">
          {upcomingItems.length === 0 ? (
            <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No upcoming goal deadlines recorded
            </div>
          ) : (
            upcomingItems.map((item) => {
              const days = daysLeft(item.deadline);
              const isUrgent = days !== null && days <= 3 && days >= 0;
              const isPast = days !== null && days < 0;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-[#1A1A24]/60 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-[#1E1E2A] hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#6C63FF] dark:group-hover:text-[#A49DFF] transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        {item.type} • {formatDueDate(item.deadline)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                      isPast
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300"
                        : isUrgent
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                          : "bg-slate-100 dark:bg-[#242430] text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {isPast
                      ? "Past due"
                      : days === 0
                        ? "Due today"
                        : `${days}d left`}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          Deadline reminders active
        </span>
        <Link
          to="/notification"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          Notification Center <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
