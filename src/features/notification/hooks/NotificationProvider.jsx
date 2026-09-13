import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as notificationApi from "../api/notificationApi";

export const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 45000;
const NOTIFICATIONS_UPDATED_EVENT = "goal-notifications-updated";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getAllNotifications();
      if (mountedRef.current) {
        setNotifications(Array.isArray(data) ? data : []);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) setError(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      setLoading(true);
      await fetchNotifications();
    };

    init();

    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") fetchNotifications();
    };
    const refreshFromSync = () => fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);

    window.addEventListener("focus", refreshWhenVisible);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshFromSync);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      window.removeEventListener("focus", refreshWhenVisible);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshFromSync);
    };
  }, [fetchNotifications]);

  const markNotificationAsRead = useCallback(
    async (id) => {
      if (!id) return;

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );

      try {
        await notificationApi.markAsRead(id);
        window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
      } catch (err) {
        console.error("Error marking as read:", err);
        fetchNotifications();
      }
    },
    [fetchNotifications],
  );

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => n.isRead === false),
    [notifications],
  );

  const hasUnread = unreadNotifications.length > 0;
  const unreadCount = unreadNotifications.length;

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      hasUnread,
      loading,
      error,
      markNotificationAsRead,
    }),
    [
      notifications,
      unreadCount,
      hasUnread,
      loading,
      error,
      markNotificationAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
