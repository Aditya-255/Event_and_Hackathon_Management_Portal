import React, { useState, useEffect } from 'react';
import { Trophy, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLeaderboard from '../leaderboard/DashboardLeaderboard';
import { eventsAPI, leaderboardAPI } from '../../lib/api';

export default function AdminLeaderboards() {
  const [events,   setEvents]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [top3,     setTop3]     = useState([]);

  useEffect(() => {
    eventsAPI.getAll().then(({ data }) => {
      setEvents(data);
      if (data.length > 0) setSelected(data[0]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selected) return;
    leaderboardAPI.byEvent(selected.id)
      .then(({ data }) => setTop3(data.slice(0, 3)))
      .catch(() => setTop3([]));
  }, [selected]);

  const handleExport = () => {
    if (!top3.length) return;
    const rows = [["Rank","Team","Score","Track","Event"]];
    top3.forEach(t => rows.push([t.rank, t.team, t.score, t.track, t.event]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "leaderboard.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const podiumOrder = top3.length >= 3
    ? [
        { ...top3[1], h: "h-28", color: "from-slate-400 to-slate-500" },
        { ...top3[0], h: "h-40", color: "from-yellow-400 to-orange-400" },
        { ...top3[2], h: "h-24", color: "from-amber-600 to-amber-800" },
      ]
    : top3.map((t, i) => ({ ...t, h: i === 0 ? "h-40" : "h-28", color: "from-sky-400 to-cyan-500" }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Leaderboards</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">View and manage event rankings</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm"
        ><Download size={15} /> Export CSV</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <Filter size={15} /> Select Event:
          </div>
          {events.map(ev => (
            <button key={ev.id} onClick={() => setSelected(ev)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selected?.id === ev.id ? 'bg-gradient-to-r from-sky-500 to-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >{ev.title}</button>
          ))}
          {events.length === 0 && <span className="text-sm text-slate-400">No events found</span>}
        </div>
      </div>

      {podiumOrder.length > 0 && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
          <h3 className="text-center font-black text-lg mb-8 relative z-10 flex items-center justify-center gap-2">
            <Trophy size={20} className="text-yellow-400" /> Top 3 — {selected?.title}
          </h3>
          <div className="flex items-end justify-center gap-6 h-44 relative z-10">
            {podiumOrder.map((p, i) => (
              <motion.div key={i} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center font-black text-lg shadow-xl z-10 -mb-6 border-4 border-slate-900`}>
                  {p.rank}
                </div>
                <div className={`w-32 ${p.h} bg-white/10 backdrop-blur-md rounded-t-2xl border-t border-x border-white/20 flex flex-col items-center justify-end pb-4 px-2`}>
                  <p className={`font-bold text-sm text-center ${p.rank === 1 ? 'text-yellow-300' : 'text-slate-200'}`}>{p.team}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1">{parseFloat(p.score).toFixed(1)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {selected && <DashboardLeaderboard eventId={selected.id} eventName={selected.title} />}
    </div>
  );
}
