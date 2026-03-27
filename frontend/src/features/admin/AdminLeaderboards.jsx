import React, { useState } from 'react';
import { Trophy, Star, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLeaderboard from '../leaderboard/DashboardLeaderboard';

const EVENTS = ['Spring Hackathon 2026', 'Winter Ideathon 2025', 'UI/UX Design Sprint'];

export default function AdminLeaderboards() {
  const [selected, setSelected] = useState(EVENTS[0]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Leaderboards</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">View and manage event rankings</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Event Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <Filter size={15} /> Select Event:
          </div>
          {EVENTS.map(ev => (
            <button key={ev} onClick={() => setSelected(ev)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selected === ev ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              {ev}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
        <h3 className="text-center font-black text-lg mb-8 relative z-10 flex items-center justify-center gap-2">
          <Trophy size={20} className="text-yellow-400" /> Top 3 — {selected}
        </h3>
        <div className="flex items-end justify-center gap-6 h-44 relative z-10">
          {[
            { rank: 2, name: 'Code Crafters', score: 95.0, h: 'h-28', color: 'from-slate-400 to-slate-500', num: 'bg-slate-300 text-slate-800' },
            { rank: 1, name: 'Innovators Hub', score: 98.5, h: 'h-40', color: 'from-yellow-400 to-orange-400', num: 'bg-yellow-300 text-yellow-900' },
            { rank: 3, name: 'Data Miners', score: 92.2, h: 'h-24', color: 'from-amber-600 to-amber-800', num: 'bg-amber-600 text-amber-100' },
          ].map(p => (
            <motion.div key={p.rank} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: p.rank * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center font-black text-lg shadow-xl z-10 -mb-6 border-4 border-slate-900`}>
                {p.rank}
              </div>
              <div className={`w-32 ${p.h} bg-white/10 backdrop-blur-md rounded-t-2xl border-t border-x border-white/20 flex flex-col items-center justify-end pb-4 px-2`}>
                <p className={`font-bold text-sm text-center ${p.rank === 1 ? 'text-yellow-300' : 'text-slate-200'}`}>{p.name}</p>
                <p className="text-xs text-slate-400 font-semibold mt-1">{p.score}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Leaderboard */}
      <DashboardLeaderboard eventName={selected} />
    </div>
  );
}
