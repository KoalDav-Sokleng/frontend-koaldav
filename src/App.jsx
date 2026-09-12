import { Routes, Route } from "react-router-dom";
//import "./App.css";

import Layout from "./components/Layout";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ForgotPasswordPage from "./features/auth/ForgotPasswordPage";

// ទុកតែមួយ line នេះបានហើយ (លុប line ស្ទួនចេញ)
//import HabitPage from "./features/habit/HabitPage";

//import DashboardPage from "./features/dashboard/DashboardPage";
//import GoalPage from "./features/goal/GoalPage";
//import TripTab from "./features/goal/components/TripTab";
//import ProjectGoalTab from "./features/goal/components/ProjectGoalTab";
//import SavingTab from "./features/goal/components/SavingTab";

//import FinancePage from "./features/finance/FinancePage";
import VerifyOtpForm from "./features/auth/VerifyOtpForm";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<div>Dashboard Page (Coming Soon)</div>} />
        <Route path="goal" element={<div>Goal Page (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}

export default App;