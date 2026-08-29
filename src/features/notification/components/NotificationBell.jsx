import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationBell() {
  const { unreadCount, hasUnread } = useNotifications();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/notification")}
      aria-label={`Open notifications${hasUnread ? ` (${unreadCount} unread)` : ""}`}
      className="relative flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
    >
      <Bell className="h-5 w-5" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 inline-flex min-w-4 h-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
}
