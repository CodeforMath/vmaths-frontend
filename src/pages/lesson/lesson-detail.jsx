import React, { useState, useEffect, useMemo } from 'react';
import { MathJaxContext } from 'better-react-mathjax';
import axios from 'axios';

// Import Components
import { LessonHeader } from '../../components/ui/lesson-heading';
import ImageModal from '../../components/ui/image-modal';
import PracticeConfig from '../../components/exam/practice-config';
import LessonBody from './lesson-body';
import ExamPlayground from './exam-playground';

// Import Utils & Config
import { API_BASE_URL } from '../../api/config';
import { calculateExamResult, formatTimeStr } from '../../utils/exam-utils';

const config = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
  }
};

const LessonDetail = ({ lessonSlug, lessonNumber, onExamDataUpdate }) => {
  // --- STATES ---
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]); 
  const [examStatus, setExamStatus] = useState('idle'); // 'idle', 'doing', 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxScoreGoal, setMaxScoreGoal] = useState(10);

  // --- EFFECT: TIMER LOGIC ---
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

  // --- EFFECT: FETCH LESSON DATA ---
  useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/lessons/${lessonSlug}`);
        if (isMounted) {
          setLesson(res.data);
          // Reset states khi chuyển bài học mới
          setExamStatus('idle');
          setQuestions([]); 
          setUserAnswers({});
          setTimeLeft(0);
        }
      } catch (err) { 
        console.error("Lỗi tải bài học:", err); 
      } finally { 
        if (isMounted) setLoading(false); 
      }
    };
    fetchLesson();
    return () => { isMounted = false; };
  }, [lessonSlug]);

  // --- LOGIC: CALCULATE RESULTS (Dùng Utils) ---
  const examResultData = useMemo(() => {
    if (examStatus !== 'finished') return { points: 0, correctCount: 0 };
    return calculateExamResult(questions, userAnswers);
  }, [examStatus, questions, userAnswers]);

  // --- HANDLER: START EXAM ---
  const handleStartExam = async (selectedTypes, totalTime, count, distribution, maxScore) => {
    if (!lesson?._id) return;
    setIsGenerating(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/exams/generate`, {
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
        setMaxScoreGoal(maxScore); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Kho câu hỏi hiện tại không đủ số lượng theo yêu cầu của bạn.");
      }
    } catch (err) {
      alert("Lỗi kết nối server khi tạo đề thi.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- EFFECT: SYNC DATA TO SIDEBAR ---
  useEffect(() => {
    if (onExamDataUpdate && lesson) {
      onExamDataUpdate({
        status: examStatus,
        questions,
        userAnswers,
        currentIdx: currentQuestionIndex,
        isExamMode: examStatus !== 'idle',
        timeLeft: formatTimeStr(timeLeft), 
        onJumpToQuestion: (i) => {
           setCurrentQuestionIndex(i);
           window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onFinish: () => {
          if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
            setExamStatus('finished'); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      });
    }
  }, [examStatus, currentQuestionIndex, userAnswers, questions, lesson, timeLeft]);

  // --- RENDER HELPERS ---
  if (loading) return (
    <div className="p-32 text-center text-[#3FB8AF] font-black animate-pulse uppercase tracking-tighter">
      Đang tải dữ liệu bài giảng...
    </div>
  );
  
  if (!lesson) return (
    <div className="p-32 text-center text-slate-400">Không tìm thấy nội dung bài học.</div>
  );

  return (
    <MathJaxContext config={config}>
      <div className="min-h-screen bg-slate-50/50 pb-24">        
        <div className="max-w-4xl mx-auto px-5 py-12 md:py-20">
          
          {/* GIAO DIỆN HỌC TẬP (IDLE) */}
          {examStatus === 'idle' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <div className="bg-white shadow-2xl rounded-[2.5rem] p-6 md:p-16 border border-slate-100">
                <LessonHeader 
                  number={lessonNumber || lesson.displayOrder} 
                  title={lesson.title} 
                  onImageClick={setSelectedImage} 
                />
                
                <div className="mt-8">
                  <LessonBody 
                    sections={lesson.sections} 
                    onImageClick={setSelectedImage} 
                    lessonId={lesson._id} 
                  />
                </div>

                <div className="mt-12 pt-12 border-t border-slate-100">
                   <PracticeConfig 
                     lessonTitle={lesson.title} 
                     onStart={handleStartExam} 
                     isGenerating={isGenerating} 
                   />
                </div>
              </div>
            </div>
          )}

          {/* GIAO DIỆN LÀM BÀI / KẾT QUẢ (DOING/FINISHED) */}
          {(examStatus === 'doing' || examStatus === 'finished') && questions.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ExamPlayground 
                examStatus={examStatus} 
                questions={questions} 
                currentIdx={currentQuestionIndex} 
                userAnswers={userAnswers} 
                
                // Dữ liệu điểm số & câu đúng
                score={examResultData.points}
                scoreProps={maxScoreGoal}
                correctCount={examResultData.correctCount}
                totalQuestions={questions.length}

                // Các action điều hướng
                onAnswerChange={(idx, ans) => setUserAnswers(prev => ({...prev, [idx]: ans}))}
                onJump={(idx) => { 
                  setCurrentQuestionIndex(idx); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}
                onRetry={() => { 
                  if (window.confirm("Làm lại từ đầu? Mọi kết quả hiện tại sẽ bị xóa.")) {
                    setExamStatus('doing'); 
                    setUserAnswers({}); 
                    setCurrentQuestionIndex(0); 
                    setTimeLeft(30 * 60); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }
                }}
                onBackToLesson={() => { 
                  setExamStatus('idle'); 
                  setQuestions([]); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}
                onImageClick={setSelectedImage}
              />
            </div>
          )}

          {/* Modal xem ảnh phóng to */}
          <ImageModal 
            isOpen={!!selectedImage} 
            imageUrl={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        </div>
      </div>
    </MathJaxContext>
  );
}

export default LessonDetail;