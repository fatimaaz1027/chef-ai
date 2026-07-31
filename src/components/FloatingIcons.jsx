import React from 'react';

export default function FloatingIcons() {
  return (
    <div className="fixed pointer-events-none inset-0 overflow-hidden z-0">
      <span className="floating-icon lg absolute top-[8%] left-[6%] float-anim">🥑</span>
      <span className="floating-icon sm absolute top-[18%] right-[10%] float-anim-2">🍅</span>
      <span className="floating-icon absolute bottom-[28%] left-[12%] float-anim-3">🌶️</span>
      <span className="floating-icon lg absolute top-[62%] right-[8%] float-anim">🥕</span>
      <span className="floating-icon sm absolute bottom-[12%] right-[18%] float-anim-2">🍋</span>
      <span className="floating-icon absolute top-[40%] left-[3%] float-anim-2">🧅</span>
      <span className="floating-icon sm absolute top-[75%] left-[25%] float-anim-3">🍊</span>
    </div>
  );
}
