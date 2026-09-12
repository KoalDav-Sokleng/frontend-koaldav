/*import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";




export default function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
  */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import VerifyOtpForm from "./features/auth/components/VerifyOtpForm";
import HabitPage from "./features/habit/HabitPage";
import FinancePage from "./features/finance/FinancePage";
import PrivateRoute from "./routes/PrivateRoute"; // adjust path to match your actual file location

// TODO: paste back any other imports from your real App.jsx here
// (GoalPage, DashboardPage, etc.) — I don't have their current paths/names

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes — no token required */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpForm />} />

        {/* Protected routes — require a valid token */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HabitPage />} />
            <Route path="/finance" element={<FinancePage />} />
            
            {/* TODO: paste back your Goal, Dashboard, etc. routes here */}
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;