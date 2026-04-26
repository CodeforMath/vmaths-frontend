import React from 'react';

const ExamProgress = ({ 
  total, 
  current, 
  answers, 
  onJump, 
  timer, 
  isSubmitted, 
  questions, 
  isMiniMode = false // Thêm prop để điều khiển chế độ hiển thị gọn
}) => {
  
  const answeredCount = Object.keys(answers).length;
  const progress = total > 0 ? (answeredCount / total) * 100 : 0;

  // Logic xác định màu sắc (Giữ nguyên logic của bác)
  const getStatusColor = (index) => {
    if (isSubmitted) {
      const isCorrect = JSON.stringify(answers[index]) === JSON.stringify(questions[index]?.correctAnswer);
      return isCorrect 
        ? 'bg-emerald-500 text-white border-emerald-600' 
        : 'bg-rose-500 text-white border-rose-600';
    }
    if (current === index) return 'bg-slate-900 text-white scale-105 z-10 border-slate-700';
    if (answers[index]) return 'bg-[#3FB8AF] text-white border-[#339a92]';
    return 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100';
  };

  return (
    <div className={`
      transition-all duration-500
      ${isMiniMode 
        ? 'p-3 lg:p-4 rounded-[1.5rem]' // Gọn hơn khi thả trôi
        : 'p-5 lg:p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 mb-8'
      } 
      bg-white/90 backdrop-blur-md z-50
    `}>
      
      {/* PHẦN ĐẦU: THỜI GIAN & TIẾN ĐỘ */}
      <div className={`flex justify-between items-center ${!isMiniMode ? 'mb-6' : ''}`}>
        
        {/* Nhóm Thời gian */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
            ⏳
          </div>
          <div>
            <span className="block font-black text-lg lg:text-xl text-slate-800 leading-none tracking-tight">
              {timer}
            </span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {isSubmitted ? 'Kết quả' : 'Thời gian'}
            </p>
          </div>
        </div>

        {/* Nhóm Thanh Progress */}
        <div className="flex flex-col items-end gap-2 flex-1 max-w-[240px] ml-6">
          <div className="flex justify-between w-full px-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              Tiến độ bài làm
            </span>
            <span className="text-[10px] font-black text-[#3FB8AF]">
              {answeredCount}/{total}
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-[2px] border border-slate-50 shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isSubmitted ? 'bg-orange-500' : 'bg-[#3FB8AF]'}`}
              style={{ width: `${progress}%` }}
            >
              {/* Hiệu ứng ánh sáng chạy qua thanh progress */}
              <div className="w-full h-full animate-pulse bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN DƯỚI: BẢNG LƯỚI CÂU HỎI (Ẩn nếu là isMiniMode) */}
      {!isMiniMode && (
        <>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 mt-6">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => onJump(i)}
                className={`
                  relative h-10 w-full rounded-xl font-black text-[11px] transition-all duration-200
                  flex items-center justify-center border-b-4 active:translate-y-1 active:border-b-0
                  ${getStatusColor(i)}
                  ${current === i ? 'ring-2 ring-[#3FB8AF] ring-offset-2' : ''}
                `}
              >
                {i + 1}
                {isSubmitted && current === i && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-slate-900 animate-ping"></span>
                )}
              </button>
            ))}
          </div>

          {/* Chú thích màu sắc */}
          {isSubmitted && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4 justify-center">
              <LegendItem color="bg-emerald-500" label="Đúng" />
              <LegendItem color="bg-rose-500" label="Sai" />
              <LegendItem color="bg-slate-900" label="Đang xem" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Component phụ cho phần chú thích cho gọn code
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
    <div className={`w-3 h-3 ${color} rounded-sm shadow-sm`}></div>
    {label}
  </div>
);

export default ExamProgress;