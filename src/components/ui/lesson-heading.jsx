import React from 'react';
import SmartText from './smart-text';

export const LessonHeader = ({ number, title, onImageClick }) => (
  <div className="mb-10 w-full flex flex-row items-stretch shadow-lg rounded-[2rem] overflow-hidden uppercase bg-[#FF9F1C] group">
    
    {/* Khối bên trái: Số bài */}
    <div 
      className="relative bg-[#3FB8AF] text-white flex flex-row sm:flex-col justify-center items-center px-4 py-2 sm:px-6 sm:py-6 min-w-[90px] sm:min-w-[160px] gap-2 sm:gap-1 z-10 shrink-0 transition-transform duration-500 group-hover:scale-[1.02]"
      style={{
        clipPath: 'polygon(0% 0%, calc(100% - 25px) 0%, 100% 50%, calc(100% - 25px) 100%, 0% 100%)',
        marginRight: '-25px'
      }}
    >
      <span className="text-[10px] sm:text-lg font-black opacity-80 leading-none">Bài</span>
      <span className="text-2xl sm:text-6xl font-[1000] leading-none block drop-shadow-md">
        {number}
      </span>
    </div>

    {/* Khối bên phải: Tiêu đề bài học */}
    <div className="flex-1 flex items-center justify-center py-2 px-6 sm:py-6 sm:pl-12 sm:pr-8">
      <h1 className="text-[14px] sm:text-2xl lg:text-3xl font-[1000] tracking-tighter text-center text-white drop-shadow-md leading-tight">
        {/* Đã thêm onImageClick cho tiêu đề chính */}
        <SmartText text={title} onImageClick={onImageClick} />
      </h1>
    </div>
  </div>
);

export const SectionHeading = ({ level, children, onImageClick }) => {
  // Level 1: Mục lớn (I, II, III...)
  if (level === 1) {
    return (
      <h2 className="text-xl md:text-2xl font-[1000] text-slate-800 mt-12 mb-8 flex items-center gap-4 group">
        <div className="relative">
          <div className="w-2 h-8 md:w-2.5 md:h-10 bg-[#3FB8AF] rounded-full shrink-0 group-hover:scale-y-110 transition-transform duration-300" />
          <div className="absolute top-0 left-0 w-2 h-8 md:w-2.5 md:h-10 bg-[#3FB8AF] rounded-full animate-ping opacity-20" />
        </div>
        <span className="uppercase tracking-tighter">
          {/* Đã thêm onImageClick cho mục lớn */}
          <SmartText text={children} onImageClick={onImageClick} />
        </span>
      </h2>
    );
  }

  // Level 2 trở đi: Mục nhỏ (1, 2, a, b...)
  return (
    <h3 className="text-lg md:text-xl font-black text-[#FF9F1C] mt-10 mb-5 flex items-center gap-3 group/sub">
      {/* Khối thanh đứng màu cam có hiệu ứng nhấp nháy */}
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Thanh chính */}
        <div className="w-1.5 h-6 bg-[#FF9F1C] rounded-full z-10 group-hover/sub:scale-y-110 transition-transform duration-300" />
        
        {/* Thanh nhấp nháy (Ping) */}
        <div className="absolute w-1.5 h-6 bg-[#FF9F1C] rounded-full animate-ping opacity-30" />
      </div>
      
      <span className="tracking-tight">
        <SmartText text={children} onImageClick={onImageClick} />
      </span>
    </h3>
  );
};