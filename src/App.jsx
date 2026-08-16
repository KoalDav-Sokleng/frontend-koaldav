import { Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout";
// TEMPORARY: PrivateRoute is disabled below so you can see the dashboard
// design right away without logging in. To turn auth back on, wrap the
// "/" Route below in <Route element={<PrivateRoute />}> again like before.
// import PrivateRoute from "./routes/PrivateRoute";

import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import DashboardPage from "./features/dashboard/DashboardPage";
import GoalPage from "./features/goal/GoalPage";
import ProjectGoalTab from "./features/goal/components/ProjectGoalTab";
import TripTab from "./features/goal/components/TripTab";
import SavingTab from "./features/goal/components/SavingTab";
import FinancePage from "./features/finance/FinancePage";
import HabitPage from "./features/habit/HabitPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="goal" element={<GoalPage />}>
          <Route index element={<ProjectGoalTab />} />
          <Route path="trip" element={<TripTab />} />
          <Route path="saving" element={<SavingTab />} />
        </Route>
        <Route path="finance" element={<FinancePage />} />
        <Route path="habit" element={<HabitPage />} />
      </Route>
    </Routes>
  );
}

export default App;