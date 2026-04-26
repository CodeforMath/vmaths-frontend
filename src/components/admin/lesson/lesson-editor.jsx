import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Trash2, Layout, Plus, X, 
  BookOpen, GraduationCap, 
  Star, Lightbulb, PencilLine, Info, AlertCircle, Save, Eraser
} from 'lucide-react';

// Import thư viện MathJax Context
import { MathJaxContext, MathJax } from 'better-react-mathjax';

// Import UI Components
import { LessonHeader, SectionHeading } from '../../ui/lesson-heading';
import MathBox from '../../ui/math-box';
import { MediaRender } from '../../ui/media-render';
import LessonOverview from '../../ui/lesson-overview';
import SmartText from '../../ui/smart-text';

const LessonEditor = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const previewRef = useRef(null);
    
    const [formData, setFormData] = useState({
        title: '',
        lessonId: '',      
        displayOrder: '',  
        grade: '12', 
        description: ''
    });
    
    const [sections, setSections] = useState([]);

    // --- LOGIC TỰ ĐỘNG LƯU VÀ KHÔI PHỤC ---

    // 1. Khôi phục dữ liệu khi load trang
    useEffect(() => {
        const loadInitialData = async () => {
            // Kiểm tra xem có đang sửa bài cũ từ URL không (vd: ?id=TOAN12-C1-B1)
            const params = new URLSearchParams(window.location.search);
            const lessonIdFromUrl = params.get('id');

            if (lessonIdFromUrl) {
                try {
                    const res = await fetch(`http://localhost:5000/api/lessons/${lessonIdFromUrl}`);
                    if (res.ok) {
                        const data = await res.json();
                        setFormData({
                            title: data.title || '',
                            lessonId: data.lessonId || '',
                            displayOrder: data.displayOrder || '',
                            grade: data.grade || '12',
                            description: data.description || ''
                        });
                        setSections(data.sections || []);
                        return; // Ưu tiên dữ liệu từ Server
                    }
                } catch (err) { console.error("Lỗi fetch server:", err); }
            }

            // Nếu không có ID trên URL, kiểm tra LocalStorage (Bản nháp đang soạn dở)
            const draft = localStorage.getItem('vmaths_editor_draft');
            if (draft) {
                const { formData: dForm, sections: dSections } = JSON.parse(draft);
                setFormData(dForm);
                setSections(dSections);
            }
        };
        loadInitialData();
    }, []);

    // 2. Tự động lưu vào LocalStorage mỗi khi có thay đổi
    useEffect(() => {
        if (formData.title || sections.length > 0) {
            const draftData = { formData, sections };
            localStorage.setItem('vmaths_editor_draft', JSON.stringify(draftData));
        }
    }, [formData, sections]);

    // 3. Hàm Xóa bản nháp
    const clearDraft = () => {
        if (window.confirm("Bác có chắc muốn xóa bản nháp này để soạn bài mới không?")) {
            localStorage.removeItem('vmaths_editor_draft');
            setFormData({ title: '', lessonId: '', displayOrder: '', grade: '12', description: '' });
            setSections([]);
            // Xóa luôn ID trên URL nếu có
            navigate('/admin/lesson-editor', { replace: true });
        }
    };

    // --- CẤU HÌNH MATHJAX ---
    const mjConfig = useMemo(() => ({
        loader: { load: ["input/tex", "output/chtml"] },
        tex: {
            inlineMath: [["$", "$"], ["\\(", "\\)"]],
            displayMath: [["$$", "$$"], ["\\[", "\\]"]],
            processEscapes: true
        }
    }), []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (window.MathJax && previewRef.current) {
                window.MathJax.typesetPromise([previewRef.current]).catch((err) => console.log("MathJax Render Error:", err));
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [sections, formData]);

    const mathBoxConfig = {
        definition: { label: 'Định nghĩa', color: 'border-blue-500 bg-blue-50/50', icon: BookOpen, subLabel: 'Chứng minh' },
        theorem: { label: 'Định lý', color: 'border-purple-500 bg-purple-50/50', icon: GraduationCap, subLabel: 'Chứng minh' },
        proposition: { label: 'Mệnh đề', color: 'border-indigo-500 bg-indigo-50/50', icon: Star, subLabel: 'Chứng minh' },
        example: { label: 'Ví dụ', color: 'border-green-500 bg-green-50/50', icon: Lightbulb, subLabel: 'Lời giải' },
        exercise: { label: 'Bài tập', color: 'border-orange-500 bg-orange-50/50', icon: PencilLine, subLabel: 'Lời giải' },
        introduction: { label: 'Giới thiệu', color: 'border-slate-400 bg-slate-50', icon: Info },
        note: { label: 'Chú ý', color: 'border-amber-500 bg-amber-50/50', icon: AlertCircle },
        remember: { label: 'Ghi nhớ', color: 'border-red-500 bg-red-50/50', icon: Star },
    };

    const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const addSection = (type) => {
        const newSection = {
            id: generateId(),
            type,
            data: type === 'overview' ? { keyTerms: [''], skills: [''] }
                : type === 'mathbox' ? { style: 'definition', title: '', content: '', extraContent: '' }
                : type === 'heading' ? { level: 1, content: '' } 
                : type === 'paragraph' ? { content: '' }
                : { type: 'tikz', url: '', caption: '' }
        };
        setSections([...sections, newSection]);
    };

    const updateSection = (id, newData) => {
        setSections(prev => prev.map(s => 
            s.id === id ? { ...s, data: { ...s.data, ...newData } } : s
        ));
    };

    const handleSave = async () => {
        if (!formData.title || !formData.lessonId) return alert("Bác nhập đủ thông tin nhé!");
        
        const slug = formData.title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');

        try {
            const response = await fetch('http://localhost:5000/api/lessons', {
                method: 'POST', // Backend nên dùng findOneAndUpdate với upsert: true
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, slug, sections, updatedAt: new Date() })
            });
            
            if(response.ok) {
                alert("Đã lưu tiến độ thành công!");
                localStorage.removeItem('vmaths_editor_draft'); // Lưu xong thì xóa nháp local
                navigate(`/admin/question-editor?lessonId=${formData.lessonId}`);
            }
        } catch (err) { alert("Lỗi kết nối Server!"); }
    };

    return (
        <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden font-sans">
            {/* HEADER */}
            <header className="h-16 flex-shrink-0 bg-white border-b px-8 flex items-center justify-between z-[110] shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-[#3FB8AF] p-2 rounded-xl text-white shadow-lg"><Layout size={20} /></div>
                    <span className="font-black uppercase tracking-tighter text-xl text-slate-800">VMaths Studio</span>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={clearDraft}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors px-4 py-2"
                    >
                        <Eraser size={16} /> XÓA BẢN NHÁP
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="flex items-center gap-2 bg-[#3FB8AF] text-white px-8 py-2.5 rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all"
                    >
                        <Save size={16} /> LƯU BÀI GIẢNG
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* EDITOR SIDE */}
                <section className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white border-r">
                    <div className="max-w-3xl mx-auto space-y-10 pb-96">
                        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 grid grid-cols-4 gap-4 shadow-inner">
                            <input value={formData.displayOrder} onChange={(e) => setFormData({...formData, displayOrder: e.target.value})} className="border-2 border-slate-200 p-4 rounded-3xl font-bold text-center outline-none focus:border-[#3FB8AF] transition-all" placeholder="Bài số" />
                            <input value={formData.lessonId} onChange={(e) => setFormData({...formData, lessonId: e.target.value})} className="border-2 border-slate-200 p-4 rounded-3xl font-bold text-center outline-none uppercase focus:border-[#3FB8AF] transition-all" placeholder="Mã ID" />
                            <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="col-span-2 border-2 border-slate-200 p-4 rounded-3xl font-bold uppercase outline-none focus:border-[#3FB8AF] transition-all" placeholder="Tiêu đề bài học..." />
                        </div>

                        <div className="space-y-8">
                            {sections.map((section) => (
                                <div key={section.id} className="border-2 border-slate-100 rounded-[2.5rem] bg-white overflow-hidden relative group hover:border-slate-200 transition-all">
                                    <div className="bg-slate-50/50 px-6 py-3 border-b flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>{section.type}</span>
                                        <button onClick={() => setSections(sections.filter(s => s.id !== section.id))} className="hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                    </div>

                                    <div className="p-8">
                                        {section.type === 'mathbox' && (
                                            <div className="space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.keys(mathBoxConfig).map(st => (
                                                        <button key={st} onClick={() => updateSection(section.id, { style: st })} className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${section.data.style === st ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{mathBoxConfig[st].label}</button>
                                                    ))}
                                                </div>
                                                <input value={section.data.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} className="w-full border-b border-slate-100 py-2 font-bold outline-none text-lg" placeholder="Tiêu đề..." />
                                                <textarea value={section.data.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} className="w-full border-2 border-slate-50 rounded-2xl p-4 h-32 font-mono text-sm bg-slate-50/50 outline-none focus:border-[#3FB8AF]/30 transition-all" placeholder="Nội dung chính (Dùng $ $ cho toán)..." />
                                                {mathBoxConfig[section.data.style]?.subLabel && (
                                                    <textarea value={section.data.extraContent} onChange={(e) => updateSection(section.id, { extraContent: e.target.value })} className="w-full border-2 border-dashed border-orange-100 rounded-2xl p-4 h-32 font-mono text-sm bg-orange-50/20 outline-none focus:border-orange-200 transition-all" placeholder={`Nhập ${mathBoxConfig[section.data.style].subLabel.toLowerCase()} (Dùng $ $ cho toán)...`} />
                                                )}
                                            </div>
                                        )}
                                        {section.type === 'heading' && (
                                            <div className="flex gap-4">
                                                <select value={section.data.level} onChange={(e) => updateSection(section.id, { level: Number(e.target.value) })} className="border-2 border-slate-100 rounded-2xl px-3 h-12 font-black text-xs outline-none focus:border-[#3FB8AF] transition-all"><option value={1}>H1</option><option value={2}>H2</option></select>
                                                <input value={section.data.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} className="flex-1 border-b-2 py-2 outline-none font-bold text-xl focus:border-[#3FB8AF] transition-all" placeholder="Tiêu đề mục..." />
                                            </div>
                                        )}
                                        {section.type === 'paragraph' && (
                                            <textarea value={section.data.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} className="w-full border-2 border-slate-50 rounded-2xl p-4 h-24 outline-none focus:border-[#3FB8AF]/30 transition-all" placeholder="Nhập văn bản..." />
                                        )}
                                        {section.type === 'overview' && (
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-red-500 uppercase ml-2 tracking-widest">Thuật ngữ</label>
                                                    {section.data.keyTerms.map((term, i) => (
                                                        <div key={i} className="flex items-center gap-2 group">
                                                            <input value={term} onChange={(e) => { 
                                                                const n = [...section.data.keyTerms]; n[i] = e.target.value; updateSection(section.id, { keyTerms: n }); 
                                                            }} className="flex-1 border-b border-slate-100 p-2 text-sm outline-none focus:border-red-200" placeholder="Nhập thuật ngữ..." />
                                                            <button onClick={() => {
                                                                const n = section.data.keyTerms.filter((_, idx) => idx !== i); updateSection(section.id, { keyTerms: n });
                                                            }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => updateSection(section.id, { keyTerms: [...section.data.keyTerms, ''] })} className="text-[9px] font-black text-slate-300 hover:text-red-500 transition-colors uppercase pt-2">+ THÊM THUẬT NGỮ</button>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-blue-500 uppercase ml-2 tracking-widest">Kỹ năng</label>
                                                    {section.data.skills.map((skill, i) => (
                                                        <div key={i} className="flex items-center gap-2 group">
                                                            <input value={skill} onChange={(e) => { 
                                                                const n = [...section.data.skills]; n[i] = e.target.value; updateSection(section.id, { skills: n }); 
                                                            }} className="flex-1 border-b border-slate-100 p-2 text-sm outline-none focus:border-blue-200" placeholder="Nhập kỹ năng..." />
                                                            <button onClick={() => {
                                                                const n = section.data.skills.filter((_, idx) => idx !== i); updateSection(section.id, { skills: n });
                                                            }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => updateSection(section.id, { skills: [...section.data.skills, ''] })} className="text-[9px] font-black text-slate-300 hover:text-blue-500 transition-colors uppercase pt-2">+ THÊM KỸ NĂNG</button>
                                                </div>
                                            </div>
                                        )}
                                        {section.type === 'media' && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <select value={section.data.type} onChange={(e) => updateSection(section.id, { type: e.target.value })} className="border-2 border-slate-100 rounded-2xl p-4 text-xs font-black outline-none"><option value="tikz">TIKZ/SVG</option><option value="video">VIDEO</option></select>
                                                <input value={section.data.url} onChange={(e) => updateSection(section.id, { url: e.target.value })} className="border-2 border-slate-100 rounded-2xl p-4 text-xs font-mono outline-none focus:border-[#3FB8AF]" placeholder="File path / Link ID..." />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DOCK BAR */}
                    <div className="fixed bottom-10 left-[25%] -translate-x-1/2 flex gap-1 p-2 bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl z-[120] border border-white/10">
                        {['overview', 'heading', 'paragraph', 'mathbox', 'media'].map(t => (
                            <button key={t} onClick={() => addSection(t)} className="px-6 py-3 text-white text-[10px] font-black hover:bg-[#3FB8AF] rounded-2xl transition-all uppercase tracking-widest active:scale-90">{t}</button>
                        ))}
                    </div>
                </section>

                {/* PREVIEW SIDE */}
                <section className="flex-1 overflow-y-auto bg-slate-100 p-12 lg:block hidden custom-scrollbar">
                    <MathJaxContext config={mjConfig}>
                        <div ref={previewRef} className="max-w-2xl mx-auto bg-white min-h-[1100px] shadow-2xl rounded-[4rem] p-16 border border-slate-200/50 relative mb-20 overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#3FB8AF]"></div>
                            <LessonHeader number={formData.displayOrder} title={formData.title} />
                            <div className="mt-12 space-y-8">
                                {sections.map((s) => (
                                    <div key={s.id} onClick={() => { setTimeout(() => { if(window.MathJax) window.MathJax.typesetPromise([previewRef.current]); }, 150); }}>
                                        {s.type === 'overview' && <LessonOverview data={s.data} onImageClick={setSelectedImage} />}
                                        {s.type === 'heading' && <SectionHeading level={s.data.level}>{s.data.content}</SectionHeading>}
                                        {s.type === 'mathbox' && <MathJax dynamic><MathBox data={s.data} onImageClick={setSelectedImage} /></MathJax>}
                                        {s.type === 'paragraph' && (
                                            <div className="my-6 px-2">
                                                <MathJax dynamic><SmartText text={s.data.content} className="text-slate-600" /></MathJax>
                                            </div>
                                        )}
                                        {s.type === 'media' && <MediaRender type={s.data.type} url={s.data.url} caption={s.data.caption} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MathJaxContext>
                </section>
            </main>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                        <motion.img src={selectedImage} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="max-w-[90vw] max-h-[85vh] object-contain drop-shadow-2xl rounded-xl" />
                        <button className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:text-red-500 transition-colors"><X size={24} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            `}</style>
        </div>
    );
};

export default LessonEditor;