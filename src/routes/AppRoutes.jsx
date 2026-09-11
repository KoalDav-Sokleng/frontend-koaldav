import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";

import HabitPage from "../features/habit/components/HabitPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Application routes */}
      <Route path="/" element={<Layout />}>

        
        <Route path="habit" element={<HabitPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
