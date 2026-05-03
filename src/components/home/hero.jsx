import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative pt-20 w-full min-h-full flex items-center justify-center bg-[#020617] overflow-hidden">
      
      {/* 1. Hiệu ứng Background: Các đốm sáng mờ tạo chiều sâu */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse delay-700"></div>

      {/* 2. Math Decor: Các ký hiệu toán học ẩn dưới nền */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute top-20 left-[15%] text-7xl font-serif rotate-12">∫</div>
        <div className="absolute top-40 right-[20%] text-5xl font-sans -rotate-12">∑</div>
        <div className="absolute bottom-20 left-[20%] text-4xl font-serif">π</div>
        <div className="absolute bottom-40 right-[10%] text-6xl font-sans rotate-45">√</div>
      </div>

      {/* 3. Main Content */}
      <div className="relative z-10 text-center px-6">
        

        {/* Tên thương hiệu */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-white">
          VMaths<span className="text-blue-500">.</span>net
        </h1>

        {/* Slogan */}
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Nền tảng học Toán <span className="text-white">chuyên sâu</span>, 
          nơi tư duy logic được đánh thức qua từng bài giảng trực quan.
        </p>

        {/* Nút bấm hành động */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Link 
              to="/lessons" 
            >
              Bắt đầu lộ trình
            </Link>
          </button>
          <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-xl font-bold text-lg transition-all border border-slate-700 backdrop-blur-sm">
            <Link 
              to="/documents" 
            >
              Tài liệu miễn phí
            </Link>
          </button>
        </div>

        {/* Thông điệp phụ */}
        <p className="mt-12 text-slate-500 font-mono text-sm tracking-widest uppercase">
          VMaths - Do It Together
        </p>
      </div>

      {/* 4. Bottom Fade: Để hòa hợp với phần bên dưới trang web */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent"></div>
    </section>
  );
};

export default Hero;