import React from 'react';

const QuestionBadge = ({ index, isSubmitted, isCorrect, level }) => {
  return (
    <div className="flex items-center justify-between mb-6 text-[10px] font-black uppercase">
      <div className="flex gap-2">
        <span className="text-xs px-4 py-1.5 bg-green-500 text-white rounded-full shadow-sm tracking-tighter">
          CÂU {index + 1}
        </span>
        {isSubmitted && (
          <span className={`px-4 py-1.5 rounded-full shadow-sm animate-in zoom-in ${
            isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
          }`}>
            {isCorrect ? 'ĐÚNG ✓' : 'SAI ✕'}
          </span>
        )}
      </div>
      <span className="text-slate-300 opacity-50 italic">{level || "Cơ bản"}</span>
    </div>
  );
};

export default QuestionBadge;