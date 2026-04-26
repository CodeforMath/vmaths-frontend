import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';

// Layout & Home
import Hero from './components/home/hero';
import Navbar from './components/layout/navbar'; 
import MainLayout from './components/layout/main-layout';
import LessonDetail from './pages/lesson/lesson-detail';

// Admin
import LessonEditor from './components/admin/lesson/lesson-editor'; 
import QuestionEditor from './components/admin/question/question-editor';

import { VMATHS_DATA } from './constants/vmaths-data';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mathJaxConfig = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
      processEscapes: true
    }
  };

  // CẬP NHẬT: Hàm xử lý mới cho cấu trúc dữ liệu phẳng
  const handleCategorySelect = (sectionId) => {
    // 1. Lấy dữ liệu khối lớp trực tiếp từ key (toan-12, toan-11,...)
    const data = VMATHS_DATA[sectionId];
    
    if (data) {
      // 2. Cập nhật state với cấu trúc mới (bao gồm mảng chapters)
      setSelectedCategory({ 
        ...data, 
        id: sectionId,
        parentType: data.type 
      });
      
      // 3. Tự động mở Sidebar để học sinh thấy bài học ngay
      setIsSidebarOpen(true);
    }
  };

  return (
    <BrowserRouter>
      <MathJaxContext config={mathJaxConfig}>
        <div className="flex flex-col h-screen overflow-hidden bg-white">
          <header className="shrink-0 z-[10001]">
            <Navbar 
              onSelectCategory={handleCategorySelect} 
              onOpenSidebar={() => setIsSidebarOpen(true)} 
              showLessonButton={!!selectedCategory}
            />
          </header>
          
          <main className="flex-1 relative overflow-hidden bg-slate-50">
            <Routes>
              <Route path="/admin/lesson" element={<LessonEditor />} />
              <Route path="/admin/question" element={<QuestionEditor />} />
              <Route path="/lesson/:lessonSlug" element={<LessonDetail />} />

              <Route path="/" element={
                !selectedCategory ? (
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    <Hero />
                  </div>
                ) : (
                  <MainLayout 
                    selectedCategory={selectedCategory} 
                    isSidebarOpen={isSidebarOpen} 
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                )
              } />
            </Routes>
          </main>
        </div>
      </MathJaxContext>
    </BrowserRouter>
  );
}

export default App;