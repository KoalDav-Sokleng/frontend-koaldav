import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import FinancePage from "../features/finance/FinancePage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Application routes */}
      <Route path="/" element={<Layout />}>
      <Route path="/finance" element={<FinancePage />} />
       
      </Route>
    </Routes>
  );
}

export default AppRoutes;
