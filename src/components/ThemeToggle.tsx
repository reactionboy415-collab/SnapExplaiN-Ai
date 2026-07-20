import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:shadow-sm"
      aria-label="Toggle visual theme"
      id="theme-toggle-btn"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-500 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
