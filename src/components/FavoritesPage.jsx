import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import RecipeCard from './RecipeCard';
import { historyManager } from '../utils/historyManager';

export default function FavoritesPage({ onGoHome, onOpenGrocery, onSelectSimilar }) {
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const loadFavorites = () => {
    setFavorites(historyManager.getFavorites());
  };

  useEffect(() => {
    loadFavorites();
    const handleDataChanged = () => loadFavorites();
    window.addEventListener('chefai_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('chefai_data_changed', handleDataChanged);
    };
  }, []);

  const handleRemoveFavorite = (recipeName) => {
    try {
      historyManager.removeFavorite(recipeName);
      triggerToast('💔 Removed from Favorites');
      loadFavorites();
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  return (
    <div className="space-y-6 fade-up pt-4 sm:pt-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-slate-600 transition flex items-center justify-center"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Saved Favorites
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'} saved in your collection
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => {
              historyManager.clearAllHistory();
              loadFavorites();
            }}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {/* Favorites List or Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl">
            ❤️
          </div>
          <h3 className="text-lg font-bold text-slate-800">No favorite recipes yet</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Start saving recipes by clicking the heart button on any recipe card to build your personal cookbook.
          </p>
          <button
            onClick={onGoHome}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition"
          >
            Explore & Create Recipes
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {favorites.map((recipe, idx) => (
            <div key={idx} className="relative group space-y-2">
              <div className="flex justify-end">
                <button
                  onClick={() => handleRemoveFavorite(recipe.name)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition flex items-center gap-1.5 border border-rose-200"
                  title="Remove from Favorites"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Remove from Favorites</span>
                </button>
              </div>
              <RecipeCard
                recipe={recipe}
                onOpenGrocery={onOpenGrocery}
                onSelectSimilar={onSelectSimilar}
                onRemoveFavorite={() => handleRemoveFavorite(recipe.name)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
