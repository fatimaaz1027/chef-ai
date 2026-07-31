import React, { useState } from 'react';
import { X, CheckSquare, Square, ShoppingBag, Copy, Check } from 'lucide-react';

export default function GroceryModal({ recipe, onClose }) {
  const [checkedMap, setCheckedMap] = useState({});
  const [copied, setCopied] = useState(false);

  if (!recipe) return null;

  const toggleCheck = (idx) => {
    setCheckedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyList = () => {
    const list = recipe.ingredients
      .map((ing, i) => `${checkedMap[i] ? '[x]' : '[ ]'} ${ing}`)
      .join('\n');
    navigator.clipboard.writeText(`Grocery List for ${recipe.name}:\n\n${list}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-[92vw] sm:w-full p-4 sm:p-6 shadow-2xl border border-gray-100 animate-fade-in">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Grocery Checklist
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-500 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 mb-3">
          Shopping list for <span className="font-semibold text-slate-700">{recipe.name}</span>:
        </p>

        <div className="space-y-2 max-h-52 sm:max-h-60 overflow-y-auto pr-1">
          {recipe.ingredients.map((ing, idx) => {
            const isChecked = !!checkedMap[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl cursor-pointer transition min-h-[44px] ${
                  isChecked
                    ? 'bg-emerald-50 text-emerald-700 line-through opacity-70'
                    : 'bg-gray-50 text-slate-700 hover:bg-gray-100'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-medium">{ing}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-4 mt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
          <button
            onClick={handleCopyList}
            className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md min-h-[44px]"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'List Copied!' : 'Copy Checklist'}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-slate-700 rounded-xl font-medium text-xs sm:text-sm transition min-h-[44px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
