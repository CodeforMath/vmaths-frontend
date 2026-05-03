import React from 'react';

const BadgeCard = ({ badges = [] }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Huy hiệu đạt được</h3>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg">
          {badges.length} cái
        </span>
      </div>
      
      {badges.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center text-2xl mb-2 group-hover:rotate-12 transition-all shadow-inner border border-white">
                🏅
              </div>
              <span className="text-[9px] font-bold text-slate-600 text-center leading-tight truncate w-full px-1">
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border-2 border-dashed border-slate-50 rounded-2xl">
          <p className="text-xs italic text-slate-400">Chưa có huy hiệu nào. Hãy chăm chỉ học tập nhé!</p>
        </div>
      )}
    </div>
  );
};

export default BadgeCard;