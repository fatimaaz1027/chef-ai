import React, { useState } from 'react';
import { X, Calendar, Sparkles, RefreshCw, ChevronRight, Sliders, ArrowLeft, Clock, Flame, Copy, Share2, FileText } from 'lucide-react';
import { generateMealPlan, getSwapMealCandidate } from '../services/mealPlanner';
import { generateMealPlanPDF } from '../utils/pdfService';

export default function MealPlannerModal({ isOpen, onClose, onSubmitRecipe }) {
  // Step 1 Preferences Form State
  const [preferences, setPreferences] = useState({
    duration: '7',
    mealsPerDay: 'Breakfast + Lunch + Dinner',
    dietary: 'No Preference',
    cuisine: 'Any Cuisine',
    spice: 'No Preference',
    budget: 'No Preference',
    skill: 'Any Level'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [mealPlanResult, setMealPlanResult] = useState(null);
  const [activeStep, setActiveStep] = useState('preferences'); // 'preferences' | 'plan'
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    setToastMessage('');
    try {
      const plan = await generateMealPlan(preferences);
      setMealPlanResult(plan);
      setActiveStep('plan');
    } catch (err) {
      showToast('Unable to create the meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegeneratePlan = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const plan = await generateMealPlan(preferences);
      setMealPlanResult(plan);
      showToast('🔄 Meal plan regenerated successfully');
    } catch (err) {
      showToast('Unable to recreate the meal plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatMealPlanText = (plan) => {
    if (!plan || !Array.isArray(plan.days)) return '';
    let text = `ChefAI Weekly Meal Plan\n`;
    if (plan.preferencesSummary) {
      text += `Summary: ${plan.preferencesSummary}\n`;
    }
    text += `${'='.repeat(40)}\n\n`;

    plan.days.forEach((d) => {
      text += `📅 ${d.dayName}\n`;
      if (Array.isArray(d.meals)) {
        d.meals.forEach((m) => {
          const typeIcon = m.type === 'Breakfast' ? '🌅' : m.type === 'Lunch' ? '☀️' : '🌙';
          text += `  • ${typeIcon} ${m.type}: ${m.recipe.name} (${m.recipe.time || ''} | ${m.recipe.calories || ''})\n`;
        });
      }
      text += `\n`;
    });

    return text;
  };

  const handleCopyPlan = async () => {
    if (!mealPlanResult) return;
    const text = formatMealPlanText(mealPlanResult);
    if (!text) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('📋 Meal plan copied successfully');
    } catch (err) {
      showToast('Failed to copy meal plan');
    }
  };

  const handleSharePlan = async () => {
    if (!mealPlanResult) return;
    const text = formatMealPlanText(mealPlanResult);
    if (!text) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChefAI Meal Plan',
          text: text
        });
        showToast('📤 Meal plan shared successfully');
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyPlan();
          showToast('📋 Meal plan copied for sharing');
        }
      }
    } else {
      handleCopyPlan();
      showToast('📋 Meal plan copied for sharing');
    }
  };

  const handleDownloadPDF = async () => {
    if (!mealPlanResult || isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    try {
      await generateMealPlanPDF(mealPlanResult);
      showToast('📄 Meal plan PDF downloaded successfully');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSwapMeal = (dayIdx, mealIdx, type, currentName) => {
    if (!mealPlanResult) return;
    const newRecipe = getSwapMealCandidate(type, currentName, preferences);
    setMealPlanResult((prev) => {
      const newDays = [...prev.days];
      const targetDay = { ...newDays[dayIdx] };
      const targetMeals = [...targetDay.meals];
      targetMeals[mealIdx] = {
        ...targetMeals[mealIdx],
        recipe: newRecipe
      };
      targetDay.meals = targetMeals;
      newDays[dayIdx] = targetDay;
      return { ...prev, days: newDays };
    });
    showToast(`Swapped meal for ${type}!`);
  };

  const handleSelectMealRecipe = (recipe) => {
    if (!recipe) return;
    onSubmitRecipe(recipe);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-[94vw] sm:w-full p-4 sm:p-6 shadow-2xl border border-gray-100 dark:border-slate-700/80 transition-colors max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📅</span>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base sm:text-lg tracking-tight">
                {activeStep === 'preferences' ? 'Meal Planner' : 'Your Weekly Meal Plan'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeStep === 'preferences'
                  ? 'Customize preferences to generate a personalized plan'
                  : mealPlanResult?.preferencesSummary}
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

        {/* Floating Feedback Toast Notification */}
        {toastMessage && (
          <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-semibold flex items-center gap-2 fade-up shadow-sm">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* STEP 1: PREFERENCES FORM */}
        {activeStep === 'preferences' ? (
          <div className="mt-4 space-y-4">
            {/* 1. Plan Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                1. Plan Duration
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['3', '5', '7'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreferences({ ...preferences, duration: d })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center min-h-[38px] ${
                      preferences.duration === d
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-gray-50 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 border-gray-200 dark:border-slate-600 hover:bg-gray-100'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Meals Per Day */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                2. Meals Per Day
              </label>
              <select
                value={preferences.mealsPerDay}
                onChange={(e) => setPreferences({ ...preferences, mealsPerDay: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Breakfast + Lunch + Dinner">Breakfast + Lunch + Dinner (3 Meals)</option>
                <option value="Lunch + Dinner">Lunch + Dinner (2 Meals)</option>
                <option value="Breakfast + Dinner">Breakfast + Dinner (2 Meals)</option>
              </select>
            </div>

            {/* 3. Dietary & 4. Cuisine */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  3. Dietary Preference
                </label>
                <select
                  value={preferences.dietary}
                  onChange={(e) => setPreferences({ ...preferences, dietary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="High Protein">High Protein</option>
                  <option value="Low Carb">Low Carb</option>
                  <option value="Dairy-Free">Dairy-Free</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  4. Cuisine Preference
                </label>
                <select
                  value={preferences.cuisine}
                  onChange={(e) => setPreferences({ ...preferences, cuisine: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
                >
                  <option value="Any Cuisine">Any Cuisine</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Indian">Indian</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Mexican">Mexican</option>
                </select>
              </div>
            </div>

            {/* 5. Spice, 6. Budget, 7. Cooking Skill */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                  5. Spice Level
                </label>
                <select
                  value={preferences.spice}
                  onChange={(e) => setPreferences({ ...preferences, spice: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Spicy">Spicy</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                  6. Budget
                </label>
                <select
                  value={preferences.budget}
                  onChange={(e) => setPreferences({ ...preferences, budget: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="No Preference">No Preference</option>
                  <option value="Budget Friendly">Budget Friendly</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                  7. Skill Level
                </label>
                <select
                  value={preferences.skill}
                  onChange={(e) => setPreferences({ ...preferences, skill: e.target.value })}
                  className="w-full px-2 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/60 border border-gray-200 dark:border-slate-600 text-xs text-slate-800 dark:text-slate-100 outline-none"
                >
                  <option value="Any Level">Any Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Primary Generate Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 shadow-md hover:shadow-lg active:scale-95 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating your meal plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Meal Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: MEAL PLAN RESULT VIEW */
          <div className="mt-4 space-y-4">
            {/* Days Scrollable List */}
            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
              {mealPlanResult?.days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  className="bg-gray-50 dark:bg-slate-700/40 rounded-2xl p-3 sm:p-4 border border-gray-200/80 dark:border-slate-700 space-y-2.5"
                >
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-center font-bold">
                      {day.dayNumber}
                    </span>
                    <span>{day.dayName}</span>
                  </h4>

                  <div className="space-y-2">
                    {day.meals.map((m, mealIdx) => {
                      const icon =
                        m.type === 'Breakfast' ? '🌅' : m.type === 'Lunch' ? '☀️' : '🌙';
                      return (
                        <div
                          key={mealIdx}
                          className="bg-white dark:bg-slate-800 rounded-xl p-2.5 border border-gray-200 dark:border-slate-700/80 flex items-center justify-between gap-2 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition"
                        >
                          <div
                            onClick={() => handleSelectMealRecipe(m.recipe)}
                            className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                          >
                            <span className="text-xl flex-shrink-0">{m.recipe.img || icon}</span>
                            <div className="min-w-0">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 block">
                                {m.type}
                              </span>
                              <p className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate">
                                {m.recipe.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {m.recipe.time}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-amber-500" />
                                  {m.recipe.calories}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleSwapMeal(dayIdx, mealIdx, m.type, m.recipe.name)
                            }
                            className="p-1.5 rounded-lg bg-gray-100 dark:hover:bg-slate-700 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-semibold hover:bg-gray-200 transition flex items-center gap-1 flex-shrink-0"
                            title="Swap meal"
                          >
                            <RefreshCw className="w-3 h-3 text-emerald-500" />
                            <span className="hidden sm:inline">Swap</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Footer Toolbar */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-700 space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handleRegeneratePlan}
                  disabled={isGenerating}
                  className="py-2 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 font-bold text-white text-xs transition flex items-center justify-center gap-1.5 min-h-[38px]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPlan}
                  className="py-2 px-2.5 rounded-xl bg-gray-100 dark:bg-slate-700/80 hover:bg-gray-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 min-h-[38px]"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copy</span>
                </button>

                <button
                  type="button"
                  onClick={handleSharePlan}
                  className="py-2 px-2.5 rounded-xl bg-gray-100 dark:bg-slate-700/80 hover:bg-gray-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 min-h-[38px]"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="py-2 px-2.5 rounded-xl bg-gray-100 dark:bg-slate-700/80 hover:bg-gray-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5 min-h-[38px]"
                >
                  <FileText className={`w-3.5 h-3.5 text-emerald-500 ${isGeneratingPDF ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingPDF ? 'Generating...' : 'PDF'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveStep('preferences')}
                className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 text-slate-600 dark:text-slate-300 font-semibold text-xs transition flex items-center justify-center gap-1.5 min-h-[36px]"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Change Preferences</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
