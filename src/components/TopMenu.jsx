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
    isActive ? "font-semibold text-black" : "text-gray-500"
  }`;

export default function TopMenu({ onMenuClick }) {
  const location = useLocation();
  const isGoalSection = location.pathname.startsWith("/goal");

  return (
    <div className="w-full bg-white shadow-sm flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          className="lg:hidden shrink-0 p-2 -ml-2 rounded-lg hover:bg-gray-100"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* <div className="relative flex-1 max-w-[320px]"> */}
          {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm transition-all duration-200 outline-none hover:border-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-black/10"
          />
        </div> */}

        {/* Goal sub-nav: desktop only, sits inline next to search */}
        {isGoalSection && (
          <nav className="hidden md:flex items-center gap-4 ml-2">
            {GOAL_SUB_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={subLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <NotificationBell />
      </div>

      {/* Goal sub-nav: mobile, wraps to its own row so it doesn't crowd search */}
      {isGoalSection && (
        <nav className="md:hidden flex items-center gap-4 px-4 pb-3 sm:px-6 overflow-x-auto no-scrollbar">
          {GOAL_SUB_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={subLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}