import React, { useState, useEffect } from "react";
import { Trophy, Star, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { leaderboardAPI, eventsAPI } from "../../lib/api";

const rankCls = {
  1: "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300",
  2: "bg-slate-200 text-slate-700",
  3: "bg-amber-100 text-amber-800",
};

export default function LeaderboardPage() {
  const [data,    setData]    = useState([]);
  const [events,  setEvents]  = useState([]);
  const [ev,      setEv]      = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getAll().then(({ data }) => setEvents(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const req = ev === "All"
      ? leaderboardAPI.global()
      : leaderboardAPI.byEvent(events.find(e => e.title === ev)?.id);
    req?.then(({ data }) => setData(data)).catch(() => setData([])).finally(() => setLoading(false));
  }, [ev, events]);

  const top3 = data.slice(0, 3);
  const podiumOrder = top3.length >= 3
    ? [
        { ...top3[1], h: "h-28", c: "from-slate-300 to-slate-400", tc: "text-slate-200" },
        { ...top3[0], h: "h-40", c: "from-yellow-300 to-orange-400", tc: "text-yellow-300" },
        { ...top3[2], h: "h-24", c: "from-amber-600 to-amber-800", tc: "text-slate-300" },
      ]
    : top3.map((t, i) => ({ ...t, h: i === 0 ? "h-40" : "h-28", c: "from-sky-400 to-cyan-500", tc: "text-white" }));

  const eventNames = ["All", ...events.map(e => e.title)];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="relative rounded-3xl overflow-hidden mb-12 h-60 shadow-xl">
        <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1400" alt="Leaderboard" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-yellow-300 text-sm font-bold w-max mb-4"><Trophy size={16} />Hall of Fame</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Global Leaderboard</h1>
          <p className="text-slate-300 font-medium mt-2">Top performing teams across all hackathons.</p>
        </div>
      </div>

      {top3.length >= 2 && (
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl" />
          <h3 className="font-black text-lg mb-8 flex items-center gap-2 relative z-10"><Trophy size={20} className="text-yellow-400" />Top 3 Teams</h3>
          <div className="flex items-end gap-6 h-52 relative z-10">
            {podiumOrder.map((p, i) => (
              <motion.div key={p.rank} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.15 }} className="flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${p.c} flex items-center justify-center font-black text-xl shadow-xl z-10 -mb-7 border-4 border-indigo-900`}>{p.rank}</div>
                <div className={`w-32 ${p.h} bg-white/10 backdrop-blur-md rounded-t-2xl border-t border-x border-white/20 flex flex-col items-center justify-end pb-4 px-2`}>
                  <p className={`font-bold text-sm text-center ${p.tc}`}>{p.team}</p>
                  <p className="text-xs text-slate-400 mt-1">{parseFloat(p.score).toFixed(1)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-sm font-bold text-slate-500 flex items-center gap-1.5"><Filter size={14} />Filter:</span>
        {eventNames.map(e => (
          <button key={e} onClick={() => setEv(e)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${ev === e ? "bg-sky-500 text-white shadow-md" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >{e}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold">Loading rankings...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>{["Rank", "Team", "Event", "Track", "Score", "Points"].map(h => <th key={h} className="table-head">{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.map((t, i) => (
                  <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${i === 0 ? "bg-yellow-50/40" : ""}`}
                  >
                    <td className="table-cell">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm ${rankCls[t.rank] || "bg-slate-50 text-slate-400 border border-slate-200"}`}>{t.rank}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-black text-sm">{t.team?.[0]}</div>
                        <div><p className="font-extrabold text-slate-900">{t.team}</p><p className="text-xs text-slate-400">{t.members} members</p></div>
                      </div>
                    </td>
                    <td className="table-cell text-sm font-semibold text-slate-500">{t.event}</td>
                    <td className="table-cell"><span className="badge-sky">{t.track}</span></td>
                    <td className="table-cell font-black text-slate-900 text-right text-lg">{parseFloat(t.score).toFixed(1)}</td>
                    <td className="table-cell text-right">
                      <span className="inline-flex items-center gap-1 font-black text-sky-500 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg">
                        <Star size={12} className="fill-sky-500" />{t.pts}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-semibold">No rankings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
