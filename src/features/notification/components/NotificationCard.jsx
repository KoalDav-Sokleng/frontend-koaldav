import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import {
  formatDueDate,
  formatDaysLeft,
  getGoalTypeMeta,
} from "../utils/notificationHelpers";

export default function NotificationCard({ notification, onOpen, onMarkRead }) {
  const isUnread = notification.isRead === false;
  const meta = getGoalTypeMeta(notification.goalType);
  const TypeIcon = meta.icon;

  const handleClick = () => {
    if (isUnread && onMarkRead) onMarkRead(notification.id);
    onOpen(notification);
  };

  return (
    <button
      onClick={handleClick}
      className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
        isUnread
          ? "border-rose-100 bg-white shadow-sm hover:border-rose-200 hover:bg-slate-50/70"
          : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/70"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Module Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}
        >
          <TypeIcon className="h-5 w-5" />
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${meta.badgeBg}`}
              >
                {meta.label}
              </span>
              <span
                className={`truncate text-sm font-semibold ${
                  isUnread ? "text-slate-900" : "text-slate-700"
                }`}
              >
                {notification.goalTitle}
              </span>
            </div>
            {isUnread && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />
            )}
          </div>

          {notification.warningMessage && (
            <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">
              {notification.warningMessage}
            </p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDueDate(notification.deadline)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                <Clock className="h-3.5 w-3.5" />
                {formatDaysLeft(notification.daysLeft)}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
              View goal <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
