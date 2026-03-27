import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, Zap, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { teamsAPI } from "../../lib/api";

export default function ParticipantActivities() {
  const [teams,   setTeams]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamsAPI.getAll()
      .then(({ data }) => setTeams(data || []))
      .catch(() => setTeams([]))
      .finally(() => setLoading(false));
  }, []);

  const bestScore = teams.reduce((best, t) => {
    const s = parseFloat(t.score);
    return s > best ? s : best;
  }, 0);

  const statCards = [
    { l: "Events Joined", v: loading ? "…" : teams.length,                                          icon: Calendar,     c: "from-sky-500 to-cyan-500" },
    { l: "Completed",     v: loading ? "…" : teams.filter(t => t.status === "Evaluated").length,    icon: CheckCircle,  c: "from-emerald-500 to-teal-500" },
    { l: "Best Score",    v: loading ? "…" : (bestScore > 0 ? bestScore.toFixed(1) : "N/A"),        icon: Trophy,       c: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white"
        style={{ background: "linear-gradient(135deg,#0EA5E9 0%,#06B6D4 40%,#8B5CF6 100%)" }}>
        <div className="absolute top-3 right-6 opacity-10"><Zap size={80} /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">My Activities</h2>
          <p className="text-sky-100 text-sm font-medium">Track your ongoing hackathons and past participations.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.l} className="stat-card text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center mx-auto mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-slate-900">{s.v}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">{s.l}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-900">Participation History</h3>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold">Loading activities...</div>
        ) : teams.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-semibold">No activities yet. Register for an event!</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {teams.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
                className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.status === "Evaluated" ? "bg-emerald-100 text-emerald-600" : "bg-sky-100 text-sky-600"}`}>
                    {t.status === "Evaluated" ? <CheckCircle size={22} /> : <Clock size={22} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{t.event_title || "Event"}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs">
                        <Calendar size={11} className="text-sky-500" />
                        {t.created_at ? new Date(t.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </span>
                      <span className="badge-slate">{t.tier}</span>
                      <span className="text-xs">Team: <span className="text-sky-600 font-semibold">{t.name}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {t.score && (
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <Trophy size={13} className="text-emerald-500" />
                      <span className="font-black text-emerald-700 text-sm">{parseFloat(t.score).toFixed(1)}</span>
                    </div>
                  )}
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${t.status === "Evaluated" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-sky-50 text-sky-600 border-sky-200"}`}>
                    {t.status === "Evaluated" ? <CheckCircle size={13} /> : <Clock size={13} />}
                    {t.status}
                  </span>
                  {t.event_id && (
                    <Link to={`/events/${t.event_id}`} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-colors">
                      <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
