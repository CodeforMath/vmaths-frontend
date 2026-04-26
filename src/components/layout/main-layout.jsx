import React, { useState, useEffect } from 'react';
import Sidebar from '../lesson/sidebar';
import LessonDetail from '../../pages/lesson/lesson-detail';
import ExamSidebar from '../exam/exam-sidebar'; 

export default function MainLayout({ selectedCategory, isSidebarOpen, setIsSidebarOpen }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [lessonNumber, setLessonNumber] = useState(1);
  const [examDataFromChild, setExamDataFromChild] = useState(null);

  const isExamView = examDataFromChild?.isExamMode === true;

  useEffect(() => {
    setActiveLesson(null);
    setIsSidebarOpen(false);
    setExamDataFromChild(null);
  }, [selectedCategory, setIsSidebarOpen]);

  const handleSelectLesson = (lesson, number) => {
    setActiveLesson({ ...lesson, slug: lesson.slug });
    setLessonNumber(number || 1); 
    setIsSidebarOpen(false); 
    setExamDataFromChild(null); 
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden bg-white relative font-sans">
      
      {/* 1. OVERLAY Mobile */}
      <div 
        className={`fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* 2. SIDEBAR TRÁI */}
      {!isExamView && (
        <aside className={`fixed top-[112px] bottom-0 left-0 z-[9999] w-[300px] transform transition-transform duration-500 bg-[#f8fafc] border-r border-slate-200 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:top-0 md:translate-x-0 md:block md:shrink-0 md:h-full`}>
          <Sidebar selectedData={selectedCategory} onSelectLesson={handleSelectLesson} activeLessonId={activeLesson?.slug} onClose={() => setIsSidebarOpen(false)} />
        </aside>
      )}

      {/* 3. NỘI DUNG CHÍNH (Đã xóa các thanh tiến trình thừa) */}
      <main className={`flex-1 overflow-y-auto custom-scrollbar ${isExamView ? 'bg-slate-50' : 'bg-white'}`}>
        {activeLesson ? (
          <LessonDetail 
            key={activeLesson.slug} 
            lessonSlug={activeLesson.slug} 
            lessonNumber={lessonNumber}
            onExamDataUpdate={setExamDataFromChild} // Nhận data (bao gồm cả timeLeft) từ đây
          />
        ) : (
          <WelcomeView label={selectedCategory?.label} />
        )}
      </main>

      {/* 4. SIDEBAR PHẢI (Desktop & Mobile Drawer) */}
      {isExamView && examDataFromChild && (
        <>
          <aside className="hidden xl:block w-[320px] h-full border-l border-slate-200 bg-white overflow-y-auto">
            <ExamSidebar {...examDataFromChild} />
          </aside>

          <aside className={`fixed top-0 bottom-0 right-0 z-[120] w-[280px] bg-white shadow-2xl transition-transform duration-300 md:hidden ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="h-full overflow-y-auto p-4">
               <div className="flex justify-between items-center mb-6">
                  <span className="font-black text-xs text-slate-400 uppercase">Bảng câu hỏi</span>
                  <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 bg-slate-100 rounded-full">✕</button>
               </div>
               <ExamSidebar {...examDataFromChild} />
            </div>
          </aside>
        </>
      )}
      
      {/* 5. NÚT FLOATING (Duy nhất cho Mobile) */}
      {isExamView && (
        <button 
          className={`fixed bottom-6 right-6 z-[130] w-16 h-16 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center xl:hidden transition-all ${isSidebarOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <div className="flex flex-col items-center">
            {/* Hiển thị thời gian từ timeLeft */}
            <span className="text-[14px] font-black font-mono text-[#22c55e]">
              {examDataFromChild?.timeLeft || "00:00"}
            </span>
            <span className="text-[9px] font-bold text-slate-400">
              {Object.keys(examDataFromChild?.userAnswers || {}).length}/{examDataFromChild?.questions?.length || 0}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

function WelcomeView({ label, isExamMode }) {
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    const slogans = [
      "Hôm nay là cơ hội tuyệt vời để khám phá thêm một định lý mới.",
      "VMaths – Nơi nuôi dưỡng và chắp cánh đam mê toán học cho thế hệ trẻ.",
      "Mỗi bài toán được giải là một niềm vui nhỏ, góp phần làm giàu tâm hồn.",
      "Kiên trì từng bước, thành công trong toán học sẽ tự tìm đến bạn.",
      "Toán học là ngôn ngữ của vũ trụ – hãy cùng nhau khám phá và giải mã.",
      "Toán không khó – chỉ là bạn chưa tìm đúng cách thôi 😉",
      "Học toán hôm nay, flex tư duy ngày mai.",
      "Giải toán chill chill, điểm cao vẫn về đều đều.",
      "Giải được bài này, tự tin tăng level liền 🚀"
    ];
    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    setSlogan(randomSlogan);
  }, []);

  if (isExamMode) return null;

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-1000">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#22c55e] to-emerald-400 rounded-[2rem] flex items-center justify-center text-4xl shadow-lg rotate-3">📚</div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FF9F1C] rounded-full flex items-center justify-center text-white border-4 border-white shadow-md">✨</div>
      </div>
      
      <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight max-w-md">
        Chào mừng bạn quay lại với <span className="text-[#22c55e]">{label || "VMaths"}</span>
      </h2>
      
      <p className="mt-4 text-slate-400 font-medium text-sm max-w-xs">
        Chọn một bài giảng bên danh mục để bắt đầu buổi học nhé!
      </p>

      <div className="mt-10 px-8 py-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-[1.5rem] font-bold italic text-sm shadow-sm relative">
        <span className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black uppercase tracking-widest border border-emerald-100 rounded-md">Lời chúc</span>
        "{slogan}"
      </div>
    </div>
  );
}