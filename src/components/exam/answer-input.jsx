import React, { useMemo, memo, useCallback } from 'react';
import SmartText from '../ui/smart-text';

// Component này chỉ chứa nội dung Toán, tuyệt đối không render lại nếu opt không đổi
const StaticMathContent = memo(({ content }) => (
  <div className="font-bold text-sm text-left leading-tight flex-1">
    <SmartText text={content} />
  </div>
));

const AnswerButton = memo(({ opt, i, isSelected, disabled, onClick }) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(i)}
      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all min-h-[60px] w-full shadow-sm ${
        isSelected 
        ? 'border-[#3FB8AF] bg-[#3FB8AF]/10 text-[#3FB8AF]' 
        : 'border-slate-100 bg-white hover:border-slate-200 text-slate-600'
      } ${disabled && !isSelected ? 'opacity-50' : 'active:scale-[0.98]'}`}
    >
      <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-colors ${
        isSelected ? 'border-[#3FB8AF] bg-[#3FB8AF] text-white' : 'border-slate-200 bg-slate-50'
      }`}>
        {String.fromCharCode(65 + i)}
      </span>

      {/* Nội dung Toán được bao bọc bởi memo riêng biệt để chống giật */}
      <StaticMathContent content={opt} />
    </button>
  );
});

const AnswerInput = ({ type, options, value, onChange, disabled }) => {
  const handleSelect = useCallback((idx) => {
    if (!disabled) onChange(idx);
  }, [disabled, onChange]);

  const gridLayoutClass = useMemo(() => {
    if (!options || options.length === 0) return "grid-cols-1";
    const maxLength = Math.max(...options.map(opt => String(opt).replace(/[\\$}{_^]/g, '').length));
    if (maxLength <= 8) return "grid-cols-2 md:grid-cols-4"; // 1 hàng
    if (maxLength <= 20) return "grid-cols-2"; // 2 hàng 2 cột
    return "grid-cols-1"; // 4 hàng dọc
  }, [options]);

  if (type === 'multiple_choice') {
    return (
      <div className={`grid ${gridLayoutClass} gap-3 mt-4 w-full grid-answer-area`}>
        {options.map((opt, i) => (
          <AnswerButton 
            key={`${i}-${opt}`} 
            opt={opt}
            i={i}
            isSelected={value === i}
            disabled={disabled}
            onClick={handleSelect}
          />
        ))}
      </div>
    );
  }

  if (type === 'short_answer') {
    return (
      <div className="mt-4 p-5 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 w-full">
        <input
          type="text"
          disabled={disabled}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl text-center font-black text-2xl text-[#3FB8AF] outline-none shadow-sm"
          placeholder="Đáp số..."
        />
      </div>
    );
  }
  return null;
};

export default AnswerInput;