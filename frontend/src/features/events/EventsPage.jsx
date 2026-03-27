import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, Calendar, Trophy, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { eventsAPI } from "../../lib/api";

const CATS  = ["All", "Tech", "Design", "AI/ML", "Open", "Sustainability"];
const STATS = ["All", "Active", "Upcoming", "Registration Open", "Completed"];

const statusCls = {
  "Active":            "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Registration Open": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Upcoming":          "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Registration Full": "bg-red-500/20 text-red-300 border-red-500/30",
  "Completed":         "bg-slate-500/40 text-slate-300 border-slate-500/30",
  "Event Over":        "bg-slate-500/40 text-slate-300 border-slate-500/30",
};

export default function EventsPage() {
  const [q,       setQ]       = useState("");
  const [cat,     setCat]     = useState("All");
  const [stat,    setStat]    = useState("All");
  const [showF,   setShowF]   = useState(false);
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getAll()
      .then(({ data }) => setEvents(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => events.filter(e => {
    const ms  = e.title?.toLowerCase().includes(q.toLowerCase()) || e.description?.toLowerCase().includes(q.toLowerCase());
    const mc  = cat  === "All" || e.category === cat;
    const ms2 = stat === "All" || e.status   === stat;
    return ms && mc && ms2;
  }), [q, cat, stat, events]);

  const fc = (cat !== "All" ? 1 : 0) + (stat !== "All" ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <p className="text-sky-500 font-bold text-xs uppercase tracking-widest mb-1">Discover</p>
          <h1 className="text-4xl font-black text-slate-900">Explore Events</h1>
          <p className="text-slate-500 font-medium mt-1">Find the next challenge and prove your skills</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search events..." className="input pl-10 pr-10" />
            {q && <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X size={15} /></button>}
          </div>
          <button onClick={() => setShowF(!showF)}
            className={`px-4 py-3 border rounded-xl flex items-center gap-2 font-bold text-sm transition-all ${showF || fc > 0 ? "bg-sky-500 text-white border-sky-500 shadow-md" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            <Filter size={16} /> Filters {fc > 0 && <span className="bg-white text-sky-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">{fc}</span>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showF && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="card p-5 flex flex-col md:flex-row gap-5">
              <div className="flex-1">
                <p className="label">Category</p>
                <div className="flex flex-wrap gap-2">{CATS.map(c => <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${cat === c ? "bg-sky-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{c}</button>)}</div>
              </div>
              <div className="flex-1">
                <p className="label">Status</p>
                <div className="flex flex-wrap gap-2">{STATS.map(s => <button key={s} onClick={() => setStat(s)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${stat === s ? "bg-violet-500 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{s}</button>)}</div>
              </div>
              <div className="flex items-end">
                <button onClick={() => { setCat("All"); setStat("All"); setQ(""); }} className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl border border-red-200 transition-colors">Clear All</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-semibold">Loading events...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-black text-slate-900 mb-2">No Events Found</h3>
          <p className="text-slate-500 font-medium">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ev, i) => {
            const teamsCount = parseInt(ev.teams_count || 0);
            const maxTeams   = parseInt(ev.max_teams || 50);
            const pct        = maxTeams > 0 ? Math.round((teamsCount / maxTeams) * 100) : 0;
            return (
              <motion.div key={ev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col border border-slate-200"
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <img src={ev.image_url || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800"} alt={ev.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/50 to-slate-900/92" />
                </div>
                <div className="relative z-10 flex justify-between items-start p-5">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black backdrop-blur-md border ${statusCls[ev.status] || "bg-sky-500/20 text-sky-300 border-sky-500/30"}`}>{ev.status}</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 text-white backdrop-blur-md border border-white/10">{ev.category}</span>
                </div>
                <div className="mt-auto relative z-10">
                  <div className="m-3 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white group-hover:bg-white/15 transition-all">
                    <h3 className="text-xl font-extrabold mb-1">{ev.title}</h3>
                    <p className="text-slate-300 text-sm font-medium mb-4 line-clamp-2">{ev.description}</p>
                    {ev.status !== "Completed" && ev.status !== "Event Over" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                          <span>{teamsCount}/{maxTeams} teams</span>
                          <span>{pct}% full</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 100 ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-semibold text-slate-200 border-t border-white/10 pt-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {ev.start_date ? new Date(ev.start_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD"}
                      </span>
                      <span className="flex items-center gap-1.5"><Trophy size={14} />{ev.prize || "—"}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/events/${ev.id}`} className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40">
                  <div className="bg-sky-500 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">
                    View Event<ChevronRight size={18} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
