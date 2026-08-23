import { Outlet } from "react-router-dom";

export default function GoalPage() {
  return (
    <div>
      <h1>Goal Page</h1>
      <Outlet />
    </div>
  );
}