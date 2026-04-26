import React, { useMemo } from 'react';
import SmartText from '../../ui/smart-text';
import AnswerInput from '../answer-input';
import TrueFalseInput from '../true-false-input';
import QuestionBadge from './question-badge';

const CardFront = ({ question, index, userAnswer, onAnswerChange, isSubmitted, isCorrect, onFlip }) => {
  const isTrueFalse = question?.type === 'true-false' || question?.type === 'true_false';

  // Khóa nội dung câu hỏi để MathJax không phải vẽ lại khi bác click đáp án
  const questionContent = useMemo(() => (
    <div className="text-slate-800 text-base md:text-lg mb-8 font-medium leading-relaxed px-1">
      <SmartText text={question?.content || ""} />
    </div>
  ), [question?._id]);

  return (
    <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-slate-100 flex flex-col h-full w-full" 
         style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', position: 'relative', zIndex: 2 }}>
      
      <QuestionBadge index={index} isSubmitted={isSubmitted} isCorrect={isCorrect} level={question?.level} />

      {questionContent}

      <div className="flex-1 w-full">
        {isTrueFalse ? (
          <TrueFalseInput options={question.options} value={userAnswer} onChange={onAnswerChange} disabled={isSubmitted} />
        ) : (
          <AnswerInput type={question.type} options={question.options} value={userAnswer} onChange={onAnswerChange} disabled={isSubmitted} />
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