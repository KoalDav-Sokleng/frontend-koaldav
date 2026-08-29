import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as notificationApi from "../api/notificationApi";

export const NotificationContext = createContext(null);

const POLL_INTERVAL_MS = 10000;
const NOTIFICATIONS_UPDATED_EVENT = "goal-notifications-updated";

function isWithinThreeDays(notification) {
  const daysLeft = Number(notification.daysLeft);
  if (Number.isFinite(daysLeft)) return daysLeft >= 0 && daysLeft <= 3;

  if (!notification.deadline) return false;
  const deadline = new Date(`${notification.deadline}T23:59:59`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (deadline - today) / 86_400_000 >= 0 && (deadline - today) / 86_400_000 <= 3;
}

export function NotificationProvider({ children, userId = 1 }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getAllNotifications(userId);
      if (mountedRef.current) {
        setNotifications(Array.isArray(data) ? data : []);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) setError(err);
    }
  }, [userId]);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      try {
        await notificationApi.triggerCheck();
      } catch {
        /* backend may be unavailable */
      }
      if (mountedRef.current) {
        setLoading(true);
        await fetchNotifications();
        if (mountedRef.current) setLoading(false);
      }
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

  const markNotificationAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notificationApi.markAsRead(id);
      window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
    } catch (err) {
      console.error("Error marking as read:", err);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const recentNotifications = useMemo(
    () => notifications.filter(isWithinThreeDays),
    [notifications]
  );

  const hasUnread = recentNotifications.some((n) => !n.isRead);
  const unreadCount = recentNotifications.filter((n) => !n.isRead).length;

  const value = useMemo(
    () => ({
      notifications: recentNotifications,
      unreadCount,
      hasUnread,
      loading,
      error,
      markNotificationAsRead,
    }),
    [recentNotifications, unreadCount, hasUnread, loading, error, markNotificationAsRead]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
