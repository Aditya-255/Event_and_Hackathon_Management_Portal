import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, Filter, MoreVertical, Mail, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = ['All', 'Admin', 'Organizer', 'Participant', 'Judge'];
const STATUSES = ['All', 'Active', 'Pending', 'Deactivated'];

const initialUsers = [
  { id: 1, name: 'Aditya Patel', email: 'aditya@rku.edu', role: 'Organizer', org: 'RK University', status: 'Active', joined: 'Jan 2026' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'Participant', org: 'Code Club', status: 'Active', joined: 'Feb 2026' },
  { id: 3, name: 'Priya Mehta', email: 'priya@tech.org', role: 'Judge', org: 'Tech Inc.', status: 'Pending', joined: 'Mar 2026' },
  { id: 4, name: 'Karan Singh', email: 'karan@rku.edu', role: 'Participant', org: 'RK University', status: 'Active', joined: 'Jan 2026' },
  { id: 5, name: 'Sneha Joshi', email: 'sneha@design.co', role: 'Organizer', org: 'Design Co.', status: 'Active', joined: 'Dec 2025' },
  { id: 6, name: 'Amit Kumar', email: 'amit@startup.io', role: 'Participant', org: 'Startup IO', status: 'Deactivated', joined: 'Nov 2025' },
];

const roleColors = {
  Admin: 'bg-rose-50 text-rose-600 border-rose-200',
  Organizer: 'bg-violet-50 text-violet-600 border-violet-200',
  Participant: 'bg-sky-50 text-sky-600 border-sky-200',
  Judge: 'bg-amber-50 text-amber-600 border-amber-200',
};

const statusColors = {
  Active: 'text-emerald-600',
  Pending: 'text-amber-500',
  Deactivated: 'text-red-500',
};

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  }), [users, search, roleFilter, statusFilter]);

  const openEdit = (user) => { setEditUser({ ...user }); setShowModal(true); };
  const openCreate = () => { setEditUser({ id: Date.now(), name: '', email: '', role: 'Participant', org: '', status: 'Active', joined: 'Mar 2026' }); setShowModal(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (users.find(u => u.id === editUser.id)) {
      setUsers(users.map(u => u.id === editUser.id ? editUser : u));
    } else {
      setUsers([...users, editUser]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { setUsers(users.filter(u => u.id !== id)); setOpenMenu(null); };
  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u));
    setOpenMenu(null);
  };

  const stats = [
    { label: 'Total Users', value: users.length, color: 'from-sky-500 to-cyan-500', bg: 'bg-sky-50' },
    { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
    { label: 'Pending', value: users.filter(u => u.status === 'Pending').length, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { label: 'Organizers', value: users.filter(u => u.role === 'Organizer').length, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">User Management</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Manage all platform users and their roles</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all text-sm"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
              <Shield size={18} className="text-white" />
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ROLES.map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${roleFilter === r ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >{r}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'bg-violet-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-black text-slate-900">All Users</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{filtered.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['User', 'Role', 'Organization', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-violet-500/20 text-sky-600 flex items-center justify-center font-black text-sm border border-sky-200/50">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1"><Mail size={10} />{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${roleColors[u.role] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>{u.role}</span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-600">{u.org}</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 text-xs font-bold ${statusColors[u.status]}`}>
                      {u.status === 'Active' ? <CheckCircle size={13} /> : u.status === 'Pending' ? <div className="w-3 h-3 rounded-full border-2 border-amber-400" /> : <XCircle size={13} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-slate-400">{u.joined}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => toggleStatus(u.id)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                        {u.status === 'Active' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-semibold">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-sky-50 to-violet-50">
              <h2 className="text-lg font-black text-slate-900">{users.find(u => u.id === editUser.id) ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition-colors"><XCircle size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[['Full Name', 'name', 'text', 'Aditya Patel'], ['Email', 'email', 'email', 'user@example.com'], ['Organization', 'org', 'text', 'RK University']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}</label>
                  <input required type={type} value={editUser[key]} onChange={e => setEditUser({ ...editUser, [key]: e.target.value })}
                    placeholder={ph}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none transition-all"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Role</label>
                  <select value={editUser.role} onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none bg-white transition-all"
                  >
                    {['Admin', 'Organizer', 'Participant', 'Judge'].map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select value={editUser.status} onChange={e => setEditUser({ ...editUser, status: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 outline-none bg-white transition-all"
                  >
                    {['Active', 'Pending', 'Deactivated'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 font-bold text-white rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg hover:shadow-sky-500/25 transition-all text-sm">Save User</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
