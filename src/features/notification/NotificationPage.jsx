import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  BellOff,
  Clock,
  Loader2,
  AlertCircle,
  ExternalLink,
  X,
} from "lucide-react";
import { useNotifications } from "./hooks/useNotifications";
import NotificationCard from "./components/NotificationCard";
import {
  formatDueDate,
  formatDaysLeft,
  getGoalTypeMeta,
  getNotificationRoute,
} from "./utils/notificationHelpers";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-[#17171F] py-14 text-center">
      <BellOff className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        No notifications yet
      </p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        Alerts about Project, Saving, and Trip goal deadlines will show up here.
      </p>
    </div>
  );
}

export default function NotificationPage() {
  const { notifications, unreadCount, loading, error, markNotificationAsRead } =
    useNotifications();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const handleOpen = (notification) => {
    setSelected(notification);
  };

  const handleMarkReadFromModal = async () => {
    if (selected && !selected.isRead) {
      await markNotificationAsRead(selected.id);
      setSelected((prev) => (prev ? { ...prev, isRead: true } : prev));
    }
  };

  const unread = notifications.filter((n) => n.isRead === false);
  const read = notifications.filter((n) => n.isRead !== false);

  const goToGoal = async (notification = selected) => {
    if (!notification) return;
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id);
    }
    const targetRoute = getNotificationRoute(notification);
    navigate(targetRoute);
    setSelected(null);
  };

  const selectedMeta = selected ? getGoalTypeMeta(selected.goalType) : null;
  const SelectedIcon = selectedMeta ? selectedMeta.icon : null;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-[#0F0F14] px-4 py-6 sm:px-6">
      <button
        onClick={() => navigate("/goal")}
        className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Goals
      </button>

      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {unreadCount > 0
                ? `${unreadCount} unread deadline alerts`
                : "You're all caught up"}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#17171F] py-14 text-center">
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#6C63FF]" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Loading notifications...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-[#17171F] py-14 text-center">
            <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load notifications
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              {error.message || "Something went wrong"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            {unread.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Unread ({unread.length})
                </h2>
                <div className="space-y-2.5">
                  {unread.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onOpen={handleOpen}
                      onMarkRead={markNotificationAsRead}
                    />
                  ))}
                </div>
              </section>
            )}

            {read.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Read
                </h2>
                <div className="space-y-2.5">
                  {read.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onOpen={handleOpen}
                      onMarkRead={markNotificationAsRead}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md my-auto space-y-4 rounded-2xl bg-white dark:bg-[#17171F] dark:border dark:border-slate-700 p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Deadline Alert
                  </div>
                  {selectedMeta && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${selectedMeta.badgeBg}`}
                    >
                      {SelectedIcon && <SelectedIcon className="h-3 w-3" />}
                      {selectedMeta.label}
                    </span>
                  )}
                </div>
                <h3 className="mt-2.5 text-lg font-semibold text-slate-900 dark:text-white">
                  {selected.goalTitle}
                </h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {selected.warningMessage}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5 rounded-xl bg-slate-50 dark:bg-[#242430] p-3.5 text-xs text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Goal Type:
                </span>{" "}
                {selectedMeta?.label || selected.goalType}
              </p>
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Target Deadline:
                </span>{" "}
                {formatDueDate(selected.deadline)}
              </p>
              <p>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Days Remaining:
                </span>{" "}
                <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <Clock className="h-3 w-3" />
                  {formatDaysLeft(selected.daysLeft)}
                </span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {!selected.isRead && (
                <button
                  onClick={handleMarkReadFromModal}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => goToGoal(selected)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248e5] transition-colors"
              >
                Go to {selectedMeta?.label || "Goal"}
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
