import React, { useMemo, memo, useCallback, useEffect } from 'react';
import SmartText from '../../ui/smart-text';

// --- COMPONENT CON: NỘI DUNG TOÁN ---
const StaticMathContent = memo(({ content }) => (
  <div className="font-bold text-[15px] text-left leading-relaxed flex-1 px-1 break-words">
    <SmartText text={content} />
  </div>
));

// --- COMPONENT CON: NÚT TRẮC NGHIỆM ---
const AnswerButton = memo(({ opt, i, isSelected, disabled, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onClick(i)}
    className={`
      flex items-center gap-2 p-2.5 rounded-2xl transition-all w-full min-h-[50px] border shadow-sm
      border-slate-100 bg-white hover:border-[#3FB8AF]/20 text-slate-700
      ${isSelected ? 'border-[#3FB8AF] bg-[#3FB8AF]/5 text-[#3FB8AF] shadow-md scale-[1.01]' : ''} 
      ${disabled && !isSelected ? 'opacity-60' : 'active:scale-[0.98]'} group
    `}
  >
    <span className={`
      flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all 
      ${isSelected ? 'border-[#3FB8AF] bg-[#3FB8AF] text-white shadow-sm' : 'border-slate-200 bg-slate-50 text-slate-400 group-hover:border-[#3FB8AF]/30'}
    `}>
      {String.fromCharCode(65 + i)}
    </span>
    <StaticMathContent content={opt} />
  </button>
));

// --- COMPONENT CON: ĐÚNG SAI ---
const TrueFalseInput = memo(({ options, value = [null, null, null, null], onChange, disabled }) => {
  const handleToggle = (idx, status) => {
    const newValue = [...(value || [null, null, null, null])];
    newValue[idx] = status;
    onChange(newValue);
  };

  return (
    <div className="space-y-3 mt-4 w-full animate-in fade-in duration-500">
      {options.map((opt, i) => (
        <div key={`tf-${i}`} className="flex flex-col gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-1">
            <span className="text-[11px] font-black text-[#3FB8AF] uppercase tracking-wider pl-1">
              Ý {String.fromCharCode(97 + i)})
            </span>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button" disabled={disabled} onClick={() => handleToggle(i, true)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${value?.[i] === true ? 'bg-[#10B981] text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
              > ĐÚNG </button>
              <button
                type="button" disabled={disabled} onClick={() => handleToggle(i, false)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${value?.[i] === false ? 'bg-[#EF4444] text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
              > SAI </button>
            </div>
          </div>
          <StaticMathContent content={opt} />
        </div>
      ))}
    </div>
  );
});

// --- COMPONENT CHÍNH ---
const AnswerInput = ({ type, options, value, onChange, disabled, questionId }) => {
  
  // Kích hoạt MathJax mỗi khi thay đổi câu hỏi
  useEffect(() => {
    const triggerMath = () => {
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch((err) => console.log(err));
      }
    };
    triggerMath();
    const timer = setTimeout(triggerMath, 300);
    return () => clearTimeout(timer);
  }, [options, questionId, type]);

  const handleSelect = useCallback((idx) => {
    if (!disabled) onChange(idx);
  }, [disabled, onChange]);

  const gridLayoutClass = useMemo(() => {
    if (!options || options.length === 0) return "grid-cols-1";
    const lengths = options.map(opt => String(opt).length);
    const maxLength = Math.max(...lengths);
    const hasComplexMath = options.some(opt => /\\frac|\\sqrt|\\int|\\sum/.test(String(opt)));
    if (maxLength <= 20 && !hasComplexMath) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (maxLength <= 40 && !hasComplexMath) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1";
  }, [options]);

  const renderContent = () => {
    // 1. TRẮC NGHIỆM
    if (type === 'multiple_choice' || type === 'multiple-choice') {
      return (
        <div className={`grid ${gridLayoutClass} gap-2.5 mt-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500`}>
          {options.map((opt, i) => (
            <AnswerButton 
              key={`mc-${questionId}-${i}`} 
              opt={opt} i={i} isSelected={value === i}
              disabled={disabled} onClick={handleSelect}
            />
          ))}
        </div>
      );
    }

    // 2. ĐÚNG SAI
    if (type === 'true_false' || type === 'true-false') {
      return (
        <TrueFalseInput 
          key={`tf-group-${questionId}`}
          options={options} value={value} 
          onChange={onChange} disabled={disabled} 
        />
      );
    }

    // 3. ĐIỀN ĐÁP ÁN (Dạng ngắn)
    if (type === 'short_answer' || type === 'short-answer') {
      return (
        <div className="mt-6 p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 w-full animate-in zoom-in-95 duration-500">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Đáp án của bác</div>
          <input
            type="text" disabled={disabled} value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl text-center font-black text-2xl text-[#3FB8AF] outline-none shadow-sm focus:border-[#3FB8AF] transition-all"
            placeholder="???"
          />
        </div>
      );
    }

    // 4. TỰ LUẬN (Essay)
    if (type === 'essay') {
      return (
        <div className="mt-6 w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trình bày lời giải</span>
              <span className="text-[10px] font-bold text-[#3FB8AF] bg-[#3FB8AF]/10 px-2 py-0.5 rounded-full">Tự luận</span>
            </div>
            <textarea
              disabled={disabled}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-5 min-h-[200px] text-slate-700 leading-relaxed outline-none resize-none focus:bg-slate-50/30 transition-all"
              placeholder="Nhập lời giải chi tiết tại đây..."
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return <div className="w-full mb-8">{renderContent()}</div>;
};

export default memo(AnswerInput);