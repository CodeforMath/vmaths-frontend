import React, { useState, useEffect, useMemo } from 'react';
import { MathJaxContext } from 'better-react-mathjax';
import axios from 'axios';

import { LessonHeader } from '../../components/ui/lesson-heading';
import ImageModal from '../../components/ui/image-modal';
import PracticeConfig from '../../components/exam/practice-config';
import LessonBody from './components/lesson-body';
import ExamPlayground from './components/exam-playground';

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
  }
};

const LessonDetail = ({ lessonSlug, lessonNumber, onExamDataUpdate }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]); 
  const [examStatus, setExamStatus] = useState('idle'); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // 1. Logic đếm ngược
  useEffect(() => {
    let timer;
    if (examStatus === 'doing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (examStatus === 'doing' && timeLeft === 0) {
      setExamStatus('finished');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return () => clearInterval(timer);
  }, [examStatus, timeLeft]);

  const formatTimeStr = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 2. Tải bài học
  useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/lessons/${lessonSlug}`);
        if (isMounted) {
          setLesson(res.data);
          setExamStatus('idle');
          setQuestions([]); 
          setUserAnswers({});
          setTimeLeft(0);
        }
      } catch (err) { console.error(err); } 
      finally { if (isMounted) setLoading(false); }
    };
    fetchLesson();
    return () => { isMounted = false; };
  }, [lessonSlug]);

  // 3. Sinh đề thi
  const handleStartExam = async (selectedTypes, totalTime, count) => {
    if (!lesson?._id) return;
    setIsGenerating(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/exams/generate`, {
        params: { 
          lessonId: lesson.lessonId || lesson.id, 
          limit: count, 
          types: selectedTypes.join(',') 
        }
      });

      if (res.data?.success && res.data.data.length > 0) {
        setQuestions(res.data.data); 
        setExamStatus('doing');
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setTimeLeft(totalTime * 60); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Kho câu hỏi không đủ bác ơi.");
      }
    } catch (err) {
      alert("Lỗi kết nối Server.");
    } finally {
      setIsGenerating(false);
    }
  };

  const score = useMemo(() => {
    if (examStatus !== 'finished') return 0;
    let s = 0;
    questions.forEach((q, i) => {
      if (JSON.stringify(userAnswers[i]) === JSON.stringify(q.correctAnswer)) s++;
    });
    return s;
  }, [examStatus, questions, userAnswers]);

  // 4. Đồng bộ dữ liệu ra Sidebar & Layout
  useEffect(() => {
    if (onExamDataUpdate && lesson) {
      onExamDataUpdate({
        status: examStatus,
        questions,
        userAnswers,
        currentIdx: currentQuestionIndex,
        isExamMode: examStatus !== 'idle',
        timeLeft: formatTimeStr(timeLeft), 
        onJumpToQuestion: (i) => setCurrentQuestionIndex(i),
        onFinish: () => {
          setExamStatus('finished'); 
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }, [examStatus, currentQuestionIndex, userAnswers, questions, lesson, timeLeft]);

  if (loading) return <div className="p-32 text-center text-[#3FB8AF] font-black animate-pulse uppercase tracking-tighter">Đang tải bài giảng...</div>;
  if (!lesson) return null;

  return (
    <MathJaxContext config={config}>
      <div className="min-h-screen bg-slate-50/50 pb-24">
        {/* THANH TIẾN TRÌNH ĐÃ ĐƯỢC XÓA BỎ HOÀN TOÀN TẠI ĐÂY */}
        
        <div className="max-w-4xl mx-auto px-5 py-12 md:py-20">
          {examStatus === 'idle' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="bg-white shadow-2xl rounded-[2.5rem] p-6 md:p-16 border border-slate-100">
                <LessonHeader number={lessonNumber || lesson.displayOrder} title={lesson.title} onImageClick={setSelectedImage} />
                <div className="mt-8"><LessonBody sections={lesson.sections} onImageClick={setSelectedImage} lessonId={lesson._id} /></div>
                <div className="mt-12 pt-12 border-t border-slate-100">
                   <PracticeConfig lessonTitle={lesson.title} onStart={handleStartExam} isGenerating={isGenerating} />
                </div>
              </div>
            </div>
          )}

          {(examStatus === 'doing' || examStatus === 'finished') && questions.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ExamPlayground 
                examStatus={examStatus} questions={questions} currentIdx={currentQuestionIndex} 
                userAnswers={userAnswers} score={score}
                onAnswerChange={(idx, ans) => setUserAnswers(prev => ({...prev, [idx]: ans}))}
                onJump={(idx) => { setCurrentQuestionIndex(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onRetry={() => { setExamStatus('doing'); setUserAnswers({}); setCurrentQuestionIndex(0); setTimeLeft(30 * 60); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onBackToLesson={() => { setExamStatus('idle'); setQuestions([]); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            </div>
          )}

          <ImageModal isOpen={!!selectedImage} imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        </div>
      </div>
    </MathJaxContext>
  );
}

export default LessonDetail;