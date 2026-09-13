import { Outlet } from "react-router-dom";

// Tab navigation for Project / Trip / Saving now lives in TopMenu
// (only shown while inside /goal), not here — keeps this page full-height.
export default function GoalPage() {
  return <Outlet />;
}