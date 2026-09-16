import { Menu } from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";
import NotificationBell from "../features/notification/components/NotificationBell";
import { useAuth } from "../features/auth/hooks/useAuth";
import UserAvatar from "./UserAvatar";

const GOAL_SUB_LINKS = [
  { to: "/goal", label: "Project", end: true },
  { to: "/goal/trip", label: "Trip" },
  { to: "/goal/saving", label: "Saving" },
];

const subLinkClass = ({ isActive }) =>
  `cursor-pointer whitespace-nowrap text-sm transition-colors ${
    isActive
      ? "font-semibold text-black dark:text-white"
      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
  }`;

export default function TopMenu({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const isGoalSection = location.pathname.startsWith("/goal");
  const isProfileActive = location.pathname.startsWith("/profile");

  return (
    <div className="flex w-full flex-col bg-white shadow-sm transition-colors border-b border-gray-100 dark:border-[#242430] dark:bg-[#0F0F14]">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            className="-ml-2 shrink-0 rounded-lg p-2 hover:bg-gray-100 text-gray-600 dark:text-gray-300 dark:hover:bg-[#1A1A22] lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
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

        {/* Right side utilities: Notification Bell & Profile Avatar */}
        <div className="flex items-center gap-3 ml-auto">
          <NotificationBell />
          <Link
            to="/profile"
            className={`flex items-center gap-2 p-0.5 rounded-full ring-2 transition-all ${
              isProfileActive
                ? "ring-[#6C63FF] shadow-sm shadow-[#6C63FF]/20"
                : "ring-transparent hover:ring-[#6C63FF]/40"
            }`}
            title="Go to Profile"
          >
            <UserAvatar user={user} className="w-8 h-8 text-xs rounded-full" />
          </Link>
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
