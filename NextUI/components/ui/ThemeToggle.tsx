"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "@/context/ThemeContext";

type ThemeToggleProps = {
  className?: string;
};

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  const mounted = useMounted();

  const showDark = mounted && isDark;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={showDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 ${className}`}
      suppressHydrationWarning
    >
      {showDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
