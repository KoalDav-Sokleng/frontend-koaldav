import { NavLink, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../assets/Koaldavpic.png";
import { CiHome, CiTrophy, CiCalendar, CiUser } from "react-icons/ci";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { useAuth } from "../features/auth/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: CiHome, end: true },
  { to: "/goal", label: "Goal", icon: CiTrophy },
  { to: "/finance", label: "Finance Overview", icon: HiOutlineCurrencyDollar },
  { to: "/habit", label: "Habit", icon: CiCalendar },
  { to: "/profile", label: "Profile", icon: CiUser },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-colors ${
    isActive
      ? "bg-[#E7E2FF] text-[#6C63FF] font-medium dark:bg-[#1E1B2E] dark:text-[#6C63FF]"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#1A1A22]"
  }`;

export default function SideBar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onNavigate?.();
    navigate("/profile");
  };

  const handleLogout = async (e) => {
    e?.stopPropagation();
    const result = await Swal.fire({
      title: "Log out?",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6C63FF",
      cancelButtonColor: "#d1d5db",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      logout();
      navigate("/login");
    }
  };

  const userDisplayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.fullName ||
        user?.name ||
        user?.username ||
        user?.email?.split("@")[0] ||
        "User";

  return (
    <aside className="w-full h-full bg-[#F4F2FF] dark:bg-[#0F0F14] flex flex-col justify-between p-5 overflow-y-auto transition-colors">
      <div>
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center">
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
          </Link>
          <ThemeToggle />
        </div>

        <nav>
          <ul className="space-y-2">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={linkClass}
                  onClick={onNavigate}
                >
                  <Icon size={22} />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div>
        <button
          onClick={() => navigate("/goal")}
          className="w-full bg-[#6C63FF] text-white py-3 rounded-xl font-medium hover:bg-[#5B52E6] dark:hover:bg-[#7C73FF] transition-colors cursor-pointer"
        >
          Start Sprint
        </button>

        <div className="flex items-center gap-3 mt-6 p-2 rounded-2xl hover:bg-purple-100/50 dark:hover:bg-[#1E1B2E] transition-colors cursor-pointer group">
          <div
            onClick={handleProfileClick}
            className="group-hover:scale-105 transition-transform"
          >
            <UserAvatar
              user={user}
              className="w-10 h-10 text-sm rounded-full ring-2 ring-[#6C63FF]/30"
            />
          </div>
          <div className="min-w-0 flex-1" onClick={handleProfileClick}>
            <h3 className="font-semibold text-sm truncate dark:text-white group-hover:text-[#6C63FF] transition-colors">
              {userDisplayName}
            </h3>
            <span className="text-[11px] text-[#6C63FF] dark:text-[#A49DFF] font-medium">
              View Profile
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-xs text-gray-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}
