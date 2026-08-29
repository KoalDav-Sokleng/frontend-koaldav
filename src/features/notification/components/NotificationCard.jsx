import { CalendarDays, Clock } from "lucide-react";
import { formatDueDate, formatDaysLeft } from "../utils/notificationHelpers";

export default function NotificationCard({ notification, onOpen, onMarkRead }) {
  const isUnread = notification.isRead === false;

  const handleClick = () => {
    if (isUnread) onMarkRead(notification.id);
    onOpen(notification);
  };

  return (
    <button
      onClick={handleClick}
      className={`group w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
        isUnread
          ? "border-red-100 bg-white shadow-sm hover:bg-slate-50"
          : "border-slate-100 bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`truncate text-sm font-semibold ${
            isUnread ? "text-slate-900" : "text-slate-600"
          }`}
        >
          {notification.goalTitle}
        </span>
        {isUnread && (
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>

      {notification.warningMessage && (
        <p className="mt-1.5 truncate text-sm text-slate-700">
          {notification.warningMessage}
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDueDate(notification.deadline)}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
          <Clock className="h-3.5 w-3.5" />
          {formatDaysLeft(notification.daysLeft)}
        </span>
      </div>
    </button>
  );
}
