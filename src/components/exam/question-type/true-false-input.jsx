// src/components/exam/true-false-input.jsx
import React from 'react';

const TrueFalseInput = ({ options, value = [null, null, null, null], onChange, disabled }) => {
  const handleSelect = (index, status) => {
    const newValue = [...value];
    newValue[index] = status;
    onChange(newValue);
  };

  return (
    <div className="space-y-3 mt-4">
      {options.map((opt, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2 mb-1">
            <span className="text-[11px] font-black text-[#3FB8AF] uppercase tracking-wider">Ý {String.fromCharCode(97 + i)})</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                disabled={disabled}
                onClick={() => handleSelect(i, true)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${value[i] === true ? 'bg-green-500 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
              > ĐÚNG </button>
              <button
                disabled={disabled}
                onClick={() => handleSelect(i, false)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${value[i] === false ? 'bg-red-500 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}
              > SAI </button>
            </div>
          </div>
          <div className="text-sm font-medium text-slate-700 leading-relaxed px-1">
             {opt}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrueFalseInput;