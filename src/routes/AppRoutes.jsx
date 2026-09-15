import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import FinancePage from "../features/finance/FinancePage";
import HabitPage from "../features/habit/HabitPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main application layout */}
      <Route path="/" element={<Layout />}>
        {/* Default route -> Finance */}
        <Route index element={<FinancePage />} />

        {/* Finance routes & sub-tabs */}
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/finance/:tab" element={<FinancePage />} />

        {/* Habit route */}
        <Route path="/habit" element={<HabitPage />} />

        {/* Goal route fallback */}
        <Route path="/goal" element={<FinancePage />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/finance" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
