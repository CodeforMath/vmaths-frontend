import React from 'react';
import { ASSETS_URL } from '../../api/config';
/**
 * smart-text.jsx - Bản cập nhật hỗ trợ Callback Click để phóng to
 */
const SmartText = ({ text, className = "", onImageClick }) => {
  
  if (!text || typeof text !== 'string') return null;

  const processContent = (rawText) => {
    return rawText.replace(/\[([^\s\]]+\.(?:svg|png|jpg|jpeg|webp))\]/gi, (match, fileName) => {
      const cleanFileName = fileName.toLowerCase(); 
      const fullUrl = `${ASSETS_URL}${cleanFileName}`;

      return `
        <span class="flex justify-center w-full my-2 clear-both">
          <img 
            src="${fullUrl}" 
            data-url="${fullUrl}" 
            alt="${cleanFileName}"
            class="smart-img cursor-zoom-in transition-all duration-300
                  /* SỬA TẠI ĐÂY: Trên mobile lấy 80%, trên PC khống chế khoảng 350px-400px */
                  w-[85%] md:w-auto md:max-w-[380px] h-auto 
                  bg-white p-2 md:p-3 rounded-2xl border border-slate-100 shadow-sm
                  hover:scale-[1.03] hover:shadow-xl hover:border-[#3FB8AF]/20"
            onerror="this.style.opacity='0.3';"
          />
        </span>
      `;
    });
  };

  const handleContentClick = (e) => {
    // Nếu click đúng vào thẻ img có class smart-img thì mới gọi callback
    if (e.target.classList.contains('smart-img') && onImageClick) {
      const imageUrl = e.target.getAttribute('data-url');
      onImageClick(imageUrl);
    }
  };

  return (
    <span 
      className={`smart-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processContent(text) }}
      onClick={handleContentClick} // Bắt sự kiện click tại đây
    />
  );
};

export default SmartText;