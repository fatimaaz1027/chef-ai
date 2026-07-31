import React from 'react';

export default function FeaturesSection({ onSelectFeature }) {
  const features = [
    { emoji: '🍳', title: 'AI Recipe Generator', desc: 'Instant recipes from your ingredients', query: 'Show me what I can cook with eggs, cheese and butter' },
    { emoji: '🥗', title: 'Nutrition & Macros', desc: 'Calories, protein, carbs & fat details', query: 'Give me a high protein low carb meal idea' },
    { emoji: '🛒', title: 'Smart Grocery List', desc: 'Automatic ingredient checklist generation', query: 'Generate a weekly grocery list for meal prep' },
    { emoji: '📅', title: 'Weekly Meal Planning', desc: 'Custom meal plans for your goals', query: 'Create a 3-day healthy dinner meal plan' },
    { emoji: '❤️', title: 'Saved Recipes', desc: 'Bookmark your favorite culinary creations', query: 'Show my saved favorite recipes' },
    { emoji: '📷', title: 'Image Scanner', desc: 'Upload food photos to detect items', query: 'I have a photo of tomatoes and basil, what can I make?' },
    { emoji: '🌍', title: 'World Cuisines', desc: 'Italian, Asian, Mexican & Mediterranean', query: 'Authentic Italian pasta recipe' },
    { emoji: '⏱', title: 'Quick & Easy Filters', desc: '15-min meals to gourmet feasts', query: 'Quick 15-minute dinner recipes' },
    { emoji: '💰', title: 'Budget Friendly', desc: 'Affordable cooking with pantry staples', query: 'Cheap budget friendly dinner ideas' },
    { emoji: '🌱', title: 'Dietary Options', desc: 'Vegan, Keto, Gluten-Free & Halal options', query: 'Delicious vegan dinner recipe' },
    { emoji: '🌶', title: 'Custom Spice Levels', desc: 'Mild, medium, hot & extra spicy', query: 'Spicy chicken curry recipe' },
    { emoji: '👨‍🍳', title: 'Skill Level Tuning', desc: 'Beginner-friendly to master chef', query: 'Easy beginner dinner recipe' },
  ];

  return (
    <section id="features-section" className="mb-10 sm:mb-12 fade-up-delay px-2 sm:px-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {features.map((feat, idx) => (
          <div
            key={idx}
            onClick={() => onSelectFeature(feat.query)}
            className="canva-card feature-card bg-white rounded-2xl p-3.5 sm:p-5 text-center cursor-pointer border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-400 active:scale-95 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px]"
          >
            <span className="text-2xl sm:text-3xl block mb-2 sm:mb-3">{feat.emoji}</span>
            <p className="canva-text text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
              {feat.title}
            </p>
            <p className="canva-text text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-snug">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
