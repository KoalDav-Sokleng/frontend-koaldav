import { useState, useRef, useEffect } from "react";
import { Bell, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import {
  formatDaysLeft,
  getGoalTypeMeta,
  getNotificationRoute,
} from "../utils/notificationHelpers";

export default function NotificationBell() {
  const { notifications, unreadCount, hasUnread, markNotificationAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const recentNotifications = (notifications || []).slice(0, 5);

  const handleNotificationClick = async (n) => {
    if (!n.isRead) {
      await markNotificationAsRead(n.id);
    }
    setOpen(false);
    const targetRoute = getNotificationRoute(n);
    navigate(targetRoute);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`Open notifications${hasUnread ? ` (${unreadCount} unread)` : ""}`}
        className="relative flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-4 h-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white shadow-2xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Notifications
              </h4>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0
                  ? `${unreadCount} unread deadline alerts`
                  : "All caught up"}
              </p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notification");
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {recentNotifications.length === 0 ? (
              <div className="py-8 text-center px-4">
                <Bell className="mx-auto h-6 w-6 text-slate-300 mb-2" />
                <p className="text-xs text-slate-500 font-medium">
                  No notifications yet
                </p>
              </div>
            ) : (
              recentNotifications.map((n) => {
                const meta = getGoalTypeMeta(n.goalType);
                const Icon = meta.icon;
                const isUnread = !n.isRead;

                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                      isUnread ? "bg-indigo-50/20" : ""
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5 ${meta.iconBg}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-semibold truncate ${
                            isUnread ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {n.goalTitle}
                        </span>
                        {isUnread && (
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {n.warningMessage || "Deadline approaching"}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center text-[10px] font-medium rounded px-1.5 py-0.2 border ${meta.badgeBg}`}
                        >
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-medium">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDaysLeft(n.daysLeft)}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 mt-2" />
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 px-4 pt-2 pb-1 text-center">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/notification");
              }}
              className="w-full py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              See all notifications &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
