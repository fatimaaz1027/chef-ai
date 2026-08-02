import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, Sparkles, Sliders, RefreshCw } from 'lucide-react';
import { historyManager } from '../utils/historyManager';

export default function PreferencesPage({ onGoHome }) {
  const [preferences, setPreferences] = useState({
    cuisine: 'Any Cuisine',
    dietary: ['No Preference'],
    spice: 'No Preference',
    skill: 'Any Level',
    budget: 'No Preference',
  });

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const saved = historyManager.getPreferences();
    setPreferences(saved);
  }, []);

  const cuisineOptions = [
    'Any Cuisine',
    'Pakistani',
    'Indian',
    'Italian',
    'Chinese',
    'Mediterranean',
    'Mexican',
  ];

  const dietaryOptions = [
    'No Preference',
    'Vegetarian',
    'Vegan',
    'High Protein',
    'Low Carb',
    'Dairy-Free',
    'Gluten-Free',
    'Halal',
    'Keto',
  ];

  const spiceOptions = ['No Preference', 'Mild', 'Medium', 'Spicy', 'Extra Spicy'];

  const skillOptions = ['Any Level', 'Beginner', 'Intermediate', 'Advanced'];

  const budgetOptions = ['No Preference', 'Low', 'Medium', 'High'];

  const handleToggleDietary = (opt) => {
    const currentList = Array.isArray(preferences.dietary)
      ? preferences.dietary
      : [preferences.dietary];

    if (opt === 'No Preference') {
      setPreferences({ ...preferences, dietary: ['No Preference'] });
      return;
    }

    const withoutDefault = currentList.filter((d) => d !== 'No Preference');
    if (withoutDefault.includes(opt)) {
      const next = withoutDefault.filter((d) => d !== opt);
      setPreferences({
        ...preferences,
        dietary: next.length === 0 ? ['No Preference'] : next,
      });
    } else {
      setPreferences({
        ...preferences,
        dietary: [...withoutDefault, opt],
      });
    }
  };

  const handleSave = () => {
    historyManager.savePreferences(preferences);
    setToastMessage('Preferences saved successfully!');
    setTimeout(() => setToastMessage(''), 2800);
  };

  const handleReset = () => {
    const defaultPrefs = {
      cuisine: 'Any Cuisine',
      dietary: ['No Preference'],
      spice: 'No Preference',
      skill: 'Any Level',
      budget: 'No Preference',
    };
    setPreferences(defaultPrefs);
    historyManager.savePreferences(defaultPrefs);
    setToastMessage('Preferences reset to defaults');
    setTimeout(() => setToastMessage(''), 2800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors pb-24 relative">
      {/* Fixed Toast Overlay Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 z-50 max-w-sm w-[90vw] sm:w-auto px-4 py-3 bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border border-emerald-400 fade-up pointer-events-none">
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700/80 px-4 sm:px-6 py-4 shadow-sm transition-colors sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition flex items-center justify-center min-h-[40px] min-w-[40px]"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-xl flex items-center gap-2">
                <span>⚙️</span> Your Preferences
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailor ChefAI recipes to match your personal taste & diet
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 transition flex items-center gap-1.5 min-h-[36px]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Form Container Card */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-100 dark:border-slate-700/80 space-y-6 transition-colors">
          {/* 1. 🌎 Cuisine Preference */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                🌎 Cuisine Style
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Preferred flavor origin
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((opt) => {
                const isSelected = preferences.cuisine === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, cuisine: opt })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 dark:border-slate-700/60" />

          {/* 2. 🌱 Dietary Preferences (MULTI-SELECT) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
                🌱 Dietary Preferences
              </label>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Multiple allowed (e.g. Vegetarian + Low Carb)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((opt) => {
                const isSelected = Array.isArray(preferences.dietary)
                  ? preferences.dietary.includes(opt)
                  : preferences.dietary === opt;

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleToggleDietary(opt)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 dark:border-slate-700/60" />

          {/* 3. 🌶️ Spice Level */}
          <div className="space-y-2.5">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
              🌶️ Spice Level
            </label>
            <div className="flex flex-wrap gap-2">
              {spiceOptions.map((opt) => {
                const isSelected = preferences.spice === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, spice: opt })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 dark:border-slate-700/60" />

          {/* 4. 👨‍🍳 Cooking Skill Level */}
          <div className="space-y-2.5">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
              👨‍🍳 Cooking Skill Level
            </label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((opt) => {
                const isSelected = preferences.skill === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, skill: opt })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 dark:border-slate-700/60" />

          {/* 5. 💰 Budget */}
          <div className="space-y-2.5">
            <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100">
              💰 Budget
            </label>
            <div className="flex flex-wrap gap-2">
              {budgetOptions.map((opt) => {
                const isSelected = preferences.budget === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, budget: opt })}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition min-h-[38px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button Action */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 active:scale-95 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Save className="w-5 h-5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
}
