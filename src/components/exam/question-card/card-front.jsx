import React, { useMemo } from 'react';
import SmartText from '../../ui/smart-text';
import AnswerInput from '../question-type/answer-input';
import TrueFalseInput from '../question-type/true-false-input';
import QuestionBadge from './question-badge';

const CardFront = ({ question, index, userAnswer, onAnswerChange, isSubmitted, onFlip, onImageClick }) => {
  const isTrueFalse = question?.type === 'true-false' || question?.type === 'true_false';

  // --- LOGIC TỰ CHẤM ĐIỂM TẠI CHỖ ---
  const isCorrect = useMemo(() => {
    if (!isSubmitted || !userAnswer || !question?.correctAnswer) return false;

    const dbAns = question.correctAnswer;
    const type = question.type;

    // 1. Xử lý câu Đúng/Sai
    if (type === 'true_false' || type === 'true-false') {
      let normalizedDb = dbAns;
      // Nếu lỡ là chuỗi "[true,false...]" thì biến thành mảng
      if (typeof dbAns === 'string') {
        normalizedDb = dbAns.replace(/[\[\]\s]/g, '').split(',').map(v => v.toLowerCase() === 'true');
      }
      
      if (Array.isArray(userAnswer) && Array.isArray(normalizedDb)) {
        return userAnswer.every((val, idx) => val === normalizedDb[idx]);
      }
      return false;
    }

    // 2. Xử lý Trắc nghiệm (A, B, C, D)
    if (type === 'multiple_choice') {
      return Number(userAnswer) === Number(dbAns);
    }

    // 3. Xử lý điền khuyết / các loại khác
    return String(userAnswer).trim().toLowerCase() === String(dbAns).trim().toLowerCase();
  }, [isSubmitted, userAnswer, question]);

  // Khóa nội dung câu hỏi
  const questionContent = useMemo(() => (
    <div className="text-slate-800 text-base md:text-lg mb-8 font-medium leading-relaxed px-1">
      <SmartText text={question?.content || ""} onImageClick={onImageClick}/>
    </div>
  ), [question?._id, onImageClick]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col h-full w-full" 
         style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'relative', zIndex: 2 }}>
      
      {/* Giờ isCorrect đã có giá trị thực sự */}
      <QuestionBadge index={index} isSubmitted={isSubmitted} isCorrect={isCorrect} level={question?.level} />

      {questionContent}

      <div className="flex-1 w-full">
        {isTrueFalse ? (
          <TrueFalseInput options={question.options} value={userAnswer} onChange={onAnswerChange} disabled={isSubmitted} onImageClick={onImageClick}/>
        ) : (
          <AnswerInput type={question.type} options={question.options} value={userAnswer} onChange={onAnswerChange} disabled={isSubmitted} onImageClick={onImageClick} />
        )}
      </div>

      {isSubmitted && (
        <button onClick={onFlip} className="w-full mt-8 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#3FB8AF] transition-all">
          Xem lời giải chi tiết 💡
        </button>
      )}
    </div>
  );
};

export default CardFront;