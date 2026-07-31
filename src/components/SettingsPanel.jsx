import React, { useState } from 'react';
import { X, Moon, Globe, Ruler, Bell, Trash2, Check } from 'lucide-react';

export default function SettingsPanel({
  isOpen,
  onClose,
  darkMode,
  onToggleDark,
  onClearHistory
}) {
  const [notifications, setNotifications] = useState(true);
  const [unit, setUnit] = useState('Metric');
  const [language, setLanguage] = useState('English');

  return (
    <aside
      id="settings-panel"
      className={`settings-panel fixed top-0 right-0 h-full w-[85vw] max-w-xs sm:w-80 z-40 bg-white border-l border-gray-200 shadow-2xl flex flex-col ${
        isOpen ? 'open' : ''
      }`}
      aria-label="Settings"
    >
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800 text-sm sm:text-base">
          Settings
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
        {/* Dark mode toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 min-h-[44px]">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-gray-600" />
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Dark Mode
            </span>
          </div>
          <button
            onClick={onToggleDark}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              darkMode ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                darkMode ? 'left-[22px]' : 'left-0.5'
              }`}
            ></span>
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 min-h-[44px]">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Language
            </span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs sm:text-sm bg-transparent text-slate-600 border-none outline-none font-medium cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
          </select>
        </div>

        {/* Measurement Units */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 min-h-[44px]">
          <div className="flex items-center gap-3">
            <Ruler className="w-5 h-5 text-gray-600" />
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Units
            </span>
          </div>
          <button
            onClick={() => setUnit(unit === 'Metric' ? 'Imperial' : 'Metric')}
            className="text-xs sm:text-sm font-semibold px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-100 transition"
          >
            {unit}
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 min-h-[44px]">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="text-xs sm:text-sm font-medium text-slate-700">
              Notifications
            </span>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full relative transition-colors ${
              notifications ? 'bg-emerald-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                notifications ? 'left-[22px]' : 'left-0.5'
              }`}
            ></span>
          </button>
        </div>

        {/* Clear History */}
        <button
          onClick={onClearHistory}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition min-h-[44px]"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
          <span className="text-xs sm:text-sm font-medium text-red-500">Clear History</span>
        </button>

        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">ChefAI v2.0</p>
          <p className="text-xs text-gray-400 mt-1">Your AI Kitchen Companion</p>
        </div>
      </div>
    </aside>
  );
}
