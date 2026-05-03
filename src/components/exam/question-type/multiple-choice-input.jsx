import React, { useMemo, memo } from 'react';
import SmartText from '../../ui/smart-text';

const StaticMathContent = memo(({ content }) => (
  <div className="font-bold text-[15px] text-left leading-relaxed flex-1 px-1 break-words">
    <SmartText text={content} />
  </div>
));

const MultipleChoiceInput = ({ options = [], value, onChange, disabled }) => {
  const gridLayoutClass = useMemo(() => {
    if (!options.length) return "grid-cols-1";
    const lengths = options.map(opt => String(opt).length);
    const maxLength = Math.max(...lengths);
    const hasComplexMath = options.some(opt => /\\frac|\\sqrt|\\int|\\sum|\\cup|\\cap/.test(String(opt)));

    if (maxLength <= 20 && !hasComplexMath) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (maxLength <= 40 && !hasComplexMath) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1";
  }, [options]);

  return (
    <div className={`grid ${gridLayoutClass} gap-2.5 md:gap-3 mt-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500`}>
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i)}
          className={`flex items-center gap-2 p-2.5 rounded-2xl transition-all w-full min-h-[50px] border shadow-sm
            ${value === i 
              ? 'border-[#3FB8AF] bg-[#3FB8AF]/5 text-[#3FB8AF] shadow-md scale-[1.01]' 
              : 'border-slate-100 bg-white hover:border-[#3FB8AF]/20 text-slate-700'}
            ${disabled && value !== i ? 'opacity-60' : 'active:scale-[0.98]'} group`}
        >
          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all 
            ${value === i ? 'border-[#3FB8AF] bg-[#3FB8AF] text-white' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
            {String.fromCharCode(65 + i)}
          </span>
          <StaticMathContent content={opt} />
        </button>
      ))}
    </div>
  );
};

export default memo(MultipleChoiceInput);