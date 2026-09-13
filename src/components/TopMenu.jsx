import { Menu } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import NotificationBell from "../features/notification/components/NotificationBell";

const GOAL_SUB_LINKS = [
  { to: "/goal", label: "Project", end: true },
  { to: "/goal/trip", label: "Trip" },
  { to: "/goal/saving", label: "Saving" },
];

const subLinkClass = ({ isActive }) =>
  `cursor-pointer whitespace-nowrap text-sm ${
    isActive
      ? "font-semibold text-black dark:text-white"
      : "text-gray-500 dark:text-gray-400"
  }`;

export default function TopMenu({ onMenuClick }) {
  const location = useLocation();
  const isGoalSection = location.pathname.startsWith("/goal");
  const isHabitSection = location.pathname.startsWith("/habit");

  return (
    <div className="w-full bg-white shadow-sm flex flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden shrink-0 p-2 -ml-2 rounded-lg hover:bg-gray-100"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Goal sub-nav: desktop only */}
          {isGoalSection && (
            <nav className="hidden md:flex items-center gap-4 ml-2">
              {GOAL_SUB_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={subLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        {/* Right side utilities: Notification Bell anchored on far right */}
        <div className="flex items-center gap-3 ml-auto">
          <NotificationBell />
        </div>
      </div>

      {/* Goal sub-nav: mobile, wraps to its own row */}
      {isGoalSection && (
        <nav className="md:hidden flex items-center gap-4 px-4 pb-3 sm:px-6 overflow-x-auto no-scrollbar">
          {GOAL_SUB_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={subLinkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
