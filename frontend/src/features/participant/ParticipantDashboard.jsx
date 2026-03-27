import React from "react";
import {Activity,Calendar,Clock,Trophy,Users,ArrowRight} from "lucide-react";
import {Link} from "react-router-dom";
import DashboardLeaderboard from "../leaderboard/DashboardLeaderboard";

export default function ParticipantDashboard(){
  return(
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden h-52 shadow-lg">
        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" alt="banner" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-sky-900/30"/>
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <p className="text-xs font-bold text-sky-400 bg-sky-500/20 border border-sky-500/30 px-3 py-1 rounded-full w-max mb-3 backdrop-blur-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>Live Event
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Spring Hackathon 2026</h2>
          <p className="text-slate-300 font-medium text-sm">RK University · March 27–28</p>
        </div>
        <Link to="/events/1" className="absolute right-6 bottom-6 flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl text-sm hover:bg-white/20 transition-all">
          View Event<ArrowRight size={15}/>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center"><Activity size={18} className="text-white"/></div>
            <h3 className="text-sm font-bold text-slate-700">Event Stats</h3>
          </div>
          <div className="space-y-3">
            {[{l:"Total Teams",v:"24"},{l:"Submissions",v:"18/24"}].map(x=>(
              <div key={x.l} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium text-sm">{x.l}</span>
                <span className="font-black text-xl text-slate-900">{x.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-lg text-white relative overflow-hidden" style={{background:"linear-gradient(135deg,#0F172A 0%,#1E293B 60%,#0EA5E9 100%)"}}>
          <div className="absolute top-4 right-4 opacity-10"><Clock size={70}/></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20"><Calendar size={18} className="text-sky-400"/></div>
            <h3 className="text-sm font-bold">Code Freeze</h3>
          </div>
          <div className="text-4xl font-black mb-1 relative z-10 tracking-tight">14:22:10</div>
          <p className="text-slate-400 text-xs font-medium mb-5 relative z-10">Remaining until deadline</p>
          <Link to="/dashboard/register-team" className="relative z-10 block w-full text-center py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg hover:shadow-sky-500/25 transition-all">
            Register Team
          </Link>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"><Trophy size={18} className="text-white"/></div>
            <h3 className="text-sm font-bold text-slate-700">My Team</h3>
          </div>
          <div className="space-y-3">
            {[{l:"Team Name",v:"CodeCrafters"},{l:"Current Rank",v:"#2"}].map(x=>(
              <div key={x.l} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 font-medium text-sm">{x.l}</span>
                <span className="font-black text-slate-900 text-sm">{x.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DashboardLeaderboard eventName="Spring Hackathon 2026"/>
    </div>
  );
}
