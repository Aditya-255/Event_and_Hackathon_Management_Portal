import React, { useEffect, useState } from "react";
import { Calendar, Users, TrendingUp, Gavel, ArrowRight, BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLeaderboard from "../leaderboard/DashboardLeaderboard";
import { eventsAPI, teamsAPI, abstractsAPI } from "../../lib/api";

const LINKS = [
  { label: "My Events", desc: "Create and manage events",  path: "/dashboard/organizer/events",  icon: Calendar, color: "from-violet-500 to-purple-600" },
  { label: "Teams",     desc: "View registered teams",     path: "/dashboard/organizer/teams",   icon: Users,    color: "from-sky-500 to-cyan-500" },
  { label: "Judging",   desc: "Evaluate submissions",      path: "/dashboard/organizer/judging", icon: Gavel,    color: "from-amber-500 to-orange-500" },
  { label: "Leaderboard", desc: "View event rankings",     path: "/leaderboard",                 icon: BarChart3, color: "from-emerald-500 to-teal-500" },
];

export default function OrganizerDashboard() {
  const [stats,    setStats]    = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    Promise.all([
      eventsAPI.getAll().catch(() => ({ data: [] })),
      teamsAPI.getAll().catch(() => ({ data: [] })),
      abstractsAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([evRes, teamsRes, absRes]) => {
      const events    = evRes.data    || [];
      const teams     = teamsRes.data || [];
      const abstracts = absRes.data   || [];
      setStats({
        activeEvents:  events.filter(e => e.status === 'Active').length,
        totalTeams:    teams.length,
        pendingEvals:  abstracts.filter(a => a.status === 'Pending').length,
        totalAbstracts: abstracts.length,
      });
      // Build recent activity from teams + abstracts
      const acts = [
        ...teams.slice(0, 3).map(t => ({
          text: `Team "${t.name}" registered for ${t.event_title || 'an event'}`,
          time: t.created_at ? new Date(t.created_at).toLocaleDateString('en-IN') : '',
          c: "bg-sky-50 text-sky-500 border-sky-100",
        })),
        ...abstracts.slice(0, 2).map(a => ({
          text: `"${a.team_name || 'A team'}" submitted abstract: ${a.project_name}`,
          time: a.created_at ? new Date(a.created_at).toLocaleDateString('en-IN') : '',
          c: "bg-violet-50 text-violet-500 border-violet-100",
        })),
      ].slice(0, 5);
      setActivity(acts);
    });
  }, []);

  const statCards = [
    { label: "Active Events",  value: stats?.activeEvents  ?? "—", sub: "Running now",     color: "from-violet-500 to-purple-600", icon: Calendar },
    { label: "Total Teams",    value: stats?.totalTeams    ?? "—", sub: "Registered",       color: "from-sky-500 to-cyan-500",      icon: Users },
    { label: "Abstracts",      value: stats?.totalAbstracts ?? "—", sub: "Submitted",       color: "from-emerald-500 to-teal-500",  icon: TrendingUp },
    { label: "Pending Evals",  value: stats?.pendingEvals  ?? "—", sub: "Need attention",   color: "from-amber-500 to-orange-500",  icon: Gavel },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-8 text-white shadow-xl"
        style={{ background: "linear-gradient(135deg,#7C3AED 0%,#6D28D9 40%,#0EA5E9 100%)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 80% 50%,rgba(255,255,255,.3) 0%,transparent 60%)" }} />
        <div className="absolute top-4 right-8 opacity-10"><BarChart3 size={120} /></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-3 py-1 rounded-full text-xs font-bold mb-3">📊 Organizer Panel</div>
            <h1 className="text-3xl font-black">Event Management</h1>
            <p className="text-violet-100 font-medium mt-1">Monitor and manage your hackathon events.</p>
          </div>
          <Link to="/dashboard/organizer/events"
            className="flex items-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/25 transition-all text-sm"
          ><Plus size={16} />Create Event</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
              <p className="text-[10px] font-bold text-slate-300 mt-1">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div>
        <h2 className="font-black text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LINKS.map((ql, i) => {
            const Icon = ql.icon;
            return (
              <motion.div key={ql.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={ql.path} className="flex flex-col p-5 card hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ql.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="font-black text-slate-900 text-sm mb-1">{ql.label}</p>
                  <p className="text-xs text-slate-400 font-medium flex-1">{ql.desc}</p>
                  <div className="flex items-center gap-1 text-xs font-bold text-violet-500 mt-3 group-hover:gap-2 transition-all">
                    Go <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-black text-slate-900 mb-5">Recent Activity</h3>
          {activity.length === 0 ? (
            <p className="text-slate-400 text-sm font-medium text-center py-6">No recent activity yet.</p>
          ) : (
            <div className="space-y-4">
              {activity.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${a.c}`}>
                    <Users size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{a.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <DashboardLeaderboard />
        </div>
      </div>
    </div>
  );
}
