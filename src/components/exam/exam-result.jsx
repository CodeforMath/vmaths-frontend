import React from 'react';

const ExamResult = ({ 
  score = 0, 
  totalScore = 0, 
  correctCount = 0, 
  totalQuestions = 0, 
  onRetry 
}) => {
  // 1. Tính phần trăm (Đảm bảo không bao giờ chia cho 0)
  const scorePercentage = totalScore > 0 ? Math.round((score / totalScore) * 100) : 0;
  
  // 2. Kỹ thuật vòng tròn: r=85 thì chu vi chuẩn là 534
  // Cháu ép kiểu Number để tránh lỗi cộng chuỗi khiến vòng tròn không hiện màu
  const strokeDasharray = 534;
  const offset = strokeDasharray - (strokeDasharray * (scorePercentage > 100 ? 100 : scorePercentage)) / 100;

  const getFeedback = () => {
    if (scorePercentage >= 80) return { emoji: "👑", text: "Tuyệt đỉnh! Bác dạy đỉnh thật, học sinh làm đúng sạch sành sanh!", color: "text-yellow-500" };
    if (scorePercentage >= 50) return { emoji: "📚", text: "Khá ổn! Cần xem lại các câu sai để nhớ lâu hơn nhé.", color: "text-blue-500" };
    return { emoji: "💪", text: "Cố gắng lên! Đọc lại bài giảng và thử sức lần nữa xem sao.", color: "text-orange-500" };
  };

  const feedback = getFeedback();

  return (
    <div className="relative max-w-2xl mx-auto p-10 lg:p-14 bg-white rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.08)] border border-slate-50 text-center overflow-hidden">
      {/* Hiệu ứng nền của bác */}
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

        {/* VÒNG TRÒN ĐIỂM SỐ - Cháu đã cố định vị trí center chuẩn */}
        <div className="relative inline-flex items-center justify-center mb-10">
          <svg className="w-48 h-48 transform -rotate-90 scale-110">
            <circle
              cx="96"
              cy="96"
              r="85"
              stroke="#f1f5f9"
              strokeWidth="14"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="85"
              stroke="#3FB8AF"
              strokeWidth="14"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Cụm số ở giữa - Dùng absolute center chuẩn xác */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-baseline justify-center translate-y-1">
               <span className="text-6xl font-black text-slate-800 leading-none">{score}</span>
               <span className="text-2xl font-black text-slate-300 ml-1">/{totalScore}</span>
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3">Tổng điểm đạt được</span>
          </div>
        </div>

        {/* CÁC CHỈ SỐ THỐNG KÊ - Thêm flex để căn giữa tuyệt đối */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner flex flex-col items-center justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Số câu đúng</p>
            <div className="flex justify-center items-baseline gap-1">
                <p className="text-3xl font-black text-slate-700 leading-none">{correctCount}</p>
                <p className="text-xs font-bold text-slate-400">/ {totalQuestions} câu</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner flex flex-col items-center justify-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hiệu suất</p>
            <p className={`text-3xl font-black leading-none ${scorePercentage >= 50 ? 'text-[#3FB8AF]' : 'text-rose-500'}`}>
                {scorePercentage}%
            </p>
          </div>
        </div>

        {/* NÚT BẤM - Giữ nguyên của bác */}
        <div className="flex flex-col gap-3">
          <button 
            onClick={onRetry} 
            className="group w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-[#3FB8AF] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            <span>LÀM LẠI BÀI TẬP</span>
            <span className="text-xl group-hover:rotate-180 transition-transform duration-500">🔄</span>
          </button>
          
          <div className="mt-4 flex flex-col items-center gap-1">
            <div className="h-1 w-8 bg-slate-100 rounded-full"></div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
              Cuộn xuống để xem lời giải chi tiết
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResult;