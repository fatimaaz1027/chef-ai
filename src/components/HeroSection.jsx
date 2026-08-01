import React from 'react';
import { Plus } from 'lucide-react';

export default function HeroSection({ onSelectQuery, onSelectChip, onFocusInput }) {
  const quickActions = [
    {
      icon: '⏱️',
      label: "15-Min Meal Prep",
      query: "Quick 15-minute healthy meal prep recipes"
    },
    {
      icon: '🥗',
      label: "Healthy & Low Cal",
      query: "Healthy low calorie recipes under 400 calories"
    },
    {
      icon: '🎲',
      label: "Surprise Me",
      query: "Surprise me with a delicious gourmet recipe idea"
    }
  ];

  const ingredientChips = [
    { label: 'Eggs', value: 'Eggs', emoji: '🥚' },
    { label: 'Tomatoes', value: 'Tomatoes', emoji: '🍅' },
    { label: 'Chicken', value: 'Chicken', emoji: '🍗' },
    { label: 'Rice', value: 'Rice', emoji: '🍚' },
    { label: 'Potatoes', value: 'Potatoes', emoji: '🥔' },
    { label: 'Spinach', value: 'Spinach', emoji: '🥬' }
  ];

  return (
    <section id="hero-landing-section" className="flex flex-col items-center justify-center text-center py-8 sm:py-12 md:py-16 px-3 sm:px-6 relative z-10 fade-up">
      {/* Main Welcoming Headline */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight max-w-2xl mb-3 sm:mb-4">
        I'm Your Cooking AI Assistant. <br className="hidden sm:inline" />
        What Can I Help You Today?
      </h1>

      {/* Subtitle */}
      <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm md:text-base max-w-lg mx-auto font-normal leading-relaxed mb-8 sm:mb-10">
        Tell me your ingredients or dietary goals to get started.
      </p>

      {/* Quick Action Pill Cards (Row 1) */}
      <div className="w-full max-w-3xl mb-4 sm:mb-5">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 px-1">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectQuery(action.query)}
              className="group px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 active:scale-95 transition-all duration-200 flex items-center gap-2.5 backdrop-blur-xs min-h-[44px]"
            >
              <span className="text-base sm:text-lg group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ingredient Suggestion Chips (Row 2) */}
      <div className="w-full max-w-3xl mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-1">
          {/* Add Custom Button */}
          <button
            type="button"
            onClick={onFocusInput}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gray-100 dark:bg-slate-700/80 border border-gray-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add Custom</span>
          </button>

          {/* Ingredient Chips */}
          {ingredientChips.map((ing, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectChip(ing.value)}
              className="chip px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-gray-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1.5 min-h-[36px]"
            >
              <span>{ing.emoji}</span>
              <span>{ing.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
