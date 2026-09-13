import { Routes, Route, Navigate, useParams } from "react-router-dom";

import Layout from "../components/Layout";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import GoalPage from "../features/goal/GoalPage";
import ProjectGoalTab from "../features/goal/components/ProjectGoalTab";
import TripTab from "../features/goal/components/TripTab";
import SavingTab from "../features/goal/components/SavingTab";

import FinancePage from "../features/finance/FinancePage";
import HabitPage from "../features/habit/components/HabitPage";
import NotificationPage from "../features/notification/NotificationPage";

function GoalRedirect({ baseRoute }) {
  const { id } = useParams();
  return <Navigate to={id ? `${baseRoute}?goalId=${id}` : baseRoute} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Application routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />

        <Route path="goal" element={<GoalPage />}>
          <Route index element={<ProjectGoalTab />} />
          <Route path="trip" element={<TripTab />} />
          <Route path="saving" element={<SavingTab />} />
        </Route>

        {/* Alias routes for direct deep-linking */}
        <Route path="goals" element={<Navigate to="/goal" replace />} />
        <Route path="goals/:id" element={<GoalRedirect baseRoute="/goal" />} />
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

        <Route path="finance" element={<FinancePage />} />
        <Route path="habit" element={<HabitPage />} />
        <Route path="notification" element={<NotificationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
