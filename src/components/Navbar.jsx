import React from 'react';
import { Menu, Moon, Sun, Trash2, Settings } from 'lucide-react';

export default function Navbar({
  onToggleSidebar,
  onToggleSettings,
  onToggleDark,
  onClearChat,
  onGoHome,
  darkMode
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 w-full px-3 sm:px-6 py-3 sm:py-3.5 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors min-h-[40px] flex items-center justify-center gap-1.5 px-2.5"
            aria-label="ChefAI Menu"
            title="ChefAI Menu"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-300">Menu</span>
          </button>
          
          {/* Logo & Brand - Clickable Home Trigger */}
          <div
            onClick={onGoHome}
            className="flex items-center gap-2 cursor-pointer group"
            title="Go to Home"
          >
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">🧑‍🍳</span>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              ChefAI
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              v2.0 AI Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-slate-300" />
            )}
          </button>
          <button
            onClick={onClearChat}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Clear chat"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5 text-gray-600 dark:text-slate-300" />
          </button>
          <button
            onClick={onToggleSettings}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Settings"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </nav>
  );
}
