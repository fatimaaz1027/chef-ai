import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function RecipeIdeasModal({ isOpen, onClose, onSubmitQuery }) {
  const [ingredientInput, setIngredientInput] = useState('');

  if (!isOpen) return null;

  const suggestions = [
    { label: '🍳 Breakfast', prompt: 'Give me breakfast recipe ideas' },
    { label: '🥗 Healthy', prompt: 'Give me healthy recipe ideas' },
    { label: '💪 High Protein', prompt: 'Give me high protein recipe ideas' },
    { label: '🍝 Quick & Easy', prompt: 'Give me quick and easy recipe ideas' },
    { label: '🌶️ Spicy', prompt: 'Give me spicy recipe ideas' },
    { label: '🍰 Something Sweet', prompt: 'Give me something sweet' },
    { label: '🥘 Dinner', prompt: 'Give me dinner recipe ideas' }
  ];

  const handleSelectSuggestion = (prompt) => {
    onSubmitQuery(prompt);
    onClose();
  };

  const handleSubmitCustom = (e) => {
    e.preventDefault();
    if (!ingredientInput.trim()) return;
    const query = `Give me recipe ideas with ${ingredientInput.trim()}`;
    onSubmitQuery(query);
    setIngredientInput('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-[92vw] sm:w-full p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-700/80 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍳</span>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                Recipe Ideas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                What would you like to cook?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            aria-label="Close recipe ideas modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="py-4 border-b border-gray-100 dark:border-slate-700/60">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
            Quick Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(sug.prompt)}
                className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600/60 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 shadow-sm transition min-h-[38px] flex items-center"
              >
                {sug.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ingredient Input Form */}
        <form onSubmit={handleSubmitCustom} className="pt-4 space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Or tell me what ingredients you have...
          </label>
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder="e.g. chicken, rice and tomatoes"
            className="w-full px-4 py-2.5 sm:py-3 rounded-2xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
          />
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Recipe Ideas</span>
          </button>
        </form>
      </div>
    </div>
  );
}
