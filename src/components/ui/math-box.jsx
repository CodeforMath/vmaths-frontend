import React, { useState } from 'react';
import { 
  BookOpen, Lightbulb, Star, PencilLine, 
  AlertCircle, Info, GraduationCap, ChevronDown 
} from 'lucide-react';
// CHỈ import MathJax (component), KHÔNG dùng Hook
import { MathJax } from 'better-react-mathjax'; 
import SmartText from './smart-text'; 

const config = {
  definition: { label: 'Định nghĩa', color: 'border-blue-500 bg-blue-50/50', icon: BookOpen, iconColor: 'text-blue-600', subLabel: 'Chứng minh' },
  theorem: { label: 'Định lý', color: 'border-purple-500 bg-purple-50/50', icon: GraduationCap, iconColor: 'text-purple-600', subLabel: 'Chứng minh' },
  proposition: { label: 'Mệnh đề', color: 'border-indigo-500 bg-indigo-50/50', icon: Star, iconColor: 'text-indigo-600', subLabel: 'Chứng minh' },
  example: { label: 'Ví dụ', color: 'border-green-500 bg-green-50/50', icon: Lightbulb, iconColor: 'text-green-600', subLabel: 'Lời giải chi tiết' },
  exercise: { label: 'Bài tập', color: 'border-orange-500 bg-orange-50/50', icon: PencilLine, iconColor: 'text-orange-600', subLabel: 'Lời giải chi tiết' },
  introduction: { label: 'Giới thiệu', color: 'border-slate-400 bg-slate-50', icon: Info, iconColor: 'text-slate-500' },
  note: { label: 'Chú ý', color: 'border-amber-500 bg-amber-50/50', icon: AlertCircle, iconColor: 'text-amber-600' },
  remember: { label: 'Ghi nhớ', color: 'border-red-500 bg-red-50/50', icon: Star, iconColor: 'text-red-600' },
};

const MathBox = ({ data, onImageClick }) => {
  const [showSolution, setShowSolution] = useState(false);
  const settings = config[data.style] || config.introduction;
  const Icon = settings.icon;

  const mainContent = data.content || data.body;
  const extraContent = data.extraContent || data.solution || data.proof;

  return (
    <div className={`my-6 border-l-4 rounded-r-3xl shadow-sm overflow-hidden transition-all ${settings.color}`}>
      <div className="flex items-center gap-2 px-6 py-3 border-b border-black/5 font-bold uppercase text-[13px] tracking-widest">
        <Icon size={16} className={settings.iconColor} />
        <span className={settings.iconColor}>
          <SmartText text={data.title || settings.label} onImageClick={onImageClick} />
        </span>
      </div>

      <div className="text-normal p-6 text-slate-800 leading-relaxed">
        {/* Bọc MathJax quanh nội dung chính */}
        <MathJax dynamic>
          <SmartText text={mainContent} className="block" onImageClick={onImageClick} />
        </MathJax>
      </div>

      {extraContent && (
        <div className="border-t border-black/5 bg-white/30">
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className="w-full flex items-center justify-between px-6 py-3 text-xs font-black uppercase text-slate-500 hover:bg-black/5 transition-all"
          >
            <span>{showSolution ? 'Đóng' : 'Xem'} {settings.subLabel || 'nội dung'}</span>
            <ChevronDown size={14} className={`transition-transform duration-500 ${showSolution ? 'rotate-180' : ''}`} />
          </button>
          
          {showSolution && (
            <div className="p-6 bg-white/60 border-t border-slate-100">
               <div className="flex gap-2 mb-2">
                  <span className="text-[10px] font-black text-[#3FB8AF] border border-[#3FB8AF] px-2 py-0.5 rounded-full uppercase">
                    {settings.subLabel}
                  </span>
               </div>
               {/* MẤU CHỐT: Bọc MathJax dynamic ở đây để nó tự quét khi mở toggle */}
               <MathJax dynamic>
                  <SmartText text={extraContent} className="italic text-slate-700" onImageClick={onImageClick} />
               </MathJax>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MathBox;