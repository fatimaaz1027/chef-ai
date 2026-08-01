import React from 'react';

export default function FloatingIcons() {
  return (
    <div className="fixed pointer-events-none inset-0 overflow-hidden z-0 select-none">
      {/* Top Left - Avocado */}
      <span className="floating-icon absolute top-[12%] left-[3%] sm:left-[5%] float-anim opacity-40 dark:opacity-20 text-3xl sm:text-4xl md:text-5xl">
        🥑
      </span>
      {/* Top Right - Tomato */}
      <span className="floating-icon absolute top-[15%] right-[4%] sm:right-[6%] float-anim-2 opacity-40 dark:opacity-20 text-3xl sm:text-4xl md:text-5xl">
        🍅
      </span>
      {/* Mid Left - Onion */}
      <span className="floating-icon absolute top-[45%] left-[2%] sm:left-[3%] float-anim-3 opacity-35 dark:opacity-20 text-2xl sm:text-3xl md:text-4xl">
        🧅
      </span>
      {/* Mid Right - Potato */}
      <span className="floating-icon absolute top-[48%] right-[2%] sm:right-[4%] float-anim opacity-35 dark:opacity-20 text-2xl sm:text-3xl md:text-4xl">
        🥔
      </span>
      {/* Lower Left - Chili Pepper */}
      <span className="floating-icon absolute bottom-[26%] left-[4%] sm:left-[6%] float-anim-2 opacity-35 dark:opacity-20 text-2xl sm:text-3xl md:text-4xl">
        🌶️
      </span>
      {/* Lower Right - Carrot */}
      <span className="floating-icon absolute bottom-[28%] right-[4%] sm:right-[5%] float-anim-3 opacity-35 dark:opacity-20 text-2xl sm:text-3xl md:text-4xl">
        🥕
      </span>
      {/* Bottom Left Corner - Spinach */}
      <span className="floating-icon absolute bottom-[10%] left-[8%] float-anim opacity-35 dark:opacity-20 text-2xl sm:text-3xl md:text-4xl">
        🥬
      </span>
    </div>
  );
}
