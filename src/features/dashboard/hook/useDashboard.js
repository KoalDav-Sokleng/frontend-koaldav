// src/features/dashboard/hook/useDashboard.js
import { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../api/dashboardApi";
import { toggleHabitDone } from "../../habit/api/habitApi";
import { useDashboardWebSocket } from "../hooks/useDashboardWebSocket";

export function useDashboard(userId = 1) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastAlert, setToastAlert] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardData(userId);
      setData(response);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Handle incoming live WebSocket STOMP notification
  const handleLiveNotification = useCallback((notification) => {
    setToastAlert(notification);
    setData((prev) => {
      if (!prev) return prev;
      const unread = [notification, ...(prev.unreadNotifications || [])];
      return {
        ...prev,
        unreadNotifications: unread,
        unreadNotificationsCount: unread.length,
      };
    });
  }, []);

  const { connected } = useDashboardWebSocket(userId, handleLiveNotification);

  // Optimistic / reactive toggle habit directly from dashboard
  const handleToggleHabit = useCallback(
    async (habitId) => {
      const today = new Date().toISOString().split("T")[0];
      const res = await toggleHabitDone(habitId, today);
      setData((prev) => {
        if (!prev) return prev;
        const updatedHabits = (prev.habits || []).map((h) =>
          h.id === habitId ? (res.habit || { ...h, completed: !h.completed }) : h
        );
        return {
          ...prev,
          habits: updatedHabits,
          garden: res.garden || prev.garden,
        };
      });
      return res;
    },
    []
  );

  return {
    data,
    loading,
    error,
    refresh: fetchDashboard,
    toggleHabit: handleToggleHabit,
    wsConnected: connected,
    toastAlert,
    dismissToast: () => setToastAlert(null),
  };
}

