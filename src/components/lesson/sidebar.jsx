import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, PencilLine, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';

export default function Sidebar({ selectedData, onSelectLesson, activeLessonId, onClose }) {
  // Fix 1: Luôn khởi tạo là mảng để không bị lỗi .includes()
  const [openChapters, setOpenChapters] = useState([0]);
  const [dbLessons, setDbLessons] = useState([]);

  // 1. Lấy dữ liệu từ Database mỗi khi đổi khối lớp
  useEffect(() => {
    const fetchDBLessons = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/lessons`);
        const filtered = res.data.filter(l => l.grade === selectedData.label);
        setDbLessons(filtered);
      } catch (err) {
        console.error("Lỗi lấy bài giảng từ DB:", err);
      }
    };
    
    if (selectedData) {
      fetchDBLessons();
      // Fix 2: Set lại mảng [0] thay vì số 0 để đồng nhất kiểu dữ liệu
      setOpenChapters([0]); 
    }
  }, [selectedData]);

  // Lắng nghe tín hiệu mở chương từ Search
  useEffect(() => {
    const handleOpenChapter = (e) => {
      const { chapterId } = e.detail;
      
      setOpenChapters(prev => {
        // Fix 3: Kiểm tra phòng hờ nếu prev không phải mảng
        const currentOpen = Array.isArray(prev) ? prev : [];
        if (currentOpen.includes(chapterId)) return currentOpen;
        return [...currentOpen, chapterId];
      });
    };

    window.addEventListener('SEARCH_OPEN_CHAPTER', handleOpenChapter);
    return () => window.removeEventListener('SEARCH_OPEN_CHAPTER', handleOpenChapter);
  }, []);

  // 2. Hàm trộn dữ liệu
  const getCombinedLessons = (idx, staticLessons) => {
    if (idx === 0) {
      const dbSlugs = dbLessons.map(l => l.slug);
      const filteredStatic = (staticLessons || []).filter(
        staticItem => !dbSlugs.includes(staticItem.slug)
      );
      return [...dbLessons, ...filteredStatic];
    }
    return staticLessons || [];
  };

  if (!selectedData) return null;

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-full md:w-80 bg-[#f8fafc] border-r border-slate-200 flex flex-col font-sans z-[9999]">
      {/* TIÊU ĐỀ SIDEBAR */}
      <div className="p-5 bg-white border-b border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-[#22c55e] tracking-[0.2em] mb-1">
              DANH MỤC BÀI HỌC
            </div>
            <h2 className="text-lg font-black text-slate-800 uppercase leading-tight">
              {selectedData.label}
            </h2>
          </div>

          <button 
            onClick={onClose}
            className="md:hidden p-2 text-slate-400 hover:text-[#22c55e] transition-colors bg-slate-50 rounded-xl border border-slate-100"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* DANH SÁCH CHƯƠNG */}
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        {selectedData.chapters && selectedData.chapters.length > 0 ? (
          selectedData.chapters.map((chapter, idx) => {
            // Fix 4: Dùng chapter.id hoặc index để so sánh trong mảng
            const chapterKey = chapter.id || idx;
            const isExpanded = openChapters.includes(chapterKey);
            
            const combinedLessons = getCombinedLessons(idx, chapter.lessons);

            return (
              <div key={chapterKey} className="mb-3">
                <button
                  onClick={() => {
                    // Logic đóng mở chương
                    setOpenChapters(prev => 
                      prev.includes(chapterKey) 
                        ? prev.filter(id => id !== chapterKey) 
                        : [...prev, chapterKey]
                    );
                  }}
                  className={`w-full flex items-start justify-between p-3.5 rounded-xl transition-all duration-300 ${
                    isExpanded 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'hover:bg-white text-slate-600 border border-transparent hover:border-slate-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen size={17} className={`shrink-0 mt-0.5 ${isExpanded ? 'text-[#22c55e]' : 'opacity-40'}`} />
                    <span className="text-[12px] font-bold uppercase tracking-tight text-left leading-snug">
                      {chapter.title}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`shrink-0 mt-0.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-5 border-l-2 border-slate-200/60 my-1">
                    {combinedLessons.map((lesson) => {
                      const isActive = activeLessonId === lesson.id || activeLessonId === lesson.slug;
                      
                      return (
                        <button
                          id={`lesson-${lesson.id}`}
                          key={lesson.slug || lesson.id}
                          onClick={() => onSelectLesson(lesson)}
                          className={`w-full flex items-center gap-3 pl-6 pr-4 py-3 text-[11px] font-semibold uppercase transition-all relative group text-left ${
                            isActive ? 'bg-green-50/50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div 
                            className={`absolute left-0 w-1 h-4 rounded-r-full transition-all ${
                              isActive ? 'bg-[#22c55e]' : 'bg-transparent group-hover:bg-slate-200'
                            }`} 
                          />
                          <PencilLine 
                            size={14} 
                            strokeWidth={isActive ? 2.5 : 2}
                            className={`shrink-0 transition-colors ${
                              isActive ? 'text-[#22c55e]' : 'text-slate-400 group-hover:text-slate-600'
                            }`} 
                          />
                          <span className={`leading-relaxed transition-colors ${
                            isActive ? 'text-[#22c55e] font-bold' : 'text-slate-500 group-hover:text-slate-800'
                          }`}>
                            {lesson.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 px-6">
            <div className="text-4xl mb-4 opacity-20 text-slate-400">📚</div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
              Đang cập nhật dữ liệu...
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}