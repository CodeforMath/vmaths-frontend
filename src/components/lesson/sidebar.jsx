import React, { useState, useEffect } from 'react';
import { ChevronDown, BookOpen, PencilLine, ChevronLeft } from 'lucide-react';
import axios from 'axios';

export default function Sidebar({ selectedData, onSelectLesson, activeLessonId, onClose }) {
  const [openChapter, setOpenChapter] = useState(0);
  const [dbLessons, setDbLessons] = useState([]);

  // 1. Lấy dữ liệu từ Database mỗi khi đổi khối lớp (Toán 10, 11, 12...)
  useEffect(() => {
    const fetchDBLessons = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/lessons');
        // Lọc bài giảng theo label (VD: "Toán 12")
        const filtered = res.data.filter(l => l.grade === selectedData.label);
        setDbLessons(filtered);
      } catch (err) {
        console.error("Lỗi lấy bài giảng từ DB:", err);
      }
    };
    
    if (selectedData) {
      fetchDBLessons();
      setOpenChapter(0); // Reset mở chương đầu tiên khi đổi lớp
    }
  }, [selectedData]);

  // 2. Hàm trộn dữ liệu: Ưu tiên bài từ DB, bài nào trùng slug thì lấy từ DB
  const getCombinedLessons = (idx, staticLessons) => {
    // Nếu là chương 1 (hoặc bác muốn trộn ở tất cả chương thì bỏ điều kiện idx === 0)
    // Hiện tại em giữ logic cũ của bác: Ưu tiên trộn vào chương đầu tiên
    if (idx === 0) {
      const dbSlugs = dbLessons.map(l => l.slug);
      const filteredStatic = (staticLessons || []).filter(
        staticItem => !dbSlugs.includes(staticItem.slug)
      );
      return [...dbLessons, ...filteredStatic];
    }
    return staticLessons || [];
  };

  const getHeaderPrefix = (type) => {
    if (type === "school") return "LỚP";
    if (type === "subject") return "MÔN";
    if (type === "course") return "HỌC PHẦN";
    return "";
  };

  if (!selectedData) return null;

  return (
    <aside className="w-full md:w-80 bg-[#f8fafc] border-r border-slate-200 h-full flex flex-col font-sans z-[9999]">
      {/* TIÊU ĐỀ SIDEBAR */}
      <div className="p-5 bg-white border-b border-slate-100 shadow-sm shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black text-[#22c55e] tracking-[0.2em] mb-1">
              DANH MỤC BÀI HỌC
            </div>
            <h2 className="text-lg font-black text-slate-800 uppercase leading-tight">
              {/* Hiển thị trực tiếp "Toán 12", "Luyện thi THPT"... */}
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
            const isExpanded = openChapter === idx;
            
            // Trộn bài từ Database vào danh sách tĩnh
            const combinedLessons = getCombinedLessons(idx, chapter.lessons);

            return (
              <div key={chapter.id || idx} className="mb-3">
                <button
                  onClick={() => setOpenChapter(isExpanded ? null : idx)}
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

                {/* DANH SÁCH BÀI HỌC CON */}
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[2000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                  <div className="ml-5 border-l-2 border-slate-200/60 my-1">
                    {combinedLessons.map((lesson) => {
                      const isActive = activeLessonId === lesson.id || activeLessonId === lesson.slug;
                      
                      return (
                        <button
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