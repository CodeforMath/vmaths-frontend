import React from 'react';
import SmartText from './smart-text'; // Import để dùng cho Caption

export const MediaRender = ({ type, url, caption }) => {
  if (!url) return null;

  // 1. Chuẩn hóa URL thông minh
  const ASSETS_BASE = "http://localhost:5000/assets/";
  const fullUrl = url.startsWith('http') ? url : `${ASSETS_BASE}${url}`;

  // Giao diện cho Hình ảnh (SVG từ TikZ hoặc ảnh minh họa)
  if (type === 'tikz' || type === 'image') {
    return (
      <figure className="my-10 flex flex-col items-center group">
        <div className="relative overflow-hidden bg-white p-3 md:p-5 rounded-[2rem] shadow-sm border border-slate-100 transition-all duration-500 group-hover:shadow-2xl group-hover:border-[#3FB8AF]/20 group-hover:-translate-y-1">
          {/* Lớp nền mờ nhẹ tạo hiệu ứng chiều sâu */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white -z-10" />
          
          <object 
            data={fullUrl} 
            type="image/svg+xml"
            className="max-w-full h-auto min-w-[250px] block"
          >
            {/* Fallback: Nếu trình duyệt không load được object SVG thì dùng img */}
            <img 
              src={fullUrl} 
              alt={caption || "Hình vẽ VMaths"} 
              className="max-w-full h-auto"
              loading="lazy"
            />
          </object>
        </div>
        
        {/* Caption dùng SmartText để bác gõ được ký hiệu toán học như $y=f(x)$ */}
        {caption && (
          <figcaption className="mt-4 px-6 py-2 bg-slate-50 rounded-full text-sm text-slate-500 italic font-medium flex items-center gap-3 border border-slate-100">
            <span className="w-1.5 h-1.5 bg-[#3FB8AF] rounded-full animate-pulse"></span>
            <SmartText text={caption} />
          </figcaption>
        )}
      </figure>
    );
  }

  // Giao diện cho Video YouTube
  if (type === 'video') {
    const getYouTubeID = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeID(url);

    if (!videoId) return (
      <div className="my-8 p-4 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl text-red-500 text-xs font-bold text-center">
        ⚠️ Link video YouTube của bác không hợp lệ!
      </div>
    );

    return (
      <div className="my-10 group">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-slate-900 border-[6px] border-white ring-1 ring-slate-200 transition-all duration-500 group-hover:ring-[#3FB8AF]/50">
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
              title="VMaths Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        {caption && (
          <div className="mt-4 text-center">
            <SmartText text={caption} className="text-xs text-slate-400 font-bold uppercase tracking-widest" />
          </div>
        )}
      </div>
    );
  }

  return null;
};