import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SmartText from '../../ui/smart-text';
import { Layout, FileText, Save, Hash, Bookmark, GraduationCap } from 'lucide-react';
import { API_BASE_URL } from '../../../api/config';

const QuestionEditor = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [question, setQuestion] = useState({
        questionId: '',
        lessonId: '',
        chapterId: '',
        grade: 12,
        content: '',
        type: 'multiple_choice',
        level: 'Nhận biết',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
    });

    // 1. Lấy lessonId từ URL (nếu có)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const lessonId = params.get('lessonId');
        if (lessonId) {
            setQuestion(prev => ({ ...prev, lessonId: lessonId }));
        }
    }, [location]);

    // 2. Tự động quét MathJax để render công thức
    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([document.getElementById('preview-column')])
                    .catch((err) => console.log("MathJax Error:", err));
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [question.content, question.explanation, question.options, question.type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuestion(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...question.options];
        newOptions[index] = value;
        setQuestion(prev => ({ ...prev, options: newOptions }));
    };

    const convertLevelToEnum = (lvl) => {
        const map = {
            "Nhận biết": "NB",
            "Thông hiểu": "TH",
            "Vận dụng": "VD",
            "Vận dụng cao": "VDC"
        };
        return map[lvl] || "NB";
    };
    // --- HÀM LƯU DỮ LIỆU ĐÃ ĐƯỢC CẢI TIẾN ---
    const handleSave = async () => {
        // Kiểm tra cơ bản
        if (!question.questionId?.trim() || !question.lessonId?.trim()) {
            alert("Bác Nguyen vui lòng nhập đầy đủ Question ID và Lesson ID nhé!");
            return;
        }

        // --- CHUẨN HÓA DỮ LIỆU ĐÁP ÁN ---
        let formattedCorrectAnswer = question.correctAnswer;

        try {
            if (question.type === 'true_false') {
                // Xử lý chuỗi nhập vào: "[True, False...]" hoặc "True, True..."
                const cleanStr = String(question.correctAnswer)
                    .replace(/[\[\]\s]/g, '') // Xóa ngoặc vuông và khoảng trắng
                    .replace(/;/g, ',');      // Đổi chấm phẩy thành phẩy nếu bác gõ nhầm

                // Tách mảng và ép kiểu Boolean thực thụ
                const booleanArray = cleanStr.split(',')
                    .filter(v => v !== '')
                    .map(val => val.toLowerCase() === 'true' || val.toLowerCase() === 't');

                if (booleanArray.length !== 4) {
                    alert(`Câu Đúng/Sai cần đủ 4 ý. Bác đang nhập ${booleanArray.length}/4 ý!`);
                    return;
                }
                formattedCorrectAnswer = booleanArray;
            } 
            else if (question.type === 'multiple_choice') {
                // Hỗ trợ nhập cả A, B, C, D hoặc 0, 1, 2, 3
                const val = String(question.correctAnswer).toUpperCase().trim();
                const mapInput = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
                const num = mapInput[val] !== undefined ? mapInput[val] : parseInt(val);

                if (isNaN(num) || num < 0 || num > 3) {
                    alert("Đáp án trắc nghiệm bác nhập 0, 1, 2, 3 (hoặc A, B, C, D) nhé!");
                    return;
                }
                formattedCorrectAnswer = num;
            } else {
                // Short answer hoặc Essay: Trim khoảng trắng dư thừa
                formattedCorrectAnswer = String(question.correctAnswer).trim();
            }
        } catch (err) {
            alert("Lỗi định dạng đáp án rồi bác ạ!");
            return;
        }

        const payload = {
            ...question,
            level: convertLevelToEnum(question.level),
            grade: Number(question.grade),
            options: question.options.map(opt => opt.trim()),
            correctAnswer: formattedCorrectAnswer, // Gửi mảng/số xịn lên Server
            isPublic: true,
            tags: [] 
        };

        try {
            // Lưu ý: Thay đổi URL nếu bác đã deploy Backend lên Vercel/Render
            const response = await axios.post(`${API_BASE_URL}/questions`, payload);
            if (response.status === 201 || response.status === 200) {
                alert("Đã lưu vào VMaths thành công! Tuyệt vời bác Nguyen ơi!");
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi rồi bác: " + (error.response?.data?.message || "Không thể kết nối Server"));
        }
    };

    const isChoiceType = question.type === 'multiple_choice' || question.type === 'true_false';

    return (
        <div className="pt-32 flex h-screen w-full bg-[#F1F5F9] overflow-hidden font-sans text-slate-900">
            
            {/* CỘT TRÁI: NHẬP LIỆU */}
            <div className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#F1F5F9]">
                <div className="max-w-4xl mx-auto p-6 lg:p-10 pb-20">
                    
                    {/* HEADER CONTROL AREA */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
                                <Layout className="text-[#3FB8AF]" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black uppercase tracking-tight italic">VMaths Studio</h1>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ngân hàng câu hỏi</p>
                            </div>
                        </div>

                        {/* NHÓM CÁC Ô NHẬP ID */}
                        <div className="flex flex-wrap gap-2 justify-end">
                            {/* Question ID */}
                            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-end min-w-[100px]">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1">
                                    <Hash size={8} /> Question ID
                                </span>
                                <input 
                                    name="questionId" value={question.questionId} onChange={handleChange}
                                    className="bg-transparent font-mono font-bold text-orange-500 outline-none w-28 text-right text-sm"
                                    placeholder="Q-12..."
                                />
                            </div>

                            {/* Chapter ID */}
                            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-end min-w-[80px]">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1">
                                    <Bookmark size={8} /> Chapter
                                </span>
                                <input 
                                    name="chapterId" value={question.chapterId} onChange={handleChange}
                                    className="bg-transparent font-mono font-bold text-blue-500 outline-none w-20 text-right text-sm"
                                    placeholder="C01"
                                />
                            </div>

                            {/* Grade */}
                            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1">
                                    <GraduationCap size={8} /> Lớp
                                </span>
                                <input 
                                    name="grade" type="number" value={question.grade} onChange={handleChange}
                                    className="bg-transparent font-mono font-bold text-slate-700 outline-none w-10 text-right text-sm"
                                />
                            </div>

                            {/* Lesson ID */}
                            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-end min-w-[100px]">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">Lesson ID</span>
                                <input 
                                    name="lessonId" value={question.lessonId} onChange={handleChange}
                                    className="bg-transparent font-mono font-bold text-[#3FB8AF] outline-none w-24 text-right text-sm"
                                    placeholder="..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Cấu hình loại và mức độ */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Hình thức câu hỏi</label>
                                <select name="type" value={question.type} onChange={handleChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 focus:border-[#3FB8AF] rounded-2xl font-bold outline-none cursor-pointer appearance-none">
                                    <option value="multiple_choice">Trắc nghiệm 4 lựa chọn</option>
                                    <option value="true_false">Trắc nghiệm Đúng/Sai</option>
                                    <option value="short_answer">Điền đáp số ngắn</option>
                                    <option value="essay">Tự luận / Trình bày</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mức độ nhận thức</label>
                                <select name="level" value={question.level} onChange={handleChange} className="w-full p-4 bg-slate-50 border-2 border-slate-100 focus:border-[#3FB8AF] rounded-2xl font-bold outline-none cursor-pointer appearance-none">
                                    <option value="Nhận biết">Nhận biết (NB)</option>
                                    <option value="Thông hiểu">Thông hiểu (TH)</option>
                                    <option value="Vận dụng">Vận dụng (VD)</option>
                                    <option value="Vận dụng cao">Vận dụng cao (VDC)</option>
                                </select>
                            </div>
                        </div>

                        {/* Nội dung đề bài */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#3FB8AF] uppercase tracking-widest ml-1">Nội dung câu hỏi (LaTeX support)</label>
                                <textarea name="content" rows="6" value={question.content} onChange={handleChange} className="w-full p-6 bg-slate-50 border-2 border-slate-100 focus:border-[#3FB8AF] rounded-[2rem] font-medium outline-none text-lg custom-scrollbar" placeholder="Sử dụng $...$ cho công thức toán..." />
                            </div>
                        </div>

                        {/* Các phương án lựa chọn */}
                        {isChoiceType && (
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 space-y-4">
                                <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest ml-1">Danh sách phương án</label>
                                {question.options.map((opt, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <span className="w-10 h-10 flex-none flex items-center justify-center bg-slate-900 text-white rounded-xl text-sm font-black shadow-lg">
                                            {question.type === 'multiple_choice' ? String.fromCharCode(65 + i) : String.fromCharCode(97 + i)}
                                        </span>
                                        <input type="text" value={opt} onChange={(e) => handleOptionChange(i, e.target.value)} className="flex-1 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#3FB8AF] font-semibold" placeholder={`Phương án ${i+1}...`} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Đáp án và Lời giải */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200/50 space-y-6">
                            {question.type !== 'essay' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-red-500 uppercase ml-1 tracking-widest">Đáp án đúng</label>
                                    <input name="correctAnswer" value={question.correctAnswer} onChange={handleChange} className="w-full p-4 bg-red-50 border-2 border-red-100 rounded-2xl font-black text-red-600 outline-none focus:border-red-400" placeholder="Ví dụ: 0 (cho câu A), hoặc 1.5, hoặc True,False..." />
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Lời giải chi tiết / Hướng dẫn chấm</label>
                                <textarea name="explanation" rows="8" value={question.explanation} onChange={handleChange} className="w-full p-8 bg-slate-50 border-2 border-slate-100 focus:border-[#3FB8AF] rounded-[2.5rem] font-medium outline-none custom-scrollbar" placeholder="Giải thích các bước..." />
                            </div>
                        </div>

                        {/* NÚT LƯU */}
                        <div className="pb-10">
                            <button onClick={handleSave} className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-[#3FB8AF] transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 uppercase tracking-[0.2em]">
                                <Save size={24} /> Lưu vào Database
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CỘT PHẢI: PREVIEW (ẨN TRÊN MOBILE) */}
            <div id="preview-column" className="hidden xl:flex w-[550px] h-full flex-col bg-white border-l border-slate-200 z-20">
                <div className="p-8 border-b border-slate-100 bg-white/80 flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Chế độ xem trước</span>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
                    <div className="max-w-full space-y-8 pb-[100px]">
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 space-y-8">
                            <div className="flex justify-between items-start">
                                <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold rounded-full text-slate-500 uppercase tracking-tighter">
                                    {question.type} • {question.level}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-300">#{question.questionId || 'N/A'}</span>
                            </div>
                            
                            <div className="text-slate-800 text-xl leading-relaxed font-semibold">
                                <SmartText text={question.content || "Nội dung câu hỏi sẽ hiển thị tại đây..."} />
                            </div>

                            {isChoiceType && (
                                <div className="grid grid-cols-1 gap-4">
                                    {question.options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-5 p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/50">
                                            <span className="w-10 h-10 flex-none rounded-2xl border-2 flex items-center justify-center text-xs font-black text-slate-400 bg-white">
                                                {question.type === 'multiple_choice' ? String.fromCharCode(65+i) : String.fromCharCode(97+i)}
                                            </span>
                                            <div className="text-base font-bold text-slate-600">
                                                <SmartText text={opt || "..."} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {question.explanation && (
                            <div className="p-10 bg-white rounded-[3rem] border-l-[12px] border-[#3FB8AF] shadow-2xl">
                                <h3 className="text-[12px] font-black text-[#3FB8AF] uppercase mb-6 tracking-[0.2em]">Lời giải chi tiết</h3>
                                <div className="text-lg text-slate-600 leading-relaxed font-medium">
                                    <SmartText text={question.explanation} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                textarea { resize: none; }
            `}</style>
        </div>
    );
};

export default QuestionEditor;