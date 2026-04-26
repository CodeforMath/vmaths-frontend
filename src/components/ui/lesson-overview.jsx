import React from 'react';
import SmartText from './smart-text'; 

const LessonOverview = ({ data, onImageClick }) => {
  // Kiểm tra an toàn nếu data không tồn tại
  if (!data || (!data.keyTerms && !data.skills)) return null;

  const { keyTerms = [], skills = [] } = data;

  return (
    <div className="my-10 w-full group">
      <div className="bg-white border-2 border-blue-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-blue-200">
        
        {/* CONTAINER CHA: Thêm items-stretch để các cột con luôn cao bằng nhau */}
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          
          {/* CỘT TRÁI: THUẬT NGỮ */}
          <div className="flex-none md:w-[35%] lg:w-[32%] flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-8 bg-[#ef4444] rounded-full"></div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#ef4444] whitespace-nowrap">
                Thuật ngữ
              </h2>
            </div>
            
            {/* bg-slate-50 giúp nhìn rõ độ cao hai bên bằng nhau */}
            <div className="flex-1 bg-slate-50/50 p-5 rounded-3xl border border-slate-100/50">
              <ul className="space-y-4">
                {keyTerms.map((term, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-700 font-normal text-[15px]">
                    <span className="mt-2 w-1.5 h-1 bg-[#ef4444]/40 rounded-full flex-shrink-0"></span>
                    <SmartText 
                      text={term} 
                      className="leading-tight" 
                      onImageClick={onImageClick} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* VIỀN CHIA ĐÔI (CHỈ HIỆN TRÊN DESKTOP) */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent self-stretch my-2"></div>
          
          {/* VIỀN CHIA ĐÔI (CHỈ HIỆN TRÊN MOBILE) */}
          <div className="block md:hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full my-2"></div>

          {/* CỘT PHẢI: KIẾN THỨC, KĨ NĂNG */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-8 bg-[#0ea5e9] rounded-full"></div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-[#0ea5e9]">
                Kiến thức, kĩ năng
              </h2>
            </div>

            <div className="flex-1">
              <ul className="grid grid-cols-1 gap-5">
                {skills.map((skill, index) => (
                  <li key={index} className="group/item flex items-start gap-4 text-slate-600 text-[16px] leading-relaxed">
                    <div className="mt-2 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                      <div className="w-1.5 h-1 bg-[#0ea5e9] rounded-full"></div>
                    </div>
                    <SmartText 
                      text={skill} 
                      className="flex-1 font-normal" 
                      onImageClick={onImageClick} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonOverview;