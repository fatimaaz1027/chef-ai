import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  CheckSquare,
  Square,
  Trash2,
  Copy,
  Printer,
  Download,
  Search,
  ArrowLeft,
  Filter,
  ArrowUpDown,
  Check,
  Plus,
  Utensils
} from 'lucide-react';
import { historyManager } from '../utils/historyManager';
import { generateGroceryListPDF } from '../utils/pdfService';

export default function GroceryPage({ onGoHome }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'incomplete' | 'completed'
  const [sortAlpha, setSortAlpha] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadItems = () => {
    setItems(historyManager.getGroceryItems());
  };

  useEffect(() => {
    loadItems();
    const handleDataChanged = () => loadItems();
    window.addEventListener('chefai_data_changed', handleDataChanged);
    return () => {
      window.removeEventListener('chefai_data_changed', handleDataChanged);
    };
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  const handleToggleItem = (id) => {
    const updated = historyManager.toggleGroceryItem(id);
    setItems(updated);
  };

  const handleRemoveSingle = (id) => {
    const updated = historyManager.removeGroceryItem(id);
    setItems(updated);
    triggerToast('Removed from Grocery List');
  };

  const handleRemoveRecipeGroup = (recipeName) => {
    const updated = historyManager.removeRecipeFromGrocery(recipeName);
    setItems(updated);
    triggerToast(`Removed all items from ${recipeName} ✓`);
  };

  const handleClearAll = () => {
    historyManager.clearGroceryList();
    setItems([]);
    triggerToast('Cleared entire grocery list ✓');
  };

  const handleCopyList = () => {
    if (items.length === 0) return;
    const text = items
      .map((item) => `${item.checked ? '[x]' : '[ ]'} ${item.ingredient} (${item.recipeName})`)
      .join('\n');
    navigator.clipboard.writeText(`🛒 ChefAI Grocery List:\n\n${text}`);
    triggerToast('📋 Grocery list copied to clipboard!');
  };

  const handlePrintList = () => {
    triggerToast('🖨️ Opening print view...');
    setTimeout(() => window.print(), 500);
  };

  const handleDownloadList = async () => {
    if (items.length === 0) return;
    
    try {
      triggerToast('📄 Generating PDF...');
      await generateGroceryListPDF(items);
      triggerToast('📥 Downloaded Grocery List PDF!');
    } catch (err) {
      console.error('Grocery PDF generation error:', err);
      triggerToast('❌ Failed to generate PDF.');
    }
  };

  // Filter items
  let filteredItems = items.filter((item) => {
    if (!item) return false;
    const ingText = item.ingredient || (typeof item === 'string' ? item : '');
    const recName = item.recipeName || '';
    const matchesSearch =
      ingText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'incomplete') return !item.checked;
    if (filterMode === 'completed') return item.checked;
    return true;
  });

  // Sort items alphabetically if active
  if (sortAlpha) {
    filteredItems = [...filteredItems].sort((a, b) => {
      const nameA = a.ingredient || '';
      const nameB = b.ingredient || '';
      return nameA.localeCompare(nameB);
    });
  }

  // Group items by recipe
  const groupedRecipes = filteredItems.reduce((acc, item) => {
    const groupName = item.recipeName || 'General Items';
    if (!acc[groupName]) {
      acc[groupName] = { img: item.recipeImg || '🍲', items: [] };
    }
    acc[groupName].items.push(item);
    return acc;
  }, {});

  const totalItems = items.length;
  const completedCount = items.filter((i) => i.checked).length;

  return (
    <div className="space-y-6 fade-up pt-4 sm:pt-6 relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xl fade-up flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
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
              <ShoppingCart className="w-6 h-6 text-emerald-500" /> Grocery List
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {completedCount}/{totalItems} items completed
            </p>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyList}
            disabled={items.length === 0}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          <button
            onClick={handlePrintList}
            disabled={items.length === 0}
            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button
            onClick={handleDownloadList}
            disabled={items.length === 0}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search ingredients or recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm outline-none focus:border-emerald-400 text-slate-800"
          />
        </div>

        {/* Filter Tabs & Sort Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterMode === 'all' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilterMode('incomplete')}
              className={`px-3 py-1 rounded-lg transition ${
                filterMode === 'incomplete' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600'
              }`}
            >
              To Buy ({items.filter((i) => !i.checked).length})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-3 py-1 rounded-lg transition ${
                filterMode === 'completed' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <button
            onClick={() => setSortAlpha(!sortAlpha)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
              sortAlpha
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'
            }`}
            title="Sort Alphabetically"
          >
            <ArrowUpDown className="w-3.5 h-3.5" /> A-Z
          </button>
        </div>
      </div>

      {/* Grocery Items List Grouped by Recipe */}
      {Object.keys(groupedRecipes).length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
            🛒
          </div>
          <h3 className="text-lg font-bold text-slate-800">Your grocery list is empty</h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Add ingredients directly from any recipe card by clicking "Add to Grocery List".
          </p>
          <button
            onClick={onGoHome}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition"
          >
            Find Recipes & Ingredients
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedRecipes).map(([recipeName, group], idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3"
            >
              {/* Recipe Group Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{group.img}</span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">{recipeName}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {group.items.length} items
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveRecipeGroup(recipeName)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-semibold p-1 hover:bg-rose-50 rounded-lg transition flex items-center gap-1"
                  title="Remove all items for this recipe"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Group
                </button>
              </div>

              {/* Ingredients List */}
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      item.checked
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 opacity-70 line-through'
                        : 'bg-gray-50 border-gray-100 text-slate-800 hover:bg-white hover:border-gray-300'
                    }`}
                  >
                    <div
                      onClick={() => handleToggleItem(item.id)}
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                    >
                      <button className="text-emerald-600 flex-shrink-0 transition-transform active:scale-90">
                        {item.checked ? (
                          <CheckSquare className="w-5 h-5 fill-emerald-500 text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <span className="text-xs sm:text-sm font-medium">{item.ingredient}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveSingle(item.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
