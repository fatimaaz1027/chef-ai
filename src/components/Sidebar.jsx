import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Heart,
  Clock,
  ShoppingCart,
  Home,
  Settings,
  Trash2,
  FileQuestion,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SquarePen
} from 'lucide-react';
import { historyManager } from '../utils/historyManager';

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  onNewChat,
  onOpenRecipeIdeas,
  onOpenPersonalized,
  onOpenScanIngredients,
  onOpenMealPlanner,
  onSelectChat,
  onSelectFeature,
  onOpenSettings
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [groceryCount, setGroceryCount] = useState(0);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [historyData, setHistoryData] = useState({
    generated: [],
    viewed: [],
    saved: [],
    favorites: [],
  });

  const loadCountsAndHistory = () => {
    setFavoritesCount(historyManager.getFavoritesCount());
    setGroceryCount(historyManager.getGroceryCount());
    setHistoryData(historyManager.searchHistory(searchQuery));
  };

  useEffect(() => {
    loadCountsAndHistory();
    const handleDataChanged = () => loadCountsAndHistory();
    window.addEventListener('chefai_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('chefai_data_changed', handleDataChanged);
    };
  }, [isOpen, searchQuery, activeView]);

  const handleClearHistory = () => {
    historyManager.clearAllHistory();
    loadCountsAndHistory();
  };

  const handleSelectRecipe = (recipe) => {
    historyManager.addViewedRecipe(recipe);
    onNavigate('home');
    onSelectChat(recipe.name);
  };

  const hasHistory =
    historyData.generated.length > 0 ||
    historyData.viewed.length > 0 ||
    historyData.saved.length > 0 ||
    historyData.favorites.length > 0;

  return (
    <aside
      id="sidebar"
      className={`sidebar fixed top-0 left-0 h-full w-[85vw] max-w-xs sm:w-80 z-40 bg-white border-r border-gray-200 shadow-2xl flex flex-col ${isOpen ? 'open' : ''
        }`}
      aria-label="Navigation & History"
    >
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧑‍🍳</span>
          <h2 className="font-extrabold text-slate-800 text-sm sm:text-base">ChefAI Menu</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 text-slate-500 min-h-[40px] min-w-[40px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation & Features List */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">

        {/* ✏️ New Chat Option */}
        <div>
          <button
            onClick={() => {
              if (onNewChat) {
                onNewChat();
              } else {
                onNavigate('home');
                onClose();
              }
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 hover:bg-emerald-50 transition min-h-[40px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">✏️</span>
              <span>New Chat</span>
            </div>
            <SquarePen className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* 🤖 AI Features Accordion */}
        <div>
          <button
            onClick={() => setIsAIOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 hover:bg-emerald-50 transition min-h-[40px]"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">🤖</span>
              <span>AI Features</span>
            </div>
            {isAIOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500 transition-transform duration-200" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500 transition-transform duration-200" />
            )}
          </button>

          <div
            className={`pl-4 space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out ${isAIOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0 mt-0'
              }`}
          >
            <button
              onClick={() => {
                onClose();
                if (onOpenScanIngredients) {
                  onOpenScanIngredients();
                } else if (onSelectFeature) {
                  onSelectFeature('I have a photo of tomatoes and basil, what can I make?');
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <span className="text-sm">📷</span>
              <span>Scan Ingredients</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenRecipeIdeas) {
                  onOpenRecipeIdeas();
                } else if (onSelectFeature) {
                  onSelectFeature('Show me creative recipe ideas based on pantry staples');
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <span className="text-sm">🍳</span>
              <span>Recipe Ideas</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenPersonalized) {
                  onOpenPersonalized();
                } else if (onSelectFeature) {
                  onSelectFeature('Give me personalized recipe recommendations based on my preferences');
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <span className="text-sm">✨</span>
              <span>Personalized Recommendations</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenMealPlanner) {
                  onOpenMealPlanner();
                } else if (onSelectFeature) {
                  onSelectFeature('Create a 7-day meal plan');
                }
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
            >
              <span className="text-sm">📅</span>
              <span>Meal Planner</span>
            </button>
          </div>
        </div>

        {/* Saved & Grocery Section */}
        <div className="pt-1 border-t border-gray-100 space-y-1">
          {/* Saved Recipes */}
          <button
            onClick={() => {
              onNavigate('favorites');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs sm:text-sm transition min-h-[40px] ${activeView === 'favorites'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-700 hover:bg-emerald-50'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <span>❤️</span>
              <span>Saved Recipes</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-transform ${activeView === 'favorites'
                ? 'bg-white text-emerald-600'
                : 'bg-rose-50 text-rose-600 border border-rose-200'
                }`}
            >
              {favoritesCount}
            </span>
          </button>

          {/* Grocery List */}
          <button
            onClick={() => {
              onNavigate('grocery');
              onClose();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl font-semibold text-xs sm:text-sm transition min-h-[40px] ${activeView === 'grocery'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-700 hover:bg-emerald-50'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <span>🛒</span>
              <span>Grocery List</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-transform ${activeView === 'grocery'
                ? 'bg-white text-emerald-600'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}
            >
              {groceryCount}
            </span>
          </button>
        </div>

        {/* History Header & Search */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Clock className="w-3.5 h-3.5" /> Recent History
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs outline-none focus:border-emerald-400 text-slate-800"
            />
          </div>

          {/* Recent History List */}
          <div className="space-y-3 pt-2">
            {!hasHistory ? (
              <div className="text-center py-6 px-4 text-gray-400">
                <FileQuestion className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                <p className="text-xs font-medium">No recent history</p>
              </div>
            ) : (
              <>
                {historyData.generated.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 mb-1">Generated Recipes</p>
                    <div className="space-y-1">
                      {historyData.generated.slice(0, 5).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectRecipe(item)}
                          className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 transition min-h-[38px] flex items-center gap-2 group"
                        >
                          <span className="text-sm">{item.img || '🍲'}</span>
                          <p className="text-xs font-medium text-slate-700 truncate group-hover:text-emerald-700">
                            {item.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {historyData.viewed.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 mb-1">Recently Viewed</p>
                    <div className="space-y-1">
                      {historyData.viewed.slice(0, 5).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectRecipe(item)}
                          className="w-full text-left p-2 rounded-xl hover:bg-emerald-50 transition min-h-[38px] flex items-center gap-2 group"
                        >
                          <span className="text-sm">{item.img || '🥗'}</span>
                          <p className="text-xs font-medium text-slate-700 truncate group-hover:text-emerald-700">
                            {item.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>

      {/* Delete History Footer Button */}
      {hasHistory && (
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleClearHistory}
            className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 min-h-[38px]"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        </div>
      )}
    </aside>
  );
}
