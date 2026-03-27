import React, { useState, useEffect, useCallback } from 'react';
import { Users, Search, CheckCircle, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { teamsAPI } from '../../lib/api';

export default function OrganizerTeams() {
  const [teams,       setTeams]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [eventFilter, setEventFilter] = useState('All');

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try { const { data } = await teamsAPI.getAll(); setTeams(data); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTeams(); }, [fetchTeams]);

  const eventNames = ['All', ...new Set(teams.map(t => t.event_title).filter(Boolean))];

  const filtered = teams.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
                        t.captain_name?.toLowerCase().includes(search.toLowerCase());
    const matchEvent  = eventFilter === 'All' || t.event_title === eventFilter;
    return matchSearch && matchEvent;
  });

  const statCards = [
    { label: 'Total Teams', value: teams.length,                                          color: 'from-violet-500 to-purple-600' },
    { label: 'Submitted',   value: teams.filter(t => t.status === 'Submitted').length,   color: 'from-emerald-500 to-teal-500' },
    { label: 'Evaluated',   value: teams.filter(t => t.status === 'Evaluated').length,   color: 'from-sky-500 to-cyan-500' },
    { label: 'Registered',  value: teams.filter(t => t.status === 'Registered').length,  color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Teams</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">View all registered teams across your events</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <Users size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search teams or captains..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {eventNames.map(ev => (
              <button key={ev} onClick={() => setEventFilter(ev)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${eventFilter === ev ? 'bg-violet-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >{ev}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900">Registered Teams</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filtered.length} teams</span>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400 font-semibold">Loading teams...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>{['Team', 'Captain', 'Members', 'Event', 'Status', 'Score'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-600 flex items-center justify-center font-black text-sm border border-violet-200/50">
                          {t.name?.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">{t.captain_name || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Users size={13} className="text-slate-400" /> {t.members}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">{t.event_title || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-bold ${t.status === 'Submitted' || t.status === 'Evaluated' ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {t.status === 'Registered' ? <Clock size={13} /> : <CheckCircle size={13} />}
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {t.score ? (
                        <span className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                          <Trophy size={13} className="text-amber-500" /> {parseFloat(t.score).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Not scored</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-semibold">No teams found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
