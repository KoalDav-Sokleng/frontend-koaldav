import { CiSun } from "react-icons/ci";
import { BsMoonStars } from "react-icons/bs";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-10 h-10 rounded-full
                 bg-gray-100 dark:bg-[#1A1A22]
                 text-gray-600 dark:text-yellow-300
                 hover:bg-gray-200 dark:hover:bg-[#242430]
                 transition-colors"
    >
      {theme === "light" ? <BsMoonStars size={18} /> : <CiSun size={22} />}
    </button>
  );
}