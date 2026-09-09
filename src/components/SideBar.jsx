import { NavLink } from "react-router-dom";
import Logo from "../assets/Koaldavpic.png";
import { CiHome, CiTrophy, CiCalendar } from "react-icons/ci";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useAuth } from "../features/auth/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: CiHome, end: true },
  { to: "/goal", label: "Goal", icon: CiTrophy },
  { to: "/finance", label: "Finance Overview", icon: HiOutlineCurrencyDollar },
  { to: "/habit", label: "Habit", icon: CiCalendar },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
    isActive
      ? "bg-[#E7E2FF] text-[#6C63FF] font-medium dark:bg-[#1E1B2E] dark:text-[#6C63FF]"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1A1A22]"
  }`;

export default function SideBar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full h-full bg-[#F4F2FF] dark:bg-[#0F0F14] flex flex-col justify-between p-5 overflow-y-auto transition-colors">
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <img
              src={Logo}
              alt="Logo"
              width="48"
              height="48"
              className="rounded-full w-12 h-12 object-cover"
            />
            <div className="ml-3">
              <h1 className="font-bold text-lg text-[#6C63FF]">KAOL DAV</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Peak Performance
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav>
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className={linkClass} onClick={onNavigate}>
                  <Icon size={22} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        <button className="w-full bg-[#6C63FF] text-white py-3 rounded-xl font-medium hover:bg-[#5B52E6] dark:hover:bg-[#7C73FF] transition-colors">
          Start Sprint
        </button>

        <div className="flex items-center gap-3 mt-6">
          <img
            src="https://i.pravatar.cc/40"
            alt="User avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate dark:text-white">
              {user?.name || "Guest"}
            </h3>
            <button
              onClick={logout}
              className="text-xs text-gray-500 hover:text-[#6C63FF]"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}