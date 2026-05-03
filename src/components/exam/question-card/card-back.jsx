import React from 'react';
import SmartText from '../../ui/smart-text';

const CardBack = ({ correctAnswer, explanation, onFlipBack,onImageClick }) => {
  return (
    <div className="absolute inset-0 bg-[#3FB8AF] rounded-[2.5rem] p-6 md:p-8 shadow-xl text-white flex flex-col" 
         style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1 }}>
      
      <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
         <h3 className="font-black text-lg uppercase italic tracking-tighter">Lời giải chi tiết</h3>
         <button onClick={onFlipBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold hover:bg-white/30 transition-all">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-white/10 p-5 rounded-3xl mb-6 border border-white/20 backdrop-blur-sm">
            <p className="text-[9px] font-black uppercase opacity-70 mb-2 tracking-widest">Đáp án đúng</p>
            <div className="text-xl font-black">
               <SmartText text={Array.isArray(correctAnswer) ? correctAnswer.join(' - ') : String(correctAnswer)} onImageClick={onImageClick}/>
            </div>
        </div>
        
        <div className="text-white/90 text-sm md:text-base leading-relaxed font-medium mb-10">
          <SmartText text={explanation || "Nội dung lời giải đang được cập nhật."} onImageClick={onImageClick}/>
        </div>
      </div>

      {/* Nút quay lại ở cuối card */}
      <button 
        onClick={onFlipBack}
        className="mt-auto w-full py-5 bg-white text-[#3FB8AF] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all"
      >
        ← Quay lại mặt câu hỏi
      </button>
    </div>
  );
};

export default CardBack;