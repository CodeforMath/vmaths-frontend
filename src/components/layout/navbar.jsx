import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Menu, X, BookOpen } from 'lucide-react';
import { VMATHS_DATA } from '../../constants/vmaths-data';

export default function Navbar({ onSelectCategory, onOpenSidebar, showLessonButton }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Hàm xử lý khi chọn khối lớp
  const handleSelect = (sectionId) => {
    onSelectCategory(sectionId); // Truyền trực tiếp ID khối lớp (toan-12, luyen-thi-thpt...)
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-[10001] shadow-sm">
      {/* TẦNG 1: LOGO & ACTIONS */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          {/* NÚT BÀI HỌC TRÊN MOBILE */}
          {showLessonButton && (
            <button 
              onClick={onOpenSidebar}
              className="md:hidden p-2 text-[#22c55e] bg-green-50 rounded-xl active:scale-90 transition-transform"
            >
              <BookOpen size={22} strokeWidth={2.5} />
            </button>
          )}

          <Link to="/" className="text-2xl font-black text-[#22c55e] tracking-tighter">
            VMaths
          </Link>
        </div>
        
        {/* THANH TÌM KIẾM DESKTOP */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input 
            type="text" 
            placeholder="Tìm bài giảng, bài tập..." 
            className="w-full bg-gray-100 border-none rounded-full py-2 px-5 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
          />
          <Search className="absolute right-4 top-2.5 text-gray-400 w-4 h-4" />
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-black text-white px-5 py-1.5 rounded-full font-bold text-sm hidden md:block hover:bg-[#22c55e] transition-colors">
            Đăng nhập
          </button>
          <button 
            className="md:hidden text-black p-1 active:scale-90 transition-transform"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* TẦNG 2: DESKTOP MENU - CLICK PHÁT ĂN NGAY */}
      <nav className="hidden md:block bg-black text-white">
        <div className="max-w-9xl mx-auto flex px-2 items-center">
          
          {/* NÚT HOME */}
          <Link 
            to="/" 
            className={`relative flex items-center justify-center px-6 py-4 transition-all duration-300 active:scale-90 ${
              isHome ? 'text-green-500' : 'text-slate-400 hover:text-green-500'
            }`}
          >
            <Home size={18} strokeWidth={isHome ? 2.5 : 2} />
            {isHome && (
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#22c55e] rounded-t-full"></span>
            )}
          </Link>

          {/* RENDER CÁC KHỐI LỚP 10, 11, 12, LUYỆN THI */}
          {Object.keys(VMATHS_DATA).map((sectionId) => {
            const section = VMATHS_DATA[sectionId];
            return (
              <button 
                key={sectionId}
                onClick={() => handleSelect(sectionId)}
                className="relative px-6 py-4 text-[11px] font-bold uppercase text-slate-300 hover:text-green-500 transition-colors group"
              >
                {section.label}
                {/* Thanh gạch chân khi hover cho đẹp */}
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-1/2"></span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#0a0a0a] text-white animate-in slide-in-from-top duration-300 shadow-2xl">
          <div className="flex flex-col py-2">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-5 font-bold uppercase text-xs ${isHome ? 'text-[#22c55e] bg-white/5' : 'text-slate-300'}`}
            >
              <Home size={18} /> TRANG CHỦ
            </Link>

            {Object.keys(VMATHS_DATA).map((sectionId) => (
              <button 
                key={sectionId}
                onClick={() => handleSelect(sectionId)}
                className="w-full text-left px-6 py-5 text-xs font-bold uppercase text-slate-200 hover:bg-white/5 hover:text-[#22c55e] border-t border-white/5"
              >
                {VMATHS_DATA[sectionId].label}
              </button>
            ))}
            
            <div className="p-6">
              <button className="w-full bg-[#22c55e] py-4 rounded-xl font-bold text-sm text-black uppercase">
                ĐĂNG NHẬP
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}