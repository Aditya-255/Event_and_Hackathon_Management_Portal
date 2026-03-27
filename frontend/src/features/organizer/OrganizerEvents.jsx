import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users, Trophy, XCircle, TrendingUp, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const initialEvents = [
  { id: 1, title: 'Spring Hackathon 2026', status: 'Active', participants: 124, teams: 24, prize: '₹95,000', date: 'Mar 27–28', category: 'Tech', revenue: '₹25,000' },
  { id: 2, title: 'UI/UX Design Sprint', status: 'Upcoming', participants: 45, teams: 12, prize: '₹20,000', date: 'Apr 5', category: 'Design', revenue: '₹4,500' },
  { id: 3, title: 'AI Workshop', status: 'Draft', participants: 0, teams: 0, prize: '₹30,000', date: 'TBD', category: 'AI/ML', revenue: '₹0' },
];

const statusStyle = {
  Active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Upcoming: 'bg-amber-50 text-amber-600 border-amber-200',
  Draft: 'bg-slate-50 text-slate-500 border-slate-200',
  Completed: 'bg-sky-50 text-sky-600 border-sky-200',
};

export default function OrganizerEvents() {
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const openCreate = () => {
    setEditEvent({ id: Date.now(), title: '', status: 'Draft', participants: 0, teams: 0, prize: '₹0', date: '', category: 'Tech', revenue: '₹0' });
    setShowModal(true);
  };
  const openEdit = (ev) => { setEditEvent({ ...ev }); setShowModal(true); };
  const handleDelete = (id) => { if (window.confirm('Delete this event?')) setEvents(events.filter(e => e.id !== id)); };
  const handleSave = (e) => {
    e.preventDefault();
    if (events.find(ev => ev.id === editEvent.id)) {
      setEvents(events.map(ev => ev.id === editEvent.id ? editEvent : ev));
    } else {
      setEvents([...events, editEvent]);
    }
    setShowModal(false);
  };

  const totalRevenue = events.reduce((a, e) => a + parseInt(e.revenue.replace(/[^0-9]/g, '') || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Events</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Manage your hackathon events</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all text-sm"
        >
          <Plus size={16} /> New Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: events.length, icon: Calendar, color: 'from-violet-500 to-purple-600' },
          { label: 'Active', value: events.filter(e => e.status === 'Active').length, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
          { label: 'Participants', value: events.reduce((a, e) => a + e.participants, 0), icon: Users, color: 'from-sky-500 to-cyan-500' },
          { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: Trophy, color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900">Event List</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{events.length} events</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Event', 'Status', 'Date', 'Teams', 'Revenue', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {events.map((ev, i) => (
                <motion.tr key={ev.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900 text-sm">{ev.title}</p>
                    <p className="text-xs text-slate-400 font-medium">{ev.category}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusStyle[ev.status]}`}>{ev.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{ev.date}</td>
                  <td className="px-5 py-4 font-bold text-slate-700">{ev.teams}</td>
                  <td className="px-5 py-4 font-bold text-slate-700">{ev.revenue}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link to={`/events/${ev.id}`} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"><Eye size={14} /></Link>
                      <button onClick={() => openEdit(ev)} className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(ev.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && editEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-violet-50 to-purple-50">
              <h2 className="text-lg font-black text-slate-900">{events.find(e => e.id === editEvent.id) ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Event Title</label>
                <input required type="text" value={editEvent.title} onChange={e => setEditEvent({ ...editEvent, title: e.target.value })}
                  placeholder="e.g. Summer Hackathon"
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select value={editEvent.status} onChange={e => setEditEvent({ ...editEvent, status: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none bg-white transition-all"
                  >
                    {['Active', 'Upcoming', 'Draft', 'Completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Date</label>
                  <input type="text" value={editEvent.date} onChange={e => setEditEvent({ ...editEvent, date: e.target.value })}
                    placeholder="e.g. Aug 15"
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg hover:shadow-violet-500/25 transition-all text-sm">Save Event</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
