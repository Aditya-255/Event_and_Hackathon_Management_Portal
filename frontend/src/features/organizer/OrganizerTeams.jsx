import React, { useState } from 'react';
import { Users, Search, CheckCircle, Clock, Trophy, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const teams = [
  { id: 1, name: 'Innovators Hub', captain: 'Aditya Patel', members: 4, event: 'Spring Hackathon 2026', status: 'Submitted', score: 98.5 },
  { id: 2, name: 'Code Crafters', captain: 'Rahul Sharma', members: 3, event: 'Spring Hackathon 2026', status: 'Submitted', score: 95.0 },
  { id: 3, name: 'Data Miners', captain: 'Priya Mehta', members: 4, event: 'Spring Hackathon 2026', status: 'Registered', score: null },
  { id: 4, name: 'Campus Fix', captain: 'Karan Singh', members: 2, event: 'UI/UX Design Sprint', status: 'Submitted', score: 89.0 },
  { id: 5, name: 'Byte Me', captain: 'Sneha Joshi', members: 3, event: 'UI/UX Design Sprint', status: 'Registered', score: null },
];

export default function OrganizerTeams() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All');

  const events = ['All', ...new Set(teams.map(t => t.event))];
  const filtered = teams.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.captain.toLowerCase().includes(search.toLowerCase());
    const matchEvent = eventFilter === 'All' || t.event === eventFilter;
    return matchSearch && matchEvent;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Teams</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">View all registered teams across your events</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Teams', value: teams.length, color: 'from-violet-500 to-purple-600' },
          { label: 'Submitted', value: teams.filter(t => t.status === 'Submitted').length, color: 'from-emerald-500 to-teal-500' },
          { label: 'Registered', value: teams.filter(t => t.status === 'Registered').length, color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <Users size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
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
            {events.map(ev => (
              <button key={ev} onClick={() => setEventFilter(ev)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${eventFilter === ev ? 'bg-violet-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >{ev}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900">Registered Teams</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filtered.length} teams</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Team', 'Captain', 'Members', 'Event', 'Status', 'Score'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-600 flex items-center justify-center font-black text-sm border border-violet-200/50">
                        {t.name.charAt(0)}
                      </div>
                      <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{t.captain}</td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                      <Users size={13} className="text-slate-400" /> {t.members}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-500">{t.event}</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${t.status === 'Submitted' ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {t.status === 'Submitted' ? <CheckCircle size={13} /> : <Clock size={13} />}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {t.score ? (
                      <span className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                        <Trophy size={13} className="text-amber-500" /> {t.score}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Not scored</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
