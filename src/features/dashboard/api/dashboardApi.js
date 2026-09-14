// src/features/dashboard/api/dashboardApi.js
import { apiFetch } from "../../../api/client";
import { getGarden, getHabits } from "../../habit/api/habitApi";
import { getProjectGoals } from "../../goal/api/goalApi";
import { getSavingGoals } from "../../goal/api/savingApi";
import { getFinanceOverview, getExpenses } from "../../finance/api/financeApi";
import { getGoalNotifications } from "../../notification/api/notificationApi";

/**
 * Primary Aggregator Endpoint:
 * GET /api/dashboard?userId={userId}
 *
 * Fetches all dashboard metrics in a single roundtrip, with graceful
 * fallback to individual endpoints if the aggregator is unavailable.
 */
export async function getDashboardData(userId = 1) {
  try {
    const res = await apiFetch(`/dashboard?userId=${userId}`);
    if (res && (res.garden || res.habits || res.activeGoals || res.financeOverview)) {
      return res;
    }
  } catch (err) {
    console.warn("Aggregated /api/dashboard failed or not available, falling back to modular endpoints:", err.message);
  }

  // Graceful fallback to modular REST endpoints
  const [
    gardenRes,
    habitsRes,
    goalsRes,
    savingRes,
    financeRes,
    expensesRes,
    notificationsRes,
  ] = await Promise.allSettled([
    getGarden(),
    getHabits(),
    getProjectGoals(),
    getSavingGoals(),
    getFinanceOverview(new Date().getFullYear()),
    getExpenses({ year: new Date().getFullYear(), limit: 10 }),
    getGoalNotifications(),
  ]);

  const garden = gardenRes.status === "fulfilled" ? gardenRes.value : {
    streak: 0,
    bestStreak: 0,
    growthStage: 0,
    freezes: 0,
    freezeUsedDates: [],
    lastPerfectDate: null,
  };

  const habits = habitsRes.status === "fulfilled" && Array.isArray(habitsRes.value)
    ? habitsRes.value
    : [];

  const allGoals = goalsRes.status === "fulfilled" && Array.isArray(goalsRes.value)
    ? goalsRes.value
    : [];

  const activeGoals = allGoals.filter(
    (g) => g.status !== "COMPLETED" && g.status !== "MISSED"
  );
  const completedGoalsCount = allGoals.filter((g) => g.status === "COMPLETED").length;

  const savingGoals = savingRes.status === "fulfilled" && Array.isArray(savingRes.value)
    ? savingRes.value
    : [];

  const activeSavingGoals = savingGoals.filter((g) => {
    const target = Number(g.targetAmount) || 0;
    const current = Number(g.currentAmount) || 0;
    return g.status !== "COMPLETED" && g.status !== "MISSED" && !(target > 0 && current >= target);
  });

  const totalSavedAmount = savingGoals.reduce(
    (sum, g) => sum + (Number(g.currentAmount) || 0),
    0
  );
  const totalTargetSavings = savingGoals.reduce(
    (sum, g) => sum + (Number(g.targetAmount) || 0),
    0
  );

  const financeOverview = financeRes.status === "fulfilled" && financeRes.value
    ? financeRes.value
    : { totalAmount: 0, monthlyData: [], categoryData: [] };

  const recentExpenses = expensesRes.status === "fulfilled" && expensesRes.value
    ? (Array.isArray(expensesRes.value.expenses) ? expensesRes.value.expenses : (Array.isArray(expensesRes.value) ? expensesRes.value : []))
    : [];

  const unreadNotifications = notificationsRes.status === "fulfilled" && Array.isArray(notificationsRes.value)
    ? notificationsRes.value.filter((n) => !n.isRead)
    : [];

  return {
    garden,
    habits,
    activeGoals,
    totalGoalsCount: allGoals.length,
    completedGoalsCount,
    activeSavingGoals,
    totalSavedAmount,
    totalTargetSavings,
    financeOverview: {
      ...financeOverview,
      recentExpenses,
    },
    unreadNotifications,
    unreadNotificationsCount: unreadNotifications.length,
  };
}

