import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 border ${
        isDark
          ? 'bg-slate-950/80 text-amber-400 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
