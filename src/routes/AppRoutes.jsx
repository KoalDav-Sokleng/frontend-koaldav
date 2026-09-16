import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import PrivateRoute from "./PrivateRoute";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import ForgotPasswordPage from "../features/auth/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/ResetPasswordPage";
import VerifyOtpPage from "../features/auth/VerifyOtpPage";

import DashboardPage from "../features/dashboard/DashboardPage";
import GoalPage from "../features/goal/GoalPage";
import ProjectGoalTab from "../features/goal/components/ProjectGoalTab";
import TripTab from "../features/goal/components/TripTab";
import SavingTab from "../features/goal/components/SavingTab";

import FinancePage from "../features/finance/FinancePage";
import HabitPage from "../features/habit/components/HabitPage";
import NotificationPage from "../features/notification/NotificationPage";
import ProfilePage from "../features/profile/ProfilePage";

function GoalRedirect({ baseRoute }) {
  const { id } = useParams();
  return <Navigate to={id ? `${baseRoute}?goalId=${id}` : baseRoute} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Protected application routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />

          <Route path="goal" element={<GoalPage />}>
            <Route index element={<ProjectGoalTab />} />
            <Route path="trip" element={<TripTab />} />
            <Route path="saving" element={<SavingTab />} />
          </Route>

          {/* Goal alias routes for deep-linking */}
          <Route path="goals" element={<Navigate to="/goal" replace />} />
          <Route
            path="goals/:id"
            element={<GoalRedirect baseRoute="/goal" />}
          />
          <Route
            path="saving-goals"
            element={<Navigate to="/goal/saving" replace />}
          />
          <Route
            path="saving-goals/:id"
            element={<GoalRedirect baseRoute="/goal/saving" />}
          />
          <Route path="trips" element={<Navigate to="/goal/trip" replace />} />
          <Route
            path="trips/:id"
            element={<GoalRedirect baseRoute="/goal/trip" />}
          />

          {/* Finance routes & sub-tabs */}
          <Route path="finance" element={<FinancePage />} />
          <Route path="finance/:tab" element={<FinancePage />} />
          <Route
            path="wallets"
            element={<Navigate to="/finance/wallets" replace />}
          />
          <Route
            path="budgets"
            element={<Navigate to="/finance/budgets" replace />}
          />
          <Route
            path="expenses"
            element={<Navigate to="/finance/expenses" replace />}
          />

          <Route path="habit" element={<HabitPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
