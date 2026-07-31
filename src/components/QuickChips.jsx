import React from 'react';

export default function QuickChips({ onSelectChip }) {
  const ingredients = [
    { label: '🥚 Eggs', value: 'Eggs' },
    { label: '🍅 Tomatoes', value: 'Tomatoes' },
    { label: '🍗 Chicken', value: 'Chicken' },
    { label: '🧀 Cheese', value: 'Cheese' },
    { label: '🍚 Rice', value: 'Rice' },
    { label: '🥔 Potatoes', value: 'Potatoes' },
    { label: '🥬 Spinach', value: 'Spinach' }
  ];

  return (
    <div id="chips-bar" className="w-full overflow-x-auto scrollbar-none pb-2.5 mb-1.5">
      <div className="flex items-center gap-2 min-w-max px-3 sm:px-4 mx-auto justify-start lg:justify-center">
        {ingredients.map((ing, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectChip(ing.value)}
            className="chip flex-shrink-0 px-3 sm:px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs sm:text-sm shadow-sm text-slate-800 dark:text-slate-200 font-medium hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition min-h-[36px] flex items-center"
          >
            {ing.label}
          </button>
        ))}
      </div>
    </div>
  );
}
