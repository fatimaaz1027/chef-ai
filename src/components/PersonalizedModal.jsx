import React, { useState } from 'react';
import { X, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';

export default function PersonalizedModal({ isOpen, onClose, onSubmitQuery }) {
  const [dietary, setDietary] = useState('Any');
  const [cuisine, setCuisine] = useState('Any');
  const [goal, setGoal] = useState('Any');
  const [avoid, setAvoid] = useState('None');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const dietaryOptions = ['Any', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'];
  const cuisineOptions = ['Any', 'Italian', 'Mediterranean', 'Asian', 'Mexican', 'Indian'];
  const goalOptions = ['Any', 'High Protein', 'Quick & Easy', 'Budget Friendly', 'Low Calorie', 'Spicy'];
  const avoidOptions = ['None', 'Nuts', 'Dairy', 'Seafood', 'Eggs'];

  const handleReset = () => {
    setDietary('Any');
    setCuisine('Any');
    setGoal('Any');
    setAvoid('None');
    setErrorMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dietary === 'Any' && cuisine === 'Any' && goal === 'Any' && avoid === 'None') {
      setErrorMessage('Please select at least one preference to get personalized recommendations!');
      return;
    }

    setErrorMessage('');
    const parts = [];
    if (dietary !== 'Any') parts.push(dietary);
    if (cuisine !== 'Any') parts.push(`${cuisine} cuisine`);
    if (goal !== 'Any') parts.push(goal);
    if (avoid !== 'None') parts.push(`avoiding ${avoid}`);

    const query = `Give me personalized recipe recommendations for ${parts.join(', ')}`;
    onSubmitQuery(query);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-[92vw] sm:w-full p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-700/80 transition-colors max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">✨</span>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                Personalized Recommendations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tailor recipes to your dietary needs & taste
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-slate-400 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Toast */}
        {errorMessage && (
          <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Dietary Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              🌱 Dietary Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setDietary(opt);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border min-h-[36px] ${
                    dietary === opt
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-emerald-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Cuisine Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              🌍 Cuisine Style
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setCuisine(opt);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border min-h-[36px] ${
                    cuisine === opt
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-emerald-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Goal & Attribute */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              🎯 Cooking Goal
            </label>
            <div className="flex flex-wrap gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setGoal(opt);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border min-h-[36px] ${
                    goal === opt
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-emerald-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Avoid Ingredients */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              🚫 Avoid Ingredients
            </label>
            <div className="flex flex-wrap gap-2">
              {avoidOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setAvoid(opt);
                    setErrorMessage('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border min-h-[36px] ${
                    avoid === opt
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-rose-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="py-3 px-4 rounded-2xl font-semibold text-slate-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition text-xs sm:text-sm flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get My Recommendations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
