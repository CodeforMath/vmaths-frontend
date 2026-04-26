import React from 'react';
import ExamProgress from '../../../components/exam/exam-progress';
import ExamResult from '../../../components/exam/exam-result';
import QuestionCard from '../../../components/exam/question-card/question-card';

const ExamPlayground = ({ 
  examStatus, 
  questions, 
  currentIdx, 
  userAnswers, 
  onAnswerChange, 
  onJump, 
  score, 
  onRetry, 
  onBackToLesson 
}) => {
  
  // Kiểm tra an toàn: Nếu không có câu hỏi thì không hiện gì cả
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
          Chưa có dữ liệu câu hỏi bác ơi...
        </p>
      </div>
    );
  }

  // --- CHẾ ĐỘ 1: ĐANG LÀM BÀI ---
  if (examStatus === 'doing') {
    const q = questions[currentIdx];
    
    // Phòng hờ trường hợp index bị nhảy ngoài mảng
    if (!q) return null;

    return (
      <div className="max-w-3xl mx-auto relative pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Thanh tiến trình làm bài */}
        <div className="sticky top-4 z-[40] mb-6">
          
        </div>

        {/* Thẻ câu hỏi hiện tại */}
        <QuestionCard 
          question={q} 
          index={currentIdx}
          userAnswer={userAnswers[currentIdx]}
          onAnswerChange={(ans) => onAnswerChange(currentIdx, ans)}
        />

        {/* Nút điều hướng Trước/Sau */}
        <div className="mt-10 flex justify-between items-center bg-white p-2 rounded-3xl border border-slate-100 shadow-sm w-full">
          <button 
            disabled={currentIdx === 0}
            onClick={() => {
              onJump(currentIdx - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            //className="px-6 py-4 font-black text-xs text-slate-400 disabled:opacity-10 uppercase tracking-widest transition-all"
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs disabled:opacity-10 uppercase shadow-lg active:scale-95 transition-all hover:bg-slate-800"
          >
            ← Trước
          </button>
          
          <button 
            disabled={currentIdx === questions.length - 1}
            onClick={() => {
              onJump(currentIdx + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-lg active:scale-95 transition-all hover:bg-slate-800"
          >
            Tiếp →
          </button>
        </div>
      </div>
    );
  }

  // --- CHẾ ĐỘ 2: ĐÃ NỘP BÀI (Hiện kết quả và toàn bộ đáp án) ---
  if (examStatus === 'finished') {
    return (
      <div className="max-w-3xl mx-auto pb-32 animate-in fade-in duration-1000">
        {/* Bảng tổng kết điểm số */}
        <ExamResult 
          score={score} 
          total={questions.length} 
          onRetry={onRetry} 
        />
        
        {/* Đường kẻ phân cách */}
        <div className="my-16 flex items-center gap-4 px-4">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Xem lại bài làm
          </h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        {/* Danh sách tất cả các câu hỏi đã làm */}
        <div className="space-y-12">
          {questions.map((q, i) => {
            if (!q) return null;
            return (
              <QuestionCard 
                key={q._id || i} 
                index={i}
                question={q} 
                userAnswer={userAnswers[i]} 
                isSubmitted={true} // Kích hoạt mặt sau (giải thích)
              />
            );
          })}
        </div>

        {/* Các nút điều hướng cuối trang */}
        <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs hover:bg-slate-50 transition-all"
          >
            ↑ Lên đầu trang
          </button>
          
          <button 
            onClick={onBackToLesson} 
            className="w-full sm:w-auto px-10 py-5 bg-[#3FB8AF] text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:scale-105 transition-all"
          >
            ← Trở về bài học
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamPlayground;