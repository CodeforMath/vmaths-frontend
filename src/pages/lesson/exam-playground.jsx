import React from 'react';
import ExamResult from '../../components/exam/exam-result';
import QuestionCard from '../../components/exam/question-card/question-card';

const ExamPlayground = ({ 
  examStatus, 
  questions, 
  currentIdx, 
  userAnswers, 
  scoreProps,
  correctCount,
  onAnswerChange, 
  onJump, 
  score, 
  onRetry, 
  onBackToLesson,
  onImageClick
}) => {
  
  // Kiểm tra an toàn
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
    if (!q) return null;

    return (
      <div className="max-w-3xl mx-auto relative pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Mỏ neo để cuộn lên khi bấm Tiếp/Trước */}
        <div id="top-playground" />

        <QuestionCard 
          question={q} 
          index={currentIdx}
          userAnswer={userAnswers[currentIdx]}
          onAnswerChange={(ans) => onAnswerChange(currentIdx, ans)}
          onImageClick={onImageClick}
        />

        <div className="mt-10 flex justify-between items-center bg-white p-2 rounded-3xl border border-slate-100 shadow-sm w-full">
          <button 
            disabled={currentIdx === 0}
            onClick={() => {
              onJump(currentIdx - 1);
              document.getElementById('top-playground')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs disabled:opacity-10 uppercase shadow-lg active:scale-95 transition-all hover:bg-[#3FB8AF]"
          >
            ← Trước
          </button>
          
          <button 
            disabled={currentIdx === questions.length - 1}
            onClick={() => {
              onJump(currentIdx + 1);
              document.getElementById('top-playground')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase shadow-lg active:scale-95 transition-all hover:bg-[#3FB8AF]"
          >
            Tiếp →
          </button>
        </div>
      </div>
    );
  }

  if (examStatus === 'finished') {
    // Định nghĩa lại các giá trị để hiển thị chuẩn
    const totalQuestionsCount = questions?.length || 0;
    const correctCountVal = correctCount || 0; // Số câu đúng (số nguyên)
    const maxScoreVal = scoreProps || totalQuestionsCount; // Tổng điểm tối đa

    return (
      <div className="max-w-3xl mx-auto pb-32 animate-in fade-in duration-1000">
        <div id="top-result" />

        <ExamResult 
          score={score}                         // Điểm đạt được (ví dụ: 0.5)
          totalScore={maxScoreVal}              // Tổng điểm tối đa (ví dụ: 4.75)
          correctCount={correctCountVal}        // Số câu đúng thực tế (ví dụ: 1)
          totalQuestions={totalQuestionsCount}  // Tổng số câu hỏi (ví dụ: 7)
          onRetry={onRetry} 
        />
        
        <div className="my-16 flex items-center gap-4 px-4">
          <div className="h-[1px] flex-1 bg-slate-200"></div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            Xem lại bài làm
          </h3>
          <div className="h-[1px] flex-1 bg-slate-200"></div>
        </div>

        <div className="space-y-12">
          {questions.map((q, i) => {
            if (!q) return null;
            return (
              <QuestionCard 
                key={q._id || i} 
                index={i}
                question={q} 
                userAnswer={userAnswers[i]} 
                isSubmitted={true} 
                onImageClick={onImageClick}
              />
            );
          })}
        </div>

        {/* Các nút điều hướng cuối trang */}
        <div className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => {
              // Ép cuộn về mỏ neo top-result
              const anchor = document.getElementById('top-result');
              if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#3FB8AF] hover:shadow-[#3FB8AF]/20 hover:-translate-y-1 transition-all duration-300 group active:scale-95"
          >
            <span className="inline-block mr-2 group-hover:-translate-y-1 transition-transform">↑</span>
            Lên đầu trang
          </button>
          
          <button 
            onClick={onBackToLesson} 
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#3FB8AF] hover:shadow-[#3FB8AF]/20 hover:-translate-y-1 transition-all duration-300 group active:scale-95"
          >
            <span className="inline-block mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Trở về bài học
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamPlayground;