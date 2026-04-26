import React from 'react';

const ExamResult = ({ score, total, onRetry }) => {
  // Tính phần trăm chính xác
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // Hàm đưa ra lời nhận xét "có tâm" dựa trên điểm số
  const getFeedback = () => {
    if (percentage === 100) return { emoji: "👑", text: "Tuyệt đỉnh! Bác dạy đỉnh thật, học sinh làm đúng hết rồi!", color: "text-yellow-500" };
    if (percentage >= 80) return { emoji: "🌟", text: "Giỏi quá! Kiến thức nắm rất chắc chắn đấy.", color: "text-emerald-500" };
    if (percentage >= 50) return { emoji: "📚", text: "Khá ổn! Cần xem lại các câu sai để nhớ lâu hơn nhé.", color: "text-blue-500" };
    return { emoji: "💪", text: "Cố gắng lên! Đọc lại bài giảng và thử sức lần nữa xem sao.", color: "text-orange-500" };
  };

  const feedback = getFeedback();

  return (
    <div className="relative max-w-2xl mx-auto p-10 lg:p-14 bg-white rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.08)] border border-slate-50 text-center overflow-hidden">
      {/* Hiệu ứng trang trí nền */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#3FB8AF] via-orange-400 to-rose-500"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10">
        <div className="text-7xl mb-6 animate-bounce">{feedback.emoji}</div>
        
        <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight uppercase italic">
          Hoàn thành!
        </h2>
        
        <p className={`text-sm font-bold mb-8 px-4 ${feedback.color}`}>
          {feedback.text}
        </p>

        {/* Vòng tròn hiển thị điểm số */}
        <div className="relative inline-flex items-center justify-center mb-10">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={440}
              strokeDashoffset={440 - (440 * percentage) / 100}
              strokeLinecap="round"
              className="text-[#3FB8AF] transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black text-slate-800 leading-none">{score}</span>
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest mt-1">/{total} Câu</span>
          </div>
        </div>

        {/* Các chỉ số thống kê nhanh */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Độ chính xác</p>
            <p className="text-xl font-black text-slate-700">{percentage}%</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Đánh giá</p>
            <p className="text-xl font-black text-[#3FB8AF]">
              {percentage >= 80 ? 'Xịn' : percentage >= 50 ? 'Khá' : 'Cần cố'}
            </p>
          </div>
        </div>

        {/* Nút bấm thao tác */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={onRetry} 
            className="group w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg hover:bg-[#3FB8AF] transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3"
          >
            <span>LÀM LẠI BÀI TẬP</span>
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] mt-4">
            Cuộn xuống để xem lời giải chi tiết bên dưới
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;