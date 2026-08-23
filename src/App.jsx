import { Routes, Route } from "react-router-dom";
import "./App.css";

import Layout from "./components/Layout";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

// ទុកតែមួយ line នេះបានហើយ (លុប line ស្ទួនចេញ)
import HabitPage from "./features/habit/HabitPage";

import FinancePage from "./features/finance/FinancePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<div>Dashboard Page (Coming Soon)</div>} />
        <Route path="goal" element={<div>Goal Page (Coming Soon)</div>} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="habit" element={<HabitPage />} />
      </Route>
    </Routes>
  );
}

export default App;