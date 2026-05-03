import React from 'react';
import { MathJax } from 'better-react-mathjax'; 
import SmartText from '../../components/ui/smart-text';
import MathBox from '../../components/ui/math-box';
import { SectionHeading } from '../../components/ui/lesson-heading';
import { MediaRender } from '../../components/ui/media-render';
import LessonOverview from '../../components/ui/lesson-overview';

const LessonBody = ({ sections, onImageClick, lessonId }) => {
  return (
    /* - mt-20: Đẩy toàn bộ nội dung bài học xuống thấp hơn so với Header và tiêu đề.
       - space-y-16: Tạo khoảng cách rộng rãi giữa các khối kiến thức (heading, paragraph, mathbox).
    */
    <div className="mt-20">
      {sections && sections.map((block, index) => {
        const d = block.data || {};
        
        switch (block.type) {
          case 'overview':
          case 'lesson-overview':
            return <LessonOverview key={index} data={d} onImageClick={onImageClick} />;

          case 'heading':
            return (
              <div key={index} className="pt-6">
                <SectionHeading level={d.level} onImageClick={onImageClick}>
                  {d.content}
                </SectionHeading>
              </div>
            );

          case 'mathbox':
            return <MathBox key={index} data={d} onImageClick={onImageClick} />;

          case 'media':
            return (
              <div key={index} className="py-4">
                <MediaRender type={d.type || 'image'} url={d.url} caption={d.caption} />
              </div>
            );

          case 'paragraph':
          default:
            if (!d.content) return null;
            return (
              <div key={`${lessonId}-section-${index}`} className="px-2 group">
                {/* 
                  SỬA TẠI ĐÂY: Thêm thuộc tính dynamic cho MathJax 
                  để nó quét lại mỗi khi nội dung content thay đổi.
                */}
                <MathJax dynamic>
                  <SmartText 
                    text={d.content} 
                    onImageClick={onImageClick}
                    className="text-slate-700 leading-[2] text-base md:text-lg font-normal selection:bg-[#3FB8AF]/20" 
                  />
                </MathJax>
              </div>
            );
        }
      })}
    </div>
  );
};

export default LessonBody;