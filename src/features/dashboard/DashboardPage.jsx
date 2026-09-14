import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  CreditCard,
  Calendar as CalendarIcon,
  Radio,
  X,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../auth/hooks/useAuth";
import { useDashboard } from "./hook/useDashboard";
import { useProjectGoals } from "../goal/hooks/useProjectGoals";
import { useSavingGoals } from "../goal/hooks/useSavingGoals";
import { useTripGoals } from "../goal/hooks/useTripGoals";

import DashboardStats from "./components/DashboardStats";
import ActiveGoalsWidget from "./components/ActiveGoalsWidget";
import HabitsWidget from "./components/HabitsWidget";
import FinanceMiniWidget from "./components/FinanceMiniWidget";
import UpcomingDeadlinesWidget from "./components/UpcomingDeadlinesWidget";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const userId = user?.id || 1;

  // Primary Aggregated Hook + WebSocket STOMP Client
  const {
    data: dashboardData,
    loading: dashboardLoading,
    refresh: refreshDashboard,
    toggleHabit,
    wsConnected,
    toastAlert,
    dismissToast,
  } = useDashboard(userId);

  // Fallback / Granular Goal hooks for direct CRUD updates
  const {
    allGoals: projectGoals,
    counts: projectCounts,
    loading: projectLoading,
    refresh: refreshProjects,
  } = useProjectGoals("IN_PROGRESS");

  const {
    allGoals: savingGoals,
    counts: savingCounts,
    loading: savingLoading,
    refresh: refreshSavings,
  } = useSavingGoals("ACTIVE");

  const {
    allGoals: tripGoals,
    counts: tripCounts,
    loading: tripLoading,
    refresh: refreshTrips,
  } = useTripGoals("ACTIVE");

  // Unified refresh handler
  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await Promise.allSettled([
        refreshDashboard?.(),
        refreshProjects?.(),
        refreshSavings?.(),
        refreshTrips?.(),
      ]);
    } catch (err) {
      console.error("Error refreshing dashboard data", err);
    } finally {
      setTimeout(() => setRefreshing(false), 400);
    }
  };

  // Derive consolidated metrics
  const activeProjects =
    dashboardData?.activeGoals ||
    projectGoals.filter(
      (g) => g.status !== "COMPLETED" && g.status !== "MISSED",
    );

  const activeSavings =
    dashboardData?.activeSavingGoals ||
    savingGoals.filter(
      (g) => g.status !== "COMPLETED" && g.status !== "MISSED",
    );

  const activeTripsCount = tripCounts?.ACTIVE || 0;

  const totalActiveGoals =
    (dashboardData?.activeGoals?.length ?? activeProjects.length) +
    (dashboardData?.activeSavingGoals?.length ?? activeSavings.length) +
    activeTripsCount;

  const totalCompletedGoals =
    (dashboardData?.completedGoalsCount ?? projectCounts?.COMPLETED ?? 0) +
    (savingCounts?.COMPLETED || 0) +
    (tripCounts?.COMPLETED || 0);

  const habits = dashboardData?.habits || [];
  const habitsDoneCount = habits.filter((h) => h.completed).length;
  const habitsTotalCount = habits.length;

  const garden = dashboardData?.garden || {
    streak: 0,
    bestStreak: 0,
    growthStage: 0,
    freezes: 0,
  };

  const financeOverview = dashboardData?.financeOverview || {
    totalAmount: 0,
    monthlyData: [],
    categoryData: [],
    recentExpenses: [],
  };

  const totalSaved =
    dashboardData?.totalSavedAmount ??
    savingGoals.reduce((sum, g) => sum + (Number(g.currentAmount) || 0), 0) +
      tripGoals.reduce((sum, g) => sum + (Number(g.saved) || 0), 0);

  const totalTarget =
    dashboardData?.totalTargetSavings ??
    savingGoals.reduce((sum, g) => sum + (Number(g.targetAmount) || 0), 0) +
      tripGoals.reduce((sum, g) => sum + (Number(g.target) || 0), 0);

  const unreadNotifications = dashboardData?.unreadNotifications || [];
  const unreadCount =
    dashboardData?.unreadNotificationsCount ?? unreadNotifications.length;

  const userName = user?.name || user?.username || "Friend";
  const isLoading =
    dashboardLoading && projectLoading && savingLoading && tripLoading;

  return (
    <div className="relative min-h-full p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-[#0F0F14] text-slate-900 dark:text-white transition-colors flex flex-col gap-6">
      {/* ── Live Toast Alert Popup (WebSocket STOMP) ── */}
      {toastAlert && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-top-5 duration-300">
          <div className="rounded-2xl bg-amber-500 text-white p-4 shadow-2xl flex items-start justify-between gap-3 border border-amber-400">
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-white/20 shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-100">
                  Live Deadline Alert
                </p>
                <h4 className="text-sm font-bold truncate mt-0.5">
                  {toastAlert.goalTitle || "Goal Alert"}
                </h4>
                <p className="text-xs text-amber-50 mt-0.5 leading-relaxed">
                  {toastAlert.warningMessage || "Deadline is approaching!"}
                </p>
                <button
                  onClick={() => {
                    dismissToast();
                    navigate("/notification");
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white underline hover:text-amber-100"
                >
                  View Details <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
            <button
              onClick={dismissToast}
              className="p-1 rounded-lg text-white/80 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── 1. Hero Greeting Banner ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6C63FF] via-[#5D54F3] to-[#453DB5] p-6 sm:p-8 text-white shadow-lg">
        {/* Decorative background shapes */}
        <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-indigo-900/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-indigo-100 text-xs font-semibold uppercase tracking-wider mb-1.5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                {getFormattedDate()}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-medium backdrop-blur-sm">
                <Radio
                  className={`w-3 h-3 ${
                    wsConnected
                      ? "text-emerald-300 animate-pulse"
                      : "text-amber-300"
                  }`}
                />
                {wsConnected ? "Live Connected" : "REST Synced"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 mt-1 max-w-xl">
              You have{" "}
              <span className="font-bold underline decoration-amber-300">
                {totalActiveGoals} active goals
              </span>{" "}
              and{" "}
              <span className="font-bold underline decoration-orange-300">
                {habitsTotalCount - habitsDoneCount} habits remaining
              </span>{" "}
              today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefreshAll}
              disabled={refreshing}
              title="Refresh Dashboard"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white backdrop-blur-md border border-white/20 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => navigate("/goal")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-[#6C63FF] font-semibold text-xs sm:text-sm hover:bg-indigo-50 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
            <button
              onClick={() => navigate("/finance")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Top Summary KPI Stats ── */}
      <DashboardStats
        activeGoalsCount={totalActiveGoals}
        completedGoalsCount={totalCompletedGoals}
        habitsCompletedCount={habitsDoneCount}
        habitsTotalCount={habitsTotalCount}
        streakDays={garden?.streak || 0}
        monthlySpend={financeOverview.totalAmount || 0}
        expenseCount={financeOverview.recentExpenses?.length || 0}
        totalSaved={totalSaved}
        totalTarget={totalTarget}
        loading={isLoading}
      />

      {/* ── 3. Main Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ongoing Goals & Finance Analysis (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <ActiveGoalsWidget
            projectGoals={projectGoals}
            savingGoals={savingGoals}
            tripGoals={tripGoals}
            loading={projectLoading || savingLoading || tripLoading}
          />
          <FinanceMiniWidget
            monthlyData={financeOverview.monthlyData}
            categoryData={financeOverview.categoryData}
            expenses={financeOverview.recentExpenses}
            totalAmount={financeOverview.totalAmount}
            loading={isLoading}
          />
        </div>

        {/* Right Column: Daily Habits & Upcoming Deadlines (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <HabitsWidget
            habits={habits}
            garden={garden}
            onToggleHabit={toggleHabit}
            loading={isLoading}
          />
          <UpcomingDeadlinesWidget
            notifications={unreadNotifications}
            unreadCount={unreadCount}
            projectGoals={projectGoals}
            savingGoals={savingGoals}
            tripGoals={tripGoals}
          />
        </div>
      </div>
    </div>
  );
}
