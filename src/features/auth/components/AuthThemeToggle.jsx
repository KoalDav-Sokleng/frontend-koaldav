import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

export default function AuthThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EDE9FE] text-[#6C63FF] shadow-xs transition-all duration-300 hover:scale-110 hover:bg-[#DDD6FE] dark:bg-[#1E1B4B] dark:text-[#A5B4FC] dark:hover:bg-[#2E1065] cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun
          size={20}
          className="transition-transform duration-300 rotate-0 hover:rotate-45 text-amber-300"
        />
      ) : (
        <Moon
          size={19}
          className="transition-transform duration-300 hover:-rotate-12 text-[#6C63FF]"
        />
      )}
    </button>
  );
}
