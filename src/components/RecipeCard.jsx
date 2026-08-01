import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Share2,
  Copy,
  Printer,
  Download,
  ShoppingCart,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Users,
  ChefHat,
  Flame,
  Check,
  ShieldAlert,
  Tag,
  Utensils
} from 'lucide-react';
import { historyManager } from '../utils/historyManager';
import { generateRecipePDF } from '../utils/pdfService';

export function getRecipeTags(recipe) {
  if (!recipe) return ['#Quick&Easy'];
  if (recipe.tags && Array.isArray(recipe.tags) && recipe.tags.length > 0) {
    return recipe.tags;
  }

  const nameLower = (recipe.name || '').toLowerCase();
  const ingredientsText = (recipe.ingredients || []).join(' ').toLowerCase();
  const allText = `${nameLower} ${ingredientsText}`;

  // Meat & Seafood Detection
  const meatKeywords = [
    'chicken', 'beef', 'mutton', 'lamb', 'pork', 'bacon', 'turkey',
    'duck', 'fish', 'shrimp', 'prawn', 'salmon', 'tuna', 'steak',
    'meat', 'ham', 'sausage', 'pepperoni'
  ];

  const hasMeat = meatKeywords.some((keyword) => allText.includes(keyword));

  // Dairy & Egg Detection
  const animalProductKeywords = [
    'egg', 'eggs', 'milk', 'cheese', 'feta', 'parmesan', 'butter',
    'cream', 'yogurt', 'curd', 'mayo', 'mayonnaise', 'honey'
  ];
  const hasAnimalProducts = hasMeat || animalProductKeywords.some((keyword) => allText.includes(keyword));

  const generated = [];

  // Category & Attribute Tags
  if (allText.includes('protein') || (recipe.protein && parseInt(recipe.protein) >= 20) || hasMeat) {
    generated.push('#HighProtein');
  }

  if (allText.includes('quick') || allText.includes('easy') || (recipe.time && parseInt(recipe.time) <= 20)) {
    generated.push('#Quick&Easy');
  }

  if (allText.includes('spicy') || allText.includes('chili') || allText.includes('tikka') || allText.includes('curry')) {
    generated.push('#Spicy');
  }

  if (allText.includes('healthy') || allText.includes('salad') || allText.includes('avocado') || allText.includes('quinoa')) {
    generated.push('#Healthy');
  }

  if (allText.includes('breakfast') || allText.includes('omelette') || allText.includes('pancake') || allText.includes('parfait')) {
    generated.push('#Breakfast');
  } else if (allText.includes('dinner') || allText.includes('roast') || allText.includes('bowl')) {
    generated.push('#Dinner');
  }

  // Dietary Classification
  if (!hasMeat) {
    if (!hasAnimalProducts) {
      generated.push('#Vegan');
    } else {
      generated.push('#Vegetarian');
    }
  }

  if (generated.length === 0) {
    generated.push('#ChefSpecial', '#Quick&Easy');
  } else if (generated.length === 1) {
    generated.push('#ChefSpecial');
  }

  return Array.from(new Set(generated)).slice(0, 4);
}

