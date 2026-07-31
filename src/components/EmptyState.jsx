import React from 'react';

export default function EmptyState({ onSelectPrompt }) {
  const prompts = [
    "What can I cook with eggs, tomatoes, and cheese?",
    "Quick 15-minute healthy dinner recipes",
    "High-protein meal prep under 500 calories"
  ];

  return (
    <div id="empty-state" className="text-center py-8 fade-up-delay-3">
      <div className="text-7xl mb-4">👨‍🍳</div>
      <p className="canva-text text-gray-500 dark:text-slate-400 text-lg mb-4">
        What would you like to cook today?
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(p)}
            className="canva-text text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 transition shadow-sm"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
