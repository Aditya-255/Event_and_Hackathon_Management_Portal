import React, { useEffect, useState } from "react";
import { Activity, Calendar, Clock, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLeaderboard from "../leaderboard/DashboardLeaderboard";
import { teamsAPI, eventsAPI } from "../../lib/api";

export default function ParticipantDashboard() {
  const [myTeams,     setMyTeams]     = useState([]);
  const [activeEvent, setActiveEvent] = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      teamsAPI.getAll().catch(() => ({ data: [] })),
      eventsAPI.getAll({ status: "Active" }).catch(() => ({ data: [] })),
    ]).then(([teamsRes, eventsRes]) => {
      setMyTeams(teamsRes.data);
      setActiveEvent(eventsRes.data[0] || null);
    }).finally(() => setLoading(false));
  }, []);

  const myTeam = myTeams[0];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-52 shadow-lg">
        <img
          src={activeEvent?.image_url || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"}
          alt="banner" className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-900/30" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <p className="text-xs font-bold text-sky-400 bg-sky-500/20 border border-sky-500/30 px-3 py-1 rounded-full w-max mb-3 backdrop-blur-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {activeEvent ? "Live Event" : "No Active Events"}
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
            {activeEvent?.title || "EventHub Platform"}
          </h2>
          <p className="text-slate-300 font-medium text-sm">
            {activeEvent?.location || "Browse events to get started"}
          </p>
        </div>
        {activeEvent && (
          <Link to={`/events/${activeEvent.id}`}
            className="absolute right-6 bottom-6 flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-all"
          >View Event<ArrowRight size={15} /></Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">My Teams</h3>
          </div>
          <div className="space-y-3">
            {[
              { l: "Teams Registered", v: loading ? "..." : myTeams.length },
              { l: "Submitted",        v: loading ? "..." : myTeams.filter(t => t.status !== "Registered").length },
            ].map(x => (
              <div key={x.l} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium text-sm">{x.l}</span>
                <span className="font-black text-xl text-slate-900">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0EA5E9 100%)" }}>
          <div className="absolute top-4 right-4 opacity-10"><Clock size={70} /></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Calendar size={18} className="text-sky-400" />
            </div>
            <h3 className="text-sm font-bold">Next Deadline</h3>
          </div>
          <div className="text-2xl font-black mb-1 relative z-10 tracking-tight">
            {activeEvent?.end_date
              ? new Date(activeEvent.end_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
              : "No active event"}
          </div>
          <p className="text-slate-400 text-xs font-medium mb-5 relative z-10">
            {activeEvent ? activeEvent.title : "Browse events below"}
          </p>
          <Link to="/dashboard/register-team"
            className="relative z-10 block w-full text-center py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg hover:shadow-sky-500/25 transition-all"
          >Register Team</Link>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Trophy size={18} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-700">My Team</h3>
          </div>
          <div className="space-y-3">
            {[
              { l: "Team Name",  v: loading ? "..." : (myTeam?.name || "Not registered") },
              { l: "Best Score", v: loading ? "..." : (myTeam?.score ? parseFloat(myTeam.score).toFixed(1) : "N/A") },
            ].map(x => (
              <div key={x.l} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium text-sm">{x.l}</span>
                <span className="font-black text-slate-900 text-sm">{x.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DashboardLeaderboard />
    </div>
  );
}
