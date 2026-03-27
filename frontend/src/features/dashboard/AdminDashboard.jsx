import React from "react";
import {Users,Calendar,TrendingUp,Trophy,ArrowRight,Activity,Shield} from "lucide-react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import DashboardLeaderboard from "../leaderboard/DashboardLeaderboard";

const STATS=[
  {label:"Total Users",value:"3",sub:"+3 this week",color:"from-sky-500 to-cyan-500",icon:Users},
  {label:"Active Events",value:"2",sub:"Running now",color:"from-emerald-500 to-teal-500",icon:Calendar},
  {label:"Revenue",value:"₹1.2M",sub:"8% platform fee",color:"from-violet-500 to-purple-600",icon:TrendingUp},
  {label:"Total Teams",value:"36",sub:"Across all events",color:"from-amber-500 to-orange-500",icon:Trophy},
];
const LINKS=[
  {label:"Manage Users",desc:"Add, edit, control roles",path:"/dashboard/admin/users",icon:Users,color:"from-sky-500 to-cyan-500"},
  {label:"Manage Events",desc:"Create and oversee events",path:"/dashboard/admin/events",icon:Calendar,color:"from-violet-500 to-purple-600"},
  {label:"Leaderboards",desc:"View event rankings",path:"/dashboard/admin/leaderboards",icon:Trophy,color:"from-amber-500 to-orange-500"},
  {label:"Settings",desc:"Configure platform",path:"/dashboard/admin/settings",icon:Activity,color:"from-rose-500 to-pink-600"},
];

export default function AdminDashboard(){
  return(
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-8 text-white shadow-xl" style={{background:"linear-gradient(135deg,#0F172A 0%,#1E293B 40%,#0EA5E9 100%)"}}>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 70% 50%,rgba(139,92,246,.4) 0%,transparent 60%)"}}/>
        <div className="absolute top-4 right-8 opacity-10"><Shield size={120}/></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>System Online</div>
            <h1 className="text-3xl font-black">System Administration</h1>
            <p className="text-sky-200 font-medium mt-1">Full platform control and oversight.</p>
          </div>
          <div className="flex gap-3">
            {[{v:"3",l:"Users"},{v:"2",l:"Events"}].map(x=>(
              <div key={x.l} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <p className="text-2xl font-black">{x.v}</p><p className="text-xs text-sky-200 font-bold">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s,i)=>{const Icon=s.icon;return(
          <motion.div key={s.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.07}} className="stat-card">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}><Icon size={18} className="text-white"/></div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">{s.label}</p>
            <p className="text-[10px] font-bold text-slate-300 mt-1">{s.sub}</p>
          </motion.div>
        );})}
      </div>

      <div>
        <h2 className="font-black text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LINKS.map((ql,i)=>{const Icon=ql.icon;return(
            <motion.div key={ql.label} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.08}}>
              <Link to={ql.path} className="flex flex-col p-5 card hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ql.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}><Icon size={20} className="text-white"/></div>
                <p className="font-black text-slate-900 text-sm mb-1">{ql.label}</p>
                <p className="text-xs text-slate-400 font-medium flex-1">{ql.desc}</p>
                <div className="flex items-center gap-1 text-xs font-bold text-sky-500 mt-3 group-hover:gap-2 transition-all">Go<ArrowRight size={12}/></div>
              </Link>
            </motion.div>
          );})}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2"><Activity size={16} className="text-sky-500"/>System Status</h3>
          <div className="space-y-4">
            {[{l:"CPU Usage",v:42,c:"from-sky-500 to-cyan-500"},{l:"Memory",v:30,c:"from-violet-500 to-purple-500"},{l:"Storage",v:45,c:"from-emerald-500 to-teal-500"}].map(x=>(
              <div key={x.l}>
                <div className="flex justify-between text-xs font-bold mb-1.5"><span className="text-slate-400">{x.l}</span><span className="text-slate-700">{x.v}%</span></div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className={`bg-gradient-to-r ${x.c} h-2 rounded-full`} style={{width:`${x.v}%`}}/></div>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"/><span className="text-xs font-bold text-emerald-600">All systems operational</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2"><DashboardLeaderboard eventName="Spring Hackathon 2026"/></div>
      </div>
    </div>
  );
}
