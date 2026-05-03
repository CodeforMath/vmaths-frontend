import React from 'react';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Nút đóng góc trên bên phải - To và rõ */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[10001] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div 
        className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center p-2"
        onClick={e => e.stopPropagation()} 
      >
        <img 
          src={imageUrl} 
          alt="Phóng to" 
          // SỬA TẠI ĐÂY: Thêm z-index trực tiếp cho img và bg-white để SVG nổi bật
          className="z-[10002] max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-white p-2 
                     animate-in zoom-in-95 duration-300"
          style={{ imageRendering: 'crisp-edges' }} // Giữ độ sắc nét cho SVG/Pixel art
        />
      </div>
    </div>
  );
};

export default ImageModal;