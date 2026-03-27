import React, { useState } from 'react';
import { Star, FileText, CheckCircle, Search, AlertCircle, ChevronRight, Award } from 'lucide-react';
import { jsPDF } from 'jspdf';

const submissions = [
  { id: 1, team: 'Innovators Hub', project: 'EcoTrack', category: 'Sustainability', status: 'Pending', score: null },
  { id: 2, team: 'Code Crafters', project: 'EduSync', category: 'EdTech', status: 'Evaluated', score: 8.5 },
  { id: 3, team: 'Data Miners', project: 'CampusAI', category: 'Open', status: 'Pending', score: null },
  { id: 4, team: 'Campus Fix', project: 'FixIt App', category: 'Sustainability', status: 'Evaluated', score: 7.8 },
];

const categories = [
  { name: 'Innovation & Originality', weight: 30 },
  { name: 'Technical Complexity', weight: 30 },
  { name: 'Business Potential', weight: 20 },
  { name: 'Presentation Quality', weight: 20 },
];

export default function OrganizerJudging() {
  const [list, setList] = useState(submissions);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [scores, setScores] = useState({});

  const filtered = list.filter(s =>
    s.team.toLowerCase().includes(search.toLowerCase()) ||
    s.project.toLowerCase().includes(search.toLowerCase())
  );

  const computedScore = categories.reduce((acc, cat) => {
    const s = parseFloat(scores[cat.name] || 0);
    return acc + (s * cat.weight) / 100;
  }, 0);

  const handleSubmit = () => {
    setList(list.map(s => s.id === selected.id ? { ...s, status: 'Evaluated', score: parseFloat(computedScore.toFixed(1)) } : s));
    setSelected(null);
    setScores({});
  };

  const handleDownloadPDF = () => {
    if (!selected) return;
    const doc = new jsPDF();
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('EventHub — Project Abstract', 20, 25);
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.text(`Team: ${selected.team}`, 20, 55);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Project: ${selected.project}`, 20, 68);
    doc.text(`Category: ${selected.category}`, 20, 78);
    doc.save(`${selected.team}_Abstract.pdf`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Judging Interface</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">Evaluate team submissions and assign scores</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Submissions', value: list.length, color: 'from-violet-500 to-purple-600' },
          { label: 'Evaluated', value: list.filter(s => s.status === 'Evaluated').length, color: 'from-emerald-500 to-teal-500' },
          { label: 'Pending', value: list.filter(s => s.status === 'Pending').length, color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <Award size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-black text-slate-900 text-sm mb-3">Submissions</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none font-medium transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filtered.map(sub => (
              <button key={sub.id} onClick={() => { setSelected(sub); setScores({}); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected?.id === sub.id ? 'border-violet-400 bg-violet-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-slate-900 text-sm">{sub.team}</span>
                  {sub.status === 'Evaluated' ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                </div>
                <p className="text-xs font-semibold text-slate-500">{sub.project}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">{sub.category}</span>
                  {sub.score && <span className="text-xs font-black text-emerald-600">{sub.score}/10</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Judging Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-6 min-h-[500px]">
          {selected ? (
            <>
              <div className="flex justify-between items-start border-b border-slate-100 pb-5 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                    {selected.team.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">{selected.team}</h2>
                    <p className="text-sm text-slate-400 font-medium">{selected.project} · <span className="text-violet-500">{selected.category}</span></p>
                  </div>
                </div>
                <button onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm"
                >
                  <FileText size={15} /> Abstract PDF
                </button>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mb-4">Evaluation Rubric</h3>
              <div className="flex-1 space-y-3 mb-6">
                {categories.map((cat) => (
                  <div key={cat.name} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                        <p className="text-xs text-slate-400 font-medium">Weight: {cat.weight}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">1–10</span>
                        <input type="number" min="1" max="10"
                          value={scores[cat.name] || ''}
                          onChange={e => setScores(prev => ({ ...prev, [cat.name]: e.target.value }))}
                          className="w-16 p-2 text-center font-black border border-slate-200 rounded-xl outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                          placeholder="–"
                        />
                      </div>
                    </div>
                    {scores[cat.name] && (
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${(scores[cat.name] / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-slate-400">Weighted Score</p>
                  <p className="text-4xl font-black text-slate-900">
                    {computedScore > 0 ? computedScore.toFixed(1) : '–'}
                    <span className="text-lg text-slate-400">/10</span>
                  </p>
                </div>
                <button onClick={handleSubmit}
                  className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all"
                >
                  Submit Evaluation <ChevronRight size={17} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <Star size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-700 mb-2">Select a Submission</h3>
              <p className="text-sm font-medium max-w-xs">Choose a team from the sidebar to begin evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
