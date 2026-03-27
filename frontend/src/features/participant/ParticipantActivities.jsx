import React from "react";
import {Calendar,CheckCircle,Clock,Zap,Trophy,ArrowRight} from "lucide-react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";

const ACTS=[
  {id:1,event:"Spring Hackathon 2026",status:"Registered",date:"Mar 27–28",project:"Pending Submission",cat:"Tech",score:null,eid:1},
  {id:2,event:"Winter Ideathon 2025",status:"Completed",date:"Dec 15",project:"EcoTrack",cat:"Sustainability",score:92.2,eid:3},
];

export default function ParticipantActivities(){
  return(
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white" style={{background:"linear-gradient(135deg,#0EA5E9 0%,#06B6D4 40%,#8B5CF6 100%)"}}>
        <div className="absolute top-3 right-6 opacity-10"><Zap size={80}/></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-1">My Activities</h2>
          <p className="text-sky-100 text-sm font-medium">Track your ongoing hackathons and past participations.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{l:"Events Joined",v:ACTS.length,icon:Calendar,c:"from-sky-500 to-cyan-500"},{l:"Completed",v:ACTS.filter(a=>a.status==="Completed").length,icon:CheckCircle,c:"from-emerald-500 to-teal-500"},{l:"Best Score",v:"92.2",icon:Trophy,c:"from-amber-500 to-orange-500"}].map(s=>{
          const Icon=s.icon;
          return(
            <div key={s.l} className="stat-card text-center">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.c} flex items-center justify-center mx-auto mb-3`}><Icon size={18} className="text-white"/></div>
              <p className="text-2xl font-black text-slate-900">{s.v}</p>
              <p className="text-xs font-semibold text-slate-400 mt-1">{s.l}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100"><h3 className="font-black text-slate-900">Participation History</h3></div>
        <div className="divide-y divide-slate-100">
          {ACTS.map((a,i)=>(
            <motion.div key={a.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.08}}
              className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${a.status==="Completed"?"bg-emerald-100 text-emerald-600":"bg-sky-100 text-sky-600"}`}>
                  {a.status==="Completed"?<CheckCircle size={22}/>:<Clock size={22}/>}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{a.event}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-400 mt-1.5">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs"><Calendar size={11} className="text-sky-500"/>{a.date}</span>
                    <span className="badge-slate">{a.cat}</span>
                    <span className="text-xs">Project: <span className="text-sky-600 font-semibold">{a.project}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {a.score&&<div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl"><Trophy size={13} className="text-emerald-500"/><span className="font-black text-emerald-700 text-sm">{a.score}</span></div>}
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${a.status==="Completed"?"bg-emerald-50 text-emerald-600 border-emerald-200":"bg-sky-50 text-sky-600 border-sky-200"}`}>
                  {a.status==="Completed"?<CheckCircle size={13}/>:<Clock size={13}/>}{a.status}
                </span>
                <Link to={`/events/${a.eid}`} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-colors"><ArrowRight size={16}/></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
