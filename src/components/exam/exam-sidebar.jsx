import React from 'react';

const ExamSidebar = ({ 
  questions = [], 
  userAnswers = {}, 
  currentIdx, 
  onJumpToQuestion, 
  timeLeft, 
  onFinish, 
  isSubmitted = false 
}) => {

  const formatTime = (time) => {
    if (!time || time === "Tự do") return "∞";
    if (typeof time === 'string' && time.includes(':')) return time;
    const t = parseInt(time);
    if (isNaN(t)) return "00:00";
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    /* THAY ĐỔI Ở ĐÂY:
       - top-[80px]: Đẩy xuống thấp hơn nữa (khoảng 80px) để chắc chắn thoát khỏi Header.
       - h-[calc(100vh-100px)]: Thu ngắn chiều cao tổng để không bị lẹm mép dưới.
       - z-0: Đảm bảo nằm dưới Header (thường Header là z-10 hoặc z-50).
    */
    <div className="flex flex-col h-[calc(100vh-140px)] sticky top-[100px] bg-slate-50 p-5 border-l border-slate-200 rounded-3xl overflow-hidden z-0">
      
      {/* KHỐI THÔNG TIN CHUNG */}
      <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 shrink-0">
        <div className="flex justify-between items-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ bài làm</p>
           <span className="text-[11px] font-black text-[#3FB8AF] bg-[#3FB8AF]/10 px-2 py-0.5 rounded-md">
             {answeredCount}/{questions.length} câu
           </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian còn lại</p>
           <span className={`text-sm font-mono font-black tabular-nums ${isSubmitted ? 'text-slate-300' : 'text-[#3FB8AF]'}`}>
             {formatTime(timeLeft)}
           </span>
        </div>
      </div>

      {/* GRID SỐ CÂU HỎI */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar mb-4">
        <div className="grid grid-cols-4 gap-2">
          {questions.map((_, i) => {
            const isDone = userAnswers[i] !== undefined;
            const isCurrent = currentIdx === i;
            return (
              <button
                key={i}
                onClick={() => onJumpToQuestion(i)}
                className={`h-11 rounded-xl font-bold text-xs transition-all border-2 relative
                  ${isCurrent ? 'border-[#3FB8AF] bg-white text-[#3FB8AF] scale-110 shadow-md z-10' : 
                    isDone ? 'bg-[#3FB8AF] border-[#3FB8AF] text-white shadow-sm' : 
                    'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
              >
                {i + 1}
                {!isSubmitted && !isDone && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* NÚT NỘP BÀI */}
      <div className="mt-auto pt-4 shrink-0">
        {!isSubmitted ? (
          <button 
            onClick={() => { if (window.confirm("Bác có chắc muốn nộp bài?")) onFinish(); }}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#3FB8AF] active:scale-95 transition-all shadow-lg"
          >
            NỘP BÀI THI
          </button>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Đã nộp bài thành công</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSidebar;