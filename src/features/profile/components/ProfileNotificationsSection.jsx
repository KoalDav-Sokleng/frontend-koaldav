import React from "react";
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

function getNotificationIcon(type, priority) {
  if (
    priority === "HIGH" ||
    type === "DEADLINE_WARNING" ||
    type === "OVERDUE"
  ) {
    return {
      icon: AlertTriangle,
      bg: "bg-rose-50 dark:bg-rose-950/40",
      color: "text-rose-500",
      border: "border-rose-100 dark:border-rose-900/40",
    };
  }
  if (type === "MILESTONE_COMPLETED" || type === "GOAL_COMPLETED") {
    return {
      icon: CheckCircle2,
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      color: "text-emerald-500",
      border: "border-emerald-100 dark:border-emerald-900/40",
    };
  }
  return {
    icon: Info,
    bg: "bg-purple-50 dark:bg-[#1E1B2E]",
    color: "text-[#6C63FF]",
    border: "border-purple-100 dark:border-purple-900/40",
  };
}

function formatTime(dateStr) {
  if (!dateStr) return "Just now";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProfileNotificationsSection({
  notificationsData,
  loading = false,
}) {
  const notifsList = notificationsData?.notifications || [];
  const unreadCount =
    notificationsData?.unreadCount ??
    notifsList.filter((n) => !n.read && !n.isRead).length;

  return (
    <div className="bg-white dark:bg-[#12121A] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-[#1E1B2E] shadow-sm transition-colors flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-[#12121A]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Unread Alerts & Notifications
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {unreadCount > 0
                  ? `${unreadCount} unread notices requiring attention`
                  : "All notifications caught up"}
              </p>
            </div>
          </div>

          <Link
            to="/notification"
            className="text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] hover:underline flex items-center gap-0.5"
          >
            Open Inbox <ChevronRight size={14} />
          </Link>
        </div>

        {/* Notifications list */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading notifications...
          </div>
        ) : notifsList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 dark:border-[#242430]">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <p>You have zero unread notifications.</p>
            <p className="text-[11px] text-slate-400">
              Deadline warnings and milestone alerts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifsList.slice(0, 4).map((notif, idx) => {
              const {
                icon: IconComp,
                bg,
                color,
                border,
              } = getNotificationIcon(notif.type, notif.priority);
              const isUnread = !notif.read && !notif.isRead;
              return (
                <div
                  key={notif.id || idx}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isUnread
                      ? "bg-[#FBF9FF] dark:bg-[#1A1A28] border-purple-200/80 dark:border-purple-900/50 shadow-xs"
                      : "bg-slate-50/40 dark:bg-[#151520] border-slate-100 dark:border-[#242430]"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 mt-0.5`}
                    >
                      <IconComp size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {notif.title ||
                            notif.goalTitle ||
                            "System Notification"}
                        </p>
                        {isUnread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message || notif.warningMessage || notif.content}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {formatTime(
                          notif.createdAt || notif.timestamp || notif.date,
                        )}
                      </span>
                    </div>
                  </div>

                  {notif.priority === "HIGH" && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 shrink-0">
                      HIGH
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
          Showing {Math.min(4, notifsList.length)} of {notifsList.length}{" "}
          notifications
        </span>
        <Link
          to="/notification"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#6C63FF] dark:text-[#A49DFF] hover:underline"
        >
          View Full Notifications <ExternalLink size={12} />
        </Link>
      </div>
    </div>
  );
}
