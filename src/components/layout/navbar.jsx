import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Menu, X, BookOpen, User, LogOut, ChevronDown } from 'lucide-react';
import { VMATHS_DATA } from '../../constants/vmaths-data';
import useAuth from '../../hooks/use-auth';
import StreakDisplay from '../user/streak-display'; 

export default function Navbar({ onSelectCategory, onOpenSidebar, showLessonButton, currentSectionId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isHomeActive = location.pathname === "/" && !currentSectionId;
  const isProfileActive = location.pathname === "/profile";

  const handleSelect = (sectionId) => {
    onSelectCategory(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const results = [];
    Object.keys(VMATHS_DATA).forEach(sectionId => {
      const section = VMATHS_DATA[sectionId];
      section.chapters.forEach((chapter, cIdx) => {
        chapter.lessons.forEach(lesson => {
          if (lesson.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              ...lesson,
              sectionId: sectionId, 
              chapterId: chapter.id || cIdx,
              chapterTitle: chapter.title,
              sectionLabel: section.label
            });
          }
        });
      });
    });
    return results.slice(0, 5);
  }, [searchTerm]);

  return (
    <header className="fixed top-0 left-0 w-full bg-white z-[10001] shadow-sm font-sans">
      {/* TẦNG 1: LOGO & ACTIONS */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50 relative z-[10003] bg-white">
        <div className="flex items-center gap-3">
          {showLessonButton && (
            <button 
              onClick={onOpenSidebar}
              className="md:hidden p-2 text-[#22c55e] bg-green-50 rounded-xl active:scale-90 transition-transform"
            >
              <BookOpen size={22} strokeWidth={2.5} />
            </button>
          )}

          <Link to="/" onClick={() => onSelectCategory(null)} className="text-2xl font-black text-[#22c55e] tracking-tighter hover:opacity-80 transition-opacity">
            VMaths
          </Link>
        </div>
        
        {/* THANH TÌM KIẾM DESKTOP */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <div className="w-full relative">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm bài giảng, bài tập..." 
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-2.5 px-6 pr-12 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-sm font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors">
              <Search size={18} strokeWidth={2.5} />
            </div>
          </div>

          {/* Bảng kết quả Dropdown Desktop */}
          <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 py-4 opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 translate-y-2 group-focus-within:translate-y-0 z-[10002]">
            {searchTerm.trim() !== '' ? (
              <div className="px-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Kết quả tìm kiếm</h4>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((item, index) => (
                      <button 
                        key={index}
                        onClick={() => {
                          onSelectCategory(item.sectionId);
                          setTimeout(() => {
                            if (window.forceOpenLesson) window.forceOpenLesson(item);
                          }, 100);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-green-50 text-left transition-colors group/item"
                      >
                        <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-[10px] font-black">
                          {item.sectionLabel.split(' ')[1]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate group-hover/item:text-green-600">{item.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{item.chapterTitle}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400 italic">Không tìm thấy bài học nào phù hợp...</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="px-4 mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Tìm kiếm phổ biến</h4>
                  <div className="flex flex-wrap gap-2 px-2">
                    {['Đạo hàm', 'Oxyz', 'Tích phân', 'Lượng giác'].map((tag) => (
                      <span 
                        key={tag} 
                        onClick={() => setSearchTerm(tag)}
                        className="text-[11px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-green-100 hover:text-green-600 cursor-pointer transition-all"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* NÚT SEARCH MOBILE */}
          <button 
            onClick={() => {
                setIsMobileSearchOpen(!isMobileSearchOpen);
                setIsMobileMenuOpen(false);
            }}
            className={`md:hidden p-2 rounded-xl transition-colors ${isMobileSearchOpen ? 'bg-green-500 text-white' : 'text-slate-600 bg-slate-50'}`}
          >
            {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== 'admin' && (
                <div className="hidden sm:block">
                  <StreakDisplay streak={user.streak} />
                </div>
              )}
              <div className="relative">
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full transition-all border shadow-sm ${
                    isUserDropdownOpen || isProfileActive ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'
                  }`}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#22c55e] to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-bold hidden md:block max-w-[100px] truncate text-slate-700">{user.username}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isUserDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsUserDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] text-[#22c55e] font-black uppercase tracking-widest">
                            {user?.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                          </p>
                          
                          {/* Chỉ hiện Streak nếu KHÔNG PHẢI là admin */}
                          {user?.role !== 'admin' && (
                            <span className="text-[10px] font-bold text-orange-500">
                              🔥 {user.streak} ngày
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsUserDropdownOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isProfileActive ? 'text-[#22c55e] bg-green-50 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
                        <User size={16} strokeWidth={isProfileActive ? 2.5 : 2} /> Hồ sơ của tôi
                      </Link>
                      {user && user.role === 'admin' && (
                        <>
                          <div className="px-4 py-2">
                            <p className="text-[10px] text-purple-500 font-black uppercase tracking-widest mb-2">Quản lý hệ thống</p>
                            <div className="space-y-1">
                              <Link 
                                to="/admin/lesson" 
                                onClick={() => setIsUserDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all"
                              >
                                <BookOpen size={14} /> Quản lý bài học
                              </Link>
                              <Link 
                                to="/admin/question" 
                                onClick={() => setIsUserDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all"
                              >
                                <Search size={14} /> Quản lý câu hỏi
                              </Link>
                            </div>
                          </div>
                          <div className="h-px bg-slate-50 my-1 mx-2"></div>
                        </>
                      )}
                      
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-[#22c55e] transition-all active:scale-95">
              Đăng nhập
            </Link>
          )}

          <button 
            className="md:hidden text-black p-1 active:scale-90 transition-transform"
            onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileSearchOpen(false);
            }}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* SEARCH MOBILE OVERLAY (HIỆN KHI BẤM KÍNH LÚP MOBILE) */}
      <div className={`
        fixed inset-x-0 top-[60px] bg-white border-b border-slate-100 shadow-2xl z-[10002] p-4 
        md:hidden transition-all duration-300 transform
        ${isMobileSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
      `}>
        <div className="relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm bài giảng..." 
            className="w-full bg-slate-50 border-2 border-green-500/20 rounded-xl py-3 px-4 pr-12 outline-none focus:border-green-500 text-sm font-bold"
            autoFocus={isMobileSearchOpen}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={18} />
        </div>

        {searchTerm.trim() !== '' && (
          <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2 pb-4">
            {searchResults.length > 0 ? (
                searchResults.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => {
                        onSelectCategory(item.sectionId);
                        setTimeout(() => {
                          if (window.forceOpenLesson) window.forceOpenLesson(item);
                        }, 150);
                        setSearchTerm('');
                        setIsMobileSearchOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl active:bg-green-50 border border-slate-100"
                    >
                      <div className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0">
                        {item.sectionLabel.split(' ')[1]}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-sm font-bold text-slate-700 truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.chapterTitle}</p>
                      </div>
                    </button>
                  ))
            ) : (
                <p className="text-center py-4 text-xs text-slate-400 italic">Không có kết quả...</p>
            )}
          </div>
        )}
      </div>

      {/* TẦNG 2: DESKTOP MENU */}
      <nav className="hidden md:block bg-black text-white">
        <div className="max-w-9xl mx-auto flex px-2 items-center">
          <Link to="/" onClick={() => onSelectCategory(null)} className={`relative flex items-center justify-center px-6 py-4 transition-all duration-300 active:scale-90 ${isHomeActive ? 'text-[#22c55e]' : 'text-slate-400 hover:text-[#22c55e]'}`}>
            <Home size={18} strokeWidth={isHomeActive ? 2.5 : 2} />
            {isHomeActive && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#22c55e] rounded-t-full"></span>}
          </Link>
          {Object.keys(VMATHS_DATA).map((sectionId) => {
            const section = VMATHS_DATA[sectionId];
            const isActive = currentSectionId === sectionId;
            return (
              <button key={sectionId} onClick={() => handleSelect(sectionId)} className={`relative px-6 py-4 text-[11px] font-bold uppercase transition-all duration-300 group ${isActive ? 'text-[#22c55e]' : 'text-slate-300 hover:text-[#22c55e]'}`}>
                {section.label}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-[#22c55e] rounded-t-full transition-all duration-300 ${isActive ? 'w-1/2 opacity-100' : 'w-0 opacity-0 group-hover:w-1/3 group-hover:opacity-50'}`}></span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-[#0a0a0a] text-white animate-in slide-in-from-top duration-300 shadow-2xl h-screen overflow-y-auto z-[10001]">
          <div className="flex flex-col pb-24">
            {user && (
              <div className="px-6 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[10px] text-[#22c55e] font-black uppercase tracking-widest">
                      {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                    </p>
                    {/* Nếu là học viên thì mới hiện Streak, Admin thì có thể ẩn đi cho gọn */}
                    {user.role === 'student' && (
                      <span className="bg-orange-500/20 text-orange-400 text-[9px] font-black px-2 py-0.5 rounded-full">
                        🔥 {user.streak} NGÀY
                      </span>
                    )}
                  </div>
                  <p className="text-xl font-bold">{user.username}</p>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-center gap-2 mt-2 text-[11px] font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-lg border border-green-500/20">
                    <User size={12} /> XEM HỒ SƠ
                  </Link>
                </div>
                {user.avatar && <img src={user.avatar} className="w-14 h-14 rounded-2xl border-2 border-white/10 object-cover" alt="mobile-avt" />}
              </div>
            )}
            <Link to="/" onClick={() => { setIsMobileMenuOpen(false); onSelectCategory(null); }} className={`flex items-center gap-3 px-6 py-5 font-bold uppercase text-xs ${isHomeActive ? 'text-[#22c55e] bg-white/5' : 'text-slate-300'}`}>
              <Home size={18} /> TRANG CHỦ
            </Link>
            <div className="px-6 py-2">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Chương trình học</p>
            </div>
            {Object.keys(VMATHS_DATA).map((sectionId) => {
              const isActive = currentSectionId === sectionId;
              return (
                <button key={sectionId} onClick={() => handleSelect(sectionId)} className={`w-full text-left px-6 py-5 text-xs font-bold uppercase border-t border-white/5 transition-colors ${isActive ? 'text-[#22c55e] bg-white/5' : 'text-slate-200 hover:bg-white/5'}`}>
                  {VMATHS_DATA[sectionId].label}
                </button>
              );
            })}
            {user && (
              <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-5 text-xs font-bold uppercase text-red-400 border-t border-white/5 mt-4">
                <LogOut size={18} /> ĐĂNG XUẤT
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}