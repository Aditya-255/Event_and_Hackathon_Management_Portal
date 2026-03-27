import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users, Trophy, XCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const initialEvents = [
  { id: 1, title: 'Spring Hackathon 2026', status: 'Active', participants: 124, teams: 24, prize: '₹95,000', date: 'Mar 27–28', category: 'Tech' },
  { id: 2, title: 'UI/UX Design Sprint', status: 'Upcoming', participants: 45, teams: 12, prize: '₹20,000', date: 'Apr 5', category: 'Design' },
  { id: 3, title: 'AI Challenge 2026', status: 'Draft', participants: 0, teams: 0, prize: '₹50,000', date: 'May 10', category: 'AI/ML' },
  { id: 4, title: 'Winter Ideathon 2025', status: 'Completed', participants: 200, teams: 45, prize: '₹75,000', date: 'Dec 15', category: 'Open' },
];

const statusStyle = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Upcoming: 'bg-amber-50 text-amber-600 border-amber-200',
  Draft: 'bg-slate-50 text-slate-500 border-slate-200',
  Completed: 'bg-sky-50 text-sky-600 border-sky-200',
};

export default function AdminEvents() {
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const openCreate = () => {
    setEditEvent({ id: Date.now(), title: '', status: 'Draft', participants: 0, teams: 0, prize: '₹0', date: '', category: 'Tech' });
    setShowModal(true);
  };
  const openEdit = (ev) => { setEditEvent({ ...ev }); setShowModal(true); };
  const handleDelete = (id) => setEvents(events.filter(e => e.id !== id));
  const handleSave = (e) => {
    e.preventDefault();
    if (events.find(ev => ev.id === editEvent.id)) {
      setEvents(events.map(ev => ev.id === editEvent.id ? editEvent : ev));
    } else {
      setEvents([...events, editEvent]);
    }
    setShowModal(false);
  };

  const stats = [
    { label: 'Total Events', value: events.length, color: 'from-sky-500 to-cyan-500' },
    { label: 'Active', value: events.filter(e => e.status === 'Active').length, color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Participants', value: events.reduce((a, e) => a + e.participants, 0), color: 'from-violet-500 to-purple-600' },
    { label: 'Total Teams', value: events.reduce((a, e) => a + e.teams, 0), color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Event Management</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Create and manage all platform events</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all text-sm"
        >
          <Plus size={16} /> Create Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <Calendar size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {events.map((ev, i) => (
          <motion.div key={ev.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border mb-2 ${statusStyle[ev.status]}`}>{ev.status}</span>
                  <h3 className="font-black text-slate-900 text-base">{ev.title}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1"><Calendar size={11} /> {ev.date} · {ev.category}</p>
                </div>
                <div className="flex gap-1">
                  <Link to={`/events/${ev.id}`} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"><Eye size={14} /></Link>
                  <button onClick={() => openEdit(ev)} className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(ev.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Users, label: 'Participants', value: ev.participants },
                  { icon: Users, label: 'Teams', value: ev.teams },
                  { icon: Trophy, label: 'Prize Pool', value: ev.prize },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="font-black text-slate-900 text-sm">{value}</p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && editEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-sky-50 to-violet-50">
              <h2 className="text-lg font-black text-slate-900">{events.find(e => e.id === editEvent.id) ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Event Title</label>
                <input required type="text" value={editEvent.title} onChange={e => setEditEvent({ ...editEvent, title: e.target.value })}
                  placeholder="e.g. Summer Hackathon 2026"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select value={editEvent.status} onChange={e => setEditEvent({ ...editEvent, status: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none bg-white transition-all"
                  >
                    {['Active', 'Upcoming', 'Draft', 'Completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
                  <select value={editEvent.category} onChange={e => setEditEvent({ ...editEvent, category: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none bg-white transition-all"
                  >
                    {['Tech', 'Design', 'AI/ML', 'Open', 'Sustainability'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Date</label>
                  <input type="text" value={editEvent.date} onChange={e => setEditEvent({ ...editEvent, date: e.target.value })}
                    placeholder="e.g. Aug 15–16"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Prize Pool</label>
                  <input type="text" value={editEvent.prize} onChange={e => setEditEvent({ ...editEvent, prize: e.target.value })}
                    placeholder="e.g. ₹50,000"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg hover:shadow-sky-500/25 transition-all text-sm">Save Event</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
