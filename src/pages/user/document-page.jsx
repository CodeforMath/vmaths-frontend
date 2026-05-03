import React, { useState } from 'react';
import { DOCS_DATA } from '../../constants/docs-data';
import { FileText, Download, Search } from 'lucide-react';

export default function DocumentPage() {
  const [activeTab, setActiveTab] = useState("toan-12");

  return (
    <div className="pt-32 flex min-h-screen bg-slate-50 pt-20">
      {/* SIDEBAR BÊN TRÁI */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-xl font-black text-slate-800 mb-6">Kho Tài Liệu</h2>
          <nav className="space-y-2">
            {Object.keys(DOCS_DATA).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  activeTab === key 
                  ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                  : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {DOCS_DATA[key].label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* NỘI DUNG BÊN PHẢI */}
      <main className="flex-1 md:ml-72 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {DOCS_DATA[activeTab].label}
          </h1>
          <p className="text-slate-500 mb-8 font-medium">Tổng hợp tài liệu học tập và ôn thi mới nhất.</p>

          {/* HIỂN THỊ DANH SÁCH FILE */}
          <div className="space-y-8">
            {DOCS_DATA[activeTab].categories.map((cat, idx) => (
              <section key={idx}>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-green-500 rounded-full"></div>
                  {cat.name}
                </h3>
                <div className="grid gap-3">
                  {cat.files.map((file) => (
                    <div key={file.id} className="group bg-white p-4 rounded-2xl border border-slate-100 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 group-hover:text-green-600 transition-colors">{file.title}</p>
                          <p className="text-xs text-slate-400 font-medium">{file.type.toUpperCase()} • {file.size}</p>
                        </div>
                      </div>
                      <a href={file.url} download className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-green-500 hover:text-white transition-all">
                        <Download size={20} />
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}