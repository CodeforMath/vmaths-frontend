import React, { useState, useEffect, useRef, useCallback } from 'react';
import CardFront from './card-front';
import CardBack from './card-back';

const QuestionCard = ({ question, index, userAnswer, onAnswerChange, isSubmitted = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardScopeRef = useRef(null);

  const triggerMathJax = useCallback((target) => {
    if (window.MathJax?.typesetPromise && target) {
      window.MathJax.typesetClear([target]);
      window.MathJax.typesetPromise([target]).catch(() => {});
    }
  }, []);

  // CHỈ chạy khi đổi câu hỏi mới
  useEffect(() => {
    setIsFlipped(false);
    const timer = setTimeout(() => {
      if (cardScopeRef.current) triggerMathJax(cardScopeRef.current);
    }, 100);
    return () => clearTimeout(timer);
  }, [question?._id, triggerMathJax]);

  // CHỈ chạy khi lật mặt thẻ (để render lời giải)
  useEffect(() => {
    if (isFlipped) {
      const timer = setTimeout(() => {
        if (cardScopeRef.current) triggerMathJax(cardScopeRef.current);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isFlipped, triggerMathJax]);

  // TUYỆT ĐỐI không cho userAnswer vào useEffect. 
  // Nhờ StaticMathContent (memo), Toán sẽ tự giữ nguyên khi click.

  if (!question) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-10" style={{ perspective: '2000px' }}>
      <div ref={cardScopeRef} className="relative w-full transition-transform duration-[700ms]" 
           style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: '520px' }}>
        <CardFront {...{question, index, userAnswer, onAnswerChange, isSubmitted}} onFlip={() => setIsFlipped(true)} />
        <CardBack {...{correctAnswer: question?.correctAnswer, explanation: question?.explanation}} onFlipBack={() => setIsFlipped(false)} />
      </div>
    </div>
  );
};

export default QuestionCard;