import React from 'react';

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Nút đóng */}
      <button 
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
        onClick={onClose}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Nội dung ảnh */}
      <img 
        src={imageUrl} 
        alt="Phóng to" 
        className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi bấm vào chính cái ảnh
      />
    </div>
  );
};

export default ImageModal; 