export default function RecipeCard({ recipe, onOpenGrocery, onSelectSimilar, onRemoveFavorite }) {
  const cardRef = useRef(null);
  const [isSaved, setIsSaved] = useState(() => {
    return historyManager.getFavorites().some((r) => r.name === recipe.name);
  });
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const syncSaved = () => {
      const saved = historyManager.getFavorites().some((r) => r.name === recipe.name);
      setIsSaved(saved);
    };
    syncSaved();
    window.addEventListener('chefai_data_changed', syncSaved);
    return () => {
      window.removeEventListener('chefai_data_changed', syncSaved);
    };
  }, [recipe]);

  const tags = getRecipeTags(recipe);
  const dietary = recipe.dietary || ['🌱 Dairy-Free Option', '🥜 Nut-Free', '🌾 Gluten-Free Available'];
  const similarRecipes = Array.isArray(recipe.similar)
    ? recipe.similar
    : [];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // --- Real Favorites Action ---
  const handleToggleSave = () => {
    try {
      const isAlreadySaved = historyManager.isFavorite(recipe.name);
      if (isAlreadySaved) {
        triggerToast('Already added to Favorites');
      } else {
        const saved = historyManager.saveFavorite(recipe);
        if (saved) {
          setIsSaved(true);
          triggerToast('❤️ Added to Favorites');
        }
      }
    } catch (err) {
      console.error('Save Action Error:', err);
      triggerToast('Unable to save recipe. Please try again.');
    }
  };

  // --- Real Grocery List Action ---
  const handleAddGrocery = () => {
    const selectedList = (recipe.ingredients || []).filter(
      (item) => !!selectedIngredients[item]
    );

    if (selectedList.length === 0) {
      triggerToast('Please select ingredients first');
      return;
    }

    const recipeForGrocery = {
      ...recipe,
      ingredients: selectedList,
    };

    historyManager.addRecipeToGrocery(recipeForGrocery);

    triggerToast('🛒 Added to Grocery List');
  };

  // --- Real Share Action ---
  const handleShare = async () => {
    const shareText = `🧑‍🍳 ChefAI Recipe: ${recipe.name}\n⏱ Time: ${recipe.time} | 🍽 Servings: ${recipe.servings}\n🔥 Calories: ${recipe.calories} | 💪 Protein: ${recipe.protein}\n\n🛒 Ingredients:\n${recipe.ingredients.join('\n')}\n\n👨‍🍳 Steps:\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: shareText,
          url: window.location.href,
        });
        triggerToast('Shared recipe successfully! 📤');
      } catch (err) {
        if (err.name !== 'AbortError') {
          await navigator.clipboard.writeText(shareText);
          triggerToast('Recipe copied to clipboard for sharing! 📤');
        }
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      triggerToast('Recipe copied to clipboard for sharing! 📤');
    }
  };

  // --- Real Copy Action ---
  const handleCopy = async () => {
    try {
      const recipeText = [
        `🧑‍🍳 ChefAI Recipe: ${recipe.name || 'Recipe'}`,
        recipe.desc ? `📝 Description: ${recipe.desc}` : '',
        `⏱ Cooking Time: ${recipe.time || 'N/A'}`,
        `🍽 Servings: ${recipe.servings || 'N/A'}`,
        recipe.difficulty ? `👨‍🍳 Difficulty: ${recipe.difficulty}` : '',
        '',
        '📊 Nutrition Information:',
        `Calories: ${recipe.calories || 'N/A'}`,
        `Protein: ${recipe.protein || 'N/A'}`,
        `Carbs: ${recipe.carbs || 'N/A'}`,
        `Fat: ${recipe.fat || 'N/A'}`,
        '',
        '🛒 Ingredients:',
        ...(recipe.ingredients || []).map(
          (item, index) => `${index + 1}. ${item}`
        ),
        '',
        '👨‍🍳 Step-by-Step Instructions:',
        ...(recipe.steps || []).map(
          (step, index) => `${index + 1}. ${step}`
        ),
        recipe.tip ? `\n💡 Chef Tip: ${recipe.tip}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(recipeText);

        triggerToast('📋 Recipe copied successfully');
        return;
      }

      const textArea = document.createElement('textarea');

      textArea.value = recipeText;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.style.opacity = '0';

      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);

      const copied = document.execCommand('copy');

      document.body.removeChild(textArea);

      if (copied) {
        triggerToast('📋 Recipe copied successfully');
      } else {
        throw new Error('Browser could not copy the recipe.');
      }
    } catch (error) {
      console.error('COPY ERROR:', error);
      triggerToast('❌ Copy failed. Please try again.');
    }
  };
  // --- Real Print Action ---
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.name} - ChefAI Recipe</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
            h1 { color: #0f172a; border-bottom: 3px solid #10b981; padding-bottom: 12px; margin-bottom: 16px; }
            .meta-bar { display: flex; gap: 20px; background: #f8fafc; padding: 12px 16px; border-radius: 8px; font-size: 14px; font-weight: bold; margin-bottom: 20px; border: 1px solid #e2e8f0; }
            .nutrition-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
            .nutrition-card { background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center; }
            .nutrition-card label { display: block; font-size: 11px; color: #64748b; font-weight: bold; }
            .nutrition-card val { font-size: 16px; font-weight: bold; color: #10b981; }
            h3 { color: #059669; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; }
            ul, ol { padding-left: 20px; }
            li { margin-bottom: 8px; font-size: 14px; }
            .tip-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; margin-top: 24px; border-radius: 6px; color: #78350f; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>${recipe.img || '🍳'} ${recipe.name}</h1>
          <div class="meta-bar">
            <span>⏱ Time: ${recipe.time}</span>
            <span>🍽 Servings: ${recipe.servings}</span>
            <span>👨‍🍳 Difficulty: ${recipe.difficulty}</span>
          </div>
          <div class="nutrition-grid">
            <div class="nutrition-card"><label>Calories</label><val>${recipe.calories}</val></div>
            <div class="nutrition-card"><label>Protein</label><val>${recipe.protein}</val></div>
            <div class="nutrition-card"><label>Carbs</label><val>${recipe.carbs}</val></div>
            <div class="nutrition-card"><label>Fat</label><val>${recipe.fat}</val></div>
          </div>
          <h3>🛒 Ingredients</h3>
          <ul>${(recipe.ingredients || []).map((i) => `<li>${i}</li>`).join('')}</ul>
          <h3>👨‍🍳 Step-by-Step Instructions</h3>
          <ol>${(recipe.steps || []).map((s) => `<li>${s}</li>`).join('')}</ol>
          <div class="tip-box">💡 <strong>Chef Tip:</strong> ${recipe.tip}</div>
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    triggerToast('Opening print view... 🖨️');
  };

  // --- Production-Ready Download PDF Action using html2canvas & jsPDF ---
  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    triggerToast('Generating PDF...');

    try {
      await generateRecipePDF(recipe);
      triggerToast('📄 PDF downloaded successfully');
    } catch (error) {
      console.error('PDF ERROR:', error);
      triggerToast(
        'Failed to generate PDF: ' + (error?.message || String(error))
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleToggleIngredient = (itemKey) => {
    setSelectedIngredients((prev) => {
      const updated = { ...prev, [itemKey]: !prev[itemKey] };
      return updated;
    });
  };

  const visibleSteps = isExpanded ? recipe.steps : recipe.steps.slice(0, 3);
  const checkedCount = Object.values(selectedIngredients).filter(Boolean).length;

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl rounded-bl-md w-full sm:max-w-[92%] shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-all duration-300 relative"
    >

      {/* Floating Action Feedback Toast */}
      {toastMessage && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-20 z-50 pointer-events-none">
          <div
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg border whitespace-nowrap ${toastMessage.includes('Please select')
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : toastMessage.includes('failed') || toastMessage.includes('Unable')
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
          >
            {toastMessage}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 space-y-4">
        {/* Header Title & AI Badge */}
        <div className="flex items-start sm:items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{recipe.img}</span>
            <span>{recipe.name}</span>
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> ChefAI Generated
          </span>
        </div>

        {/* Recipe Tags Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
              <Tag className="w-3 h-3 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>

        {/* Recipe Meta Info Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Time: {recipe.time}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Servings: {recipe.servings}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>Difficulty: {recipe.difficulty}</span>
          </span>
        </div>

        {/* High-Contrast Nutrition Macros Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="nutrition-card-emerald text-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 hover:scale-[1.02] transition-transform">
            <p className="nutrition-label text-[10px] sm:text-[11px] font-bold text-slate-600">Calories</p>
            <p className="nutrition-value text-xs sm:text-base font-extrabold text-emerald-600 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 inline sm:hidden" />
              {recipe.calories}
            </p>
          </div>

          <div className="nutrition-card-blue text-center p-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:scale-[1.02] transition-transform">
            <p className="nutrition-label text-[10px] sm:text-[11px] font-bold text-slate-600">Protein</p>
            <p className="nutrition-value text-xs sm:text-base font-extrabold text-blue-600">{recipe.protein}</p>
          </div>

          <div className="nutrition-card-amber text-center p-2.5 rounded-xl bg-amber-50 border border-amber-100 hover:scale-[1.02] transition-transform">
            <p className="nutrition-label text-[10px] sm:text-[11px] font-bold text-slate-600">Carbs</p>
            <p className="nutrition-value text-xs sm:text-base font-extrabold text-amber-600">{recipe.carbs}</p>
          </div>

          <div className="nutrition-card-rose text-center p-2.5 rounded-xl bg-rose-50 border border-rose-100 hover:scale-[1.02] transition-transform">
            <p className="nutrition-label text-[10px] sm:text-[11px] font-bold text-slate-600">Fat</p>
            <p className="nutrition-value text-xs sm:text-base font-extrabold text-rose-600">{recipe.fat}</p>
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              🛒 Ingredients Checklist
            </p>
            <span className="text-[11px] font-medium text-slate-500">
              {checkedCount}/{recipe.ingredients.length} checked
            </span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 font-normal">
            {recipe.ingredients.map((item, idx) => {
              const isChecked = !!selectedIngredients[item];
              return (
                <li
                  key={idx}
                  onClick={() => handleToggleIngredient(item)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition min-h-[36px] ${isChecked
                    ? 'bg-emerald-50/60'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Step-by-Step Instructions */}
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
            👨‍🍳 Step-by-Step Instructions
          </p>
          <ol className="text-xs sm:text-sm text-slate-700 space-y-2.5 font-normal">
            {visibleSteps.map((step, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-extrabold mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {recipe.steps.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Show All {recipe.steps.length} Steps</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Chef Tip Section */}
        <div className="bg-amber-50 rounded-xl p-3 sm:p-3.5 border border-amber-200 shadow-sm">
          <p className="text-xs sm:text-sm text-amber-900">
            💡 <strong>Chef Tip:</strong> {recipe.tip}
          </p>
        </div>

        {/* Dietary Labels */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Dietary:
          </span>
          {dietary.map((label, idx) => (
            <span key={idx} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
              {label}
            </span>
          ))}
        </div>

        {/* Action Buttons Toolbar (All 6 Real Functionalities Implemented) */}
        <div className="flex flex-wrap gap-2 pt-2">
          {/* 1. Save to Favorites */}
          <button
            onClick={handleToggleSave}
            className={`action-btn-save flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 min-h-[38px] hover:scale-105 active:scale-95 ${isSaved
              ? 'bg-rose-500 text-white shadow-sm'
              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              }`}
          >
            <Heart className={`w-3.5 h-3.5 transition-transform ${isSaved ? 'fill-current scale-110' : ''}`} />
            {isSaved ? 'Saved' : 'Save'}
          </button>

          {/* 2. Share Recipe */}
          <button
            onClick={handleShare}
            className="action-btn-share flex-1 sm:flex-none px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-1.5 min-h-[38px] hover:scale-105 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>

          {/* 3. Copy Recipe */}
          <button
            type="button"
            onClick={handleCopy}
            className="action-btn-copy flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 min-h-[38px] hover:scale-105 active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>

          {/* 4. Print Recipe */}
          <button
            onClick={handlePrint}
            className="action-btn-print flex-1 sm:flex-none px-3 py-2 rounded-xl bg-purple-50 text-purple-600 text-xs font-semibold hover:bg-purple-100 transition-all flex items-center justify-center gap-1.5 min-h-[38px] hover:scale-105 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          {/* 5. Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="action-btn-pdf flex-1 sm:flex-none px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-all flex items-center justify-center gap-1.5 min-h-[38px] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPDF ? 'Generating...' : 'PDF'}
          </button>

          {/* 6. Add to Grocery List */}
          <button
            type="button"
            onClick={handleAddGrocery}
            className="action-btn-grocery w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 min-h-[38px] hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Grocery List
          </button>
        </div>

        {/* Floating Action Feedback Toast */}
        {toastMessage && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-24 sm:bottom-20 z-50 pointer-events-none">
            <div
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg border whitespace-nowrap ${toastMessage.includes('Please select')
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : toastMessage.includes('failed') || toastMessage.includes('Unable')
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
            >
              {toastMessage}
            </div>
          </div>
        )}

        {/* Similar Recipes Recommendations */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
            <Utensils className="w-3.5 h-3.5 text-emerald-500" /> Similar Recipes You Might Like
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {similarRecipes.map((sim, i) => (
              <div
                key={i}
                onClick={() => onSelectSimilar && onSelectSimilar(sim.name)}
                className="p-2.5 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200/80 cursor-pointer transition flex items-center gap-2.5 group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{sim.img}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-emerald-700 truncate">{sim.name}</p>
                  <p className="text-[10px] text-gray-400">{sim.time} • {sim.calories}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
