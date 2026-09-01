import { Routes, Route } from "react-router-dom";
//import "./App.css";

import Layout from "./components/Layout";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
<<<<<<< HEAD

// ទុកតែមួយ line នេះបានហើយ (លុប line ស្ទួនចេញ)
import HabitPage from "./features/habit/HabitPage";

//import DashboardPage from "./features/dashboard/DashboardPage";
//import GoalPage from "./features/goal/GoalPage";ctGoalTab";
//import TripTab from "./features/goal/components/TripTab";
//import ProjectGoalTab from "./features/goal/components/Proje
//import SavingTab from "./features/goal/components/SavingTab";
//import FinancePage from "./features/finance/FinancePage";
//import HabitPage from "./features/habit/HabitPage";


import FinancePage from "./features/finance/FinancePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        
      </Route>
    </Routes>
  );
}

export default App;