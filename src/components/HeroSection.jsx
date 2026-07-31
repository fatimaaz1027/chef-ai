import React from 'react';

export default function HeroSection({ onStartCooking }) {
  return (
    <section id="hero-section" className="text-center py-4 sm:py-6 fade-up">
      {/* Responsive Central Food Image Visual */}
      <div className="mb-5 sm:mb-6 relative inline-block">
        <div
          className="absolute inset-0 bg-emerald-300/30 blur-3xl rounded-full"
          style={{ width: '220px', height: '220px', margin: '-10px' }}
        ></div>
        <img
          src="/food2.jpeg"
          alt="Healthy Salad Bowl"
          className="w-44 h-44 sm:w-56 sm:h-56 mx-auto rounded-3xl object-cover shadow-md relative z-10 hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/hero.jpg';
          }}
        />
      </div>

      {/* Responsive Headline */}
      <h2 className="font-extrabold text-slate-900 dark:text-slate-100 mb-3 text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight px-2">
        Cook Smarter with AI
      </h2>

      {/* Responsive Subtitle */}
      <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed text-xs sm:text-sm md:text-base px-4 font-normal">
        Tell ChefAI what ingredients you have and instantly receive delicious recipes, cooking instructions, and helpful kitchen tips.
      </p>

      {/* Centered Primary CTA Button */}
      <div className="flex items-center justify-center max-w-xs sm:max-w-none mx-auto mb-2 sm:mb-4 px-4">
        <button
          onClick={onStartCooking}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-semibold text-white bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all text-sm sm:text-base min-h-[44px]"
        >
          Start Cooking
        </button>
      </div>
    </section>
  );
}
