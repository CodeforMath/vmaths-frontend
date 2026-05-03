import React, { useState, useEffect, useMemo } from 'react';

const PracticeConfig = ({ lessonTitle, onStart }) => {
  const CONFIG = {
    'multiple-choice': { score: 0.25, time: 2, label: 'Trắc nghiệm', icon: '📝' },
    'true-false':      { score: 1.0,  time: 4.5, label: 'Đúng / Sai', icon: '⚖️' },
    'short-answer':    { score: 0.5,  time: 6, label: 'Điền số',     icon: '🔢' },
    'essay':           { score: 1.0,  time: 10,  label: 'Tự luận',     icon: '✍️' }
  };

  const [selectedTypes, setSelectedTypes] = useState(['multiple-choice', 'true-false', 'short-answer', 'essay']);
  const [desiredCount, setDesiredCount] = useState('20');
  const [totalTime, setTotalTime] = useState(0);

  // 1. Logic tính toán phân bổ (Giữ nguyên thuật toán của bác)
  const currentDist = useMemo(() => {
    const totalDesired = parseInt(desiredCount) || 0;
    if (totalDesired <= 0 || selectedTypes.length === 0) return {};

    let weights = {};
    if (selectedTypes.length === 4) {
      weights = { 'multiple-choice': 3, 'true-false': 3, 'short-answer': 2, 'essay': 2 };
    } 
    else if (selectedTypes.length === 3 && !selectedTypes.includes('essay')) {
      weights = { 'multiple-choice': 3, 'true-false': 4, 'short-answer': 3 };
    }
    else {
      selectedTypes.forEach(t => weights[t] = 1);
    }

    let totalInverseWeight = 0;
    selectedTypes.forEach(type => {
      totalInverseWeight += (weights[type] / CONFIG[type].score);
    });

    const distribution = {};
    let allocatedSoFar = 0;

    selectedTypes.forEach((type, index) => {
      if (index === selectedTypes.length - 1) {
        distribution[type] = totalDesired - allocatedSoFar;
      } else {
        const share = (weights[type] / CONFIG[type].score) / totalInverseWeight;
        const count = Math.round(totalDesired * share);
        distribution[type] = count;
        allocatedSoFar += count;
      }
    });
    return distribution;
  }, [desiredCount, selectedTypes]);

  // 2. Tính toán Tổng điểm tối đa (True/False tính là 1.0đ)
  const totalScore = useMemo(() => {
    let score = 0;
    Object.keys(currentDist).forEach(type => {
      score += (currentDist[type] || 0) * CONFIG[type].score;
    });
    // Trả về số đẹp, nếu là số nguyên thì không hiện thập phân
    return Number.isInteger(score) ? score : score.toFixed(2);
  }, [currentDist]);

  // 3. Cập nhật thời gian dự kiến
  useEffect(() => {
    let calculatedTime = 0;
    Object.keys(currentDist).forEach(type => {
      calculatedTime += (currentDist[type] || 0) * CONFIG[type].time;
    });
    if (calculatedTime > 0) calculatedTime += 7; 
    setTotalTime(Math.round(calculatedTime));
  }, [currentDist]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === "") { setDesiredCount(""); return; }
    const num = parseInt(val);
    if (!isNaN(num)) setDesiredCount(num < 0 ? "0" : num.toString());
  };

  const isValid = parseInt(desiredCount) >= 10 && selectedTypes.length > 0;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 p-6 md:p-10 font-sans animate-in fade-in zoom-in duration-500">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">KHU VỰC LUYỆN TẬP</h2>
        <div className="h-1.5 w-12 bg-[#3FB8AF] mx-auto mt-2 rounded-full mb-2"></div>
        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{lessonTitle || "Thiết lập luyện tập"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* CỘT 1: CHỌN LOẠI CÂU HỎI */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner h-full flex flex-col">
            <h3 className="text-center text-sm font-black text-blue-600 uppercase tracking-widest mb-8 shrink-0">
              1. Chọn Loại câu hỏi
            </h3>
            
            <div className="flex-1 flex flex-col justify-between gap-4">
              {Object.keys(CONFIG).map((id) => {
                const isSelected = selectedTypes.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => setSelectedTypes(prev => 
                      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
                    )}
                    className={`flex flex-1 items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                      isSelected 
                        ? 'border-[#3FB8AF] bg-white text-slate-700 shadow-md translate-x-2' 
                        : 'border-transparent bg-white/40 text-slate-300 grayscale opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-xl mr-4 shrink-0">{CONFIG[id].icon}</span>
                    <div className="text-left">
                      <p className="font-black text-xs uppercase leading-tight">{CONFIG[id].label}</p>
                      <p className="text-[9px] font-bold text-orange-500 opacity-60 uppercase mt-1">
                        {id === 'true-false' ? 'Tối đa 1.0đ / câu' : `${CONFIG[id].score}đ / câu`}
                      </p>
                    </div>
                    {isSelected && <div className="ml-auto text-[#3FB8AF] font-bold">✓</div>}
                  </button>
                );
              })}
            </div>
            
          </div>
        </div>

        {/* CỘT 2: NHẬP SỐ & PHÂN BỔ */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner h-full flex flex-col items-center">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-8 shrink-0">
              2. Số lượng & Phân bổ
            </h3>
            
            <div className="relative mb-10 shrink-0">
              <input 
                type="number" 
                value={desiredCount} 
                onChange={handleInputChange} 
                onFocus={(e) => e.target.select()}
                className={`w-32 h-20 bg-white border-[4px] rounded-3xl text-center font-black text-4xl shadow-xl outline-none transition-all ${
                  isValid ? 'border-[#3FB8AF] text-[#3FB8AF]' : 'border-rose-300 text-rose-300'
                }`}
              />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase whitespace-nowrap shadow-lg">
                Tổng số câu
              </div>
            </div>

            <div className="w-full flex-1 flex flex-col justify-between space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {selectedTypes.map(type => (
                  <div key={type} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[70px]">
                    <span className="text-[8px] font-black text-slate-400 uppercase mb-1 text-center">{CONFIG[type].label}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-[#3FB8AF] text-2xl">{currentDist[type] || 0}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">Câu</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* KHỐI HIỂN THỊ THỜI GIAN & ĐIỂM SỐ */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-[#48CFC2] p-4 rounded-[1.5rem] shadow-lg text-white flex flex-col justify-center">
                   <p className="text-[8px] font-black uppercase opacity-80 mb-1">Thời gian</p>
                   <p className="text-xl font-black italic">{totalTime} <span className="text-[10px] not-italic">PHÚT</span></p>
                </div>
                <div className="bg-orange-400 p-4 rounded-[1.5rem] shadow-lg text-white flex flex-col justify-center">
                   <p className="text-[8px] font-black uppercase opacity-80 mb-1">Điểm tối đa</p>
                   <p className="text-xl font-black italic">{totalScore} <span className="text-[10px] not-italic">ĐIỂM</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4">
        <button 
          disabled={!isValid}
          onClick={() => onStart(selectedTypes, totalTime, parseInt(desiredCount), currentDist, parseFloat(totalScore))}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-green-500 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase flex items-center justify-center gap-4 group disabled:opacity-20"
        >
          {parseInt(desiredCount) < 10 && desiredCount !== "" ? "Tối thiểu 10 câu" : "Bắt đầu luyện tập"}
          <span className="bg-[#3FB8AF] w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">🚀</span>
        </button>
      </div>
    </div>
  );
};

export default PracticeConfig;