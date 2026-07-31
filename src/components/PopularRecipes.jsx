import React from 'react';

export default function PopularRecipes({ onSelectPopular }) {
  const popularList = [
    {
      query: 'creamy pasta',
      name: 'Creamy Garlic Pasta',
      img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281313?auto=format&fit=crop&w=400&q=80',
      time: '25m',
      rating: '4.8',
      cals: '420cal',
      level: 'Beginner',
      badgeClass: 'bg-emerald-50 text-emerald-600'
    },
    {
      query: 'chicken and rice',
      name: 'Lemon Herb Chicken Rice',
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      time: '45m',
      rating: '4.9',
      cals: '550cal',
      level: 'Intermediate',
      badgeClass: 'bg-amber-50 text-amber-600'
    },
    {
      query: 'vegetable fried rice',
      name: 'Vegetable Fried Rice',
      img: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80',
      time: '20m',
      rating: '4.6',
      cals: '380cal',
      level: 'Beginner',
      badgeClass: 'bg-emerald-50 text-emerald-600'
    },
    {
      query: 'grilled sandwich',
      name: 'Grilled Cheese & Herb',
      img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
      time: '15m',
      rating: '4.5',
      cals: '320cal',
      level: 'Beginner',
      badgeClass: 'bg-emerald-50 text-emerald-600'
    },
    {
      query: 'healthy salad',
      name: 'Mediterranean Power Salad',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
      time: '10m',
      rating: '4.7',
      cals: '180cal',
      level: 'Beginner',
      badgeClass: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <section id="popular-section" className="mb-10 sm:mb-12 fade-up-delay-2 px-2 sm:px-0">
      <h3 className="font-semibold text-slate-800 mb-4 sm:mb-6 text-base sm:text-lg md:text-xl">
        Popular Recipes
      </h3>
      <div className="recipe-scroll flex gap-3 sm:gap-4 pb-3 sm:pb-4 overflow-x-auto scrollbar-none snap-x">
        {popularList.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPopular(item.query)}
            className="recipe-card flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-200 hover:shadow-md transition-all duration-200 snap-start"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-28 sm:h-32 object-cover"
              loading="lazy"
            />
            <div className="p-3 sm:p-4">
              <p className="font-semibold text-xs sm:text-sm text-slate-800 truncate">
                {item.name}
              </p>
              <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-[11px] sm:text-xs text-slate-500">
                <span>⏱ {item.time}</span>
                <span>⭐ {item.rating}</span>
                <span>🔥 {item.cals}</span>
              </div>
              <span
                className={`inline-block mt-2 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeClass}`}
              >
                {item.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
