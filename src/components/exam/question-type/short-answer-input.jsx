import React from 'react';

const ShortAnswerInput = ({ value, onChange, disabled }) => (
  <div className="mt-6 p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 w-full animate-in zoom-in-95">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Nhập đáp án của bác</div>
    <input
      type="text"
      disabled={disabled}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-5 bg-white border-2 border-slate-100 rounded-2xl text-center font-black text-2xl text-[#3FB8AF] outline-none shadow-sm focus:border-[#3FB8AF] transition-all"
      placeholder="???"
    />
  </div>
);

export default ShortAnswerInput;