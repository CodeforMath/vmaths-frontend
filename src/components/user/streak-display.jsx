import React from 'react';

const StreakDisplay = ({ streak = 0 }) => {
  return (
    <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm hover:scale-105 transition-transform cursor-default">
      <span className="text-lg">🔥</span>
      <div className="flex flex-col -space-y-1">
        <span className="font-black text-orange-600 text-sm leading-none">{streak}</span>
        <span className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter">Ngày</span>
      </div>
    </div>
  );
};

export default StreakDisplay;