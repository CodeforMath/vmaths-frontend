import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { MathJaxContext } from 'better-react-mathjax';

// Auth Context & Hooks
import { AuthProvider } from './context/auth-context';
import useAuth from './hooks/use-auth';
import ProtectedRoute from './components/auth/protected-route';

// Layout & Home
import Hero from './components/home/hero';
import Navbar from './components/layout/navbar'; 
import MainLayout from './components/layout/main-layout';
import LessonDetail from './pages/lesson/lesson-detail';


// Auth Pages
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Profile from './pages/user/profile';

// Admin
import LessonEditor from './components/admin/lesson/lesson-editor'; 
import QuestionEditor from './components/admin/question/question-editor';

//User Pages
import DocumentPage from './pages/user/document-page';

//Constants
import { VMATHS_DATA } from './constants/vmaths-data';

/**
 * Component AppContent: Nơi chứa logic chính của ứng dụng
 * Tách ra để dùng được hook useNavigate() từ react-router-dom
 */
function AppContent() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy thông tin đăng nhập

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mathJaxConfig = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
      processEscapes: true
    }
  };

  /**
   * Xử lý khi nhấn vào các khối lớp trên Navbar (Toán 12, Toán 11...)
   */
  const handleCategorySelect = (sectionId) => {
    // 1. Nếu sectionId là null (nhấn nút Home hoặc Logo)
    if (!sectionId) {
      setSelectedCategory(null);
      setCurrentCategory(null);
      setIsSidebarOpen(false);
      navigate('/');
      return;
    }

    // 2. Lấy dữ liệu khối lớp
    const data = VMATHS_DATA[sectionId];
    if (data) {
      setSelectedCategory({ 
        ...data, 
        id: sectionId,
        parentType: data.type 
      });
      setCurrentCategory(sectionId);
      setIsSidebarOpen(true);
      
      // 3. FIX LỖI: Luôn chuyển về trang chủ để hiển thị MainLayout kèm Sidebar
      navigate('/'); 
    }
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="flex flex-col h-screen overflow-hidden bg-white">
        
        {/* THANH NAVBAR CỐ ĐỊNH */}
        <header className="shrink-0 z-[10001]">
          <Navbar 
            onSelectCategory={handleCategorySelect} 
            currentSectionId={currentCategory}
            onOpenSidebar={() => setIsSidebarOpen(true)} 
            showLessonButton={!!selectedCategory}
          />
        </header>
        
        {/* VÙNG NỘI DUNG CHÍNH - CÓ THÊM PT-20 ĐỂ DỊCH XUỐNG DƯỚI NAVBAR */}
        <main className="flex-1 relative overflow-y-auto bg-slate-50">
          <Routes>
            {/* Trang công khai */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* TRANG HỒ SƠ CÁ NHÂN (Mới thêm) */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={<DocumentPage />} />

            {/* Trang bảo vệ cho Admin */}
            <Route path="/admin/lesson" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LessonEditor />
              </ProtectedRoute>
            } />
            <Route path="/admin/question" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <QuestionEditor />
              </ProtectedRoute>
            } />

            {/* Trang bài học (Yêu cầu đăng nhập) */}
            <Route path="/lesson/:lessonSlug" element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            } />

            {/* Trang chủ: Điều hướng giữa Hero và Dashboard bài học */}
            <Route path="/" element={
              !selectedCategory ? (
                <div className="h-full">
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
  );
}

/**
 * Component App: Điểm khởi đầu của ứng dụng
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;