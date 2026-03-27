import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {Trophy,Calendar,Users,ChevronRight,Award,ArrowRight,Zap,Star,Code2,Globe,CheckCircle} from "lucide-react";
import {motion} from "framer-motion";
import axios from "axios";

const PAST=[
  {id:3,title:"InnovateRKU Winter 2025",winner:"Team Alpha (CS)",score:94.5},
  {id:4,title:"Sustainable Tech Challenge",winner:"Eco-Warriors (ME)",score:91.2},
];
const STATS=[{v:"120+",l:"Events Hosted",e:"🏆"},{v:"4,800+",l:"Teams",e:"👥"},{v:"₹25L+",l:"Prize Money",e:"💰"},{v:"60+",l:"Institutions",e:"🏛️"}];
const FEATURES=[
  {icon:Code2,title:"Team Registration",desc:"Unique team handling with captain & member management",c:"from-sky-500 to-cyan-500"},
  {icon:Globe,title:"Role-Aware Dashboards",desc:"Separate views for participants, judges, and admins",c:"from-violet-500 to-purple-600"},
  {icon:Trophy,title:"Live Leaderboards",desc:"Real-time score visibility with ranking and sorting",c:"from-amber-500 to-orange-500"},
  {icon:CheckCircle,title:"Abstract Submission",desc:"Upload PPT/PDF and track review status instantly",c:"from-emerald-500 to-teal-500"},
];

export default function LandingPage(){
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch dynamic events from PostgreSQL backend
    axios.get("http://localhost:5000/api/events")
      .then(res => setEvents(res.data.filter(e => e.status !== "Event Over").slice(0, 4)))
      .catch(err => console.error("Failed to fetch events from backend:", err));
  }, []);

  return(
    <div className="pb-20">
      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1600" alt="Hero" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/75 to-transparent"/>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"/>
        <div className="absolute top-32 right-12 hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-4 text-white shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"><Trophy size={20}/></div>
          <div><p className="text-xs text-white/60 font-medium">Top Prize</p><p className="font-black text-lg">₹50,000</p></div>
        </div>
        <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="relative z-10 max-w-3xl px-8 md:px-16 py-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Zap size={14} className="text-yellow-300"/>3 events live right now
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05] mb-6 drop-shadow-xl">
            The Platform for<br/><span className="gradient-text">Serious Hackathons</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-xl">EventHub powers end-to-end hackathon management — from team registration and live judging to real-time leaderboards.</p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/events" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl shadow-xl shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all text-lg">Explore Events<ChevronRight size={20}/></Link>
            <Link to="/leaderboard" className="px-8 py-4 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">View Leaderboard</Link>
          </div>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Stats */}
        <section className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s,i)=>(
              <motion.div key={s.l} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}
                className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-3">{s.e}</div>
                <div className="text-3xl font-black text-slate-900">{s.v}</div>
                <div className="text-sm font-semibold text-slate-500 mt-1">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Active Events */}
        <section className="mb-20">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-sky-500 font-bold text-xs uppercase tracking-widest mb-1">Live Now</p>
              <h2 className="text-3xl font-black text-slate-900">Active Events</h2>
              <p className="text-slate-500 font-medium mt-1">Register before spots fill up</p>
            </div>
            <Link to="/events" className="text-sky-500 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm">View All<ArrowRight size={16}/></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev,i)=>(
              <motion.div key={ev.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.15}}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 min-h-[320px] flex flex-col border border-slate-200"
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
                  <img src={ev.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'} alt={ev.title} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/50 to-slate-900/90"/>
                </div>
                <div className="relative z-10 flex justify-between items-start p-5">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black backdrop-blur-md border ${ev.status==="Registration Open"?"bg-emerald-500/20 text-emerald-300 border-emerald-500/30":"bg-amber-500/20 text-amber-200 border-amber-500/30"}`}>{ev.status}</span>
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-black/40 text-white backdrop-blur-md border border-white/10">{ev.category}</span>
                </div>
                <div className="mt-auto relative z-10">
                  <div className="m-3 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                    <h3 className="text-xl font-extrabold mb-1">{ev.title}</h3>
                    <div className="flex justify-between items-center text-sm font-semibold text-slate-200 border-t border-white/10 pt-4 mt-3">
                      <span className="flex items-center gap-2"><Calendar size={15}/>{ev.date}</span>
                      <span className="flex items-center gap-2"><Users size={15}/>{ev.teams} teams</span>
                      <span className="flex items-center gap-2"><Trophy size={15}/>{ev.prize}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/events/${ev.id}`} className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/40">
                  <div className="bg-sky-500 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl">View & Register<ChevronRight size={18}/></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <p className="text-sky-500 font-bold text-xs uppercase tracking-widest mb-2">Why EventHub</p>
            <h2 className="text-3xl font-black text-slate-900">Everything you need to run a hackathon</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f,i)=>{const Icon=f.icon;return(
              <motion.div key={f.title} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.c} flex items-center justify-center mb-4 shadow-lg`}><Icon size={22} className="text-white"/></div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            );})}
          </div>
        </section>

        {/* Hall of Fame */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center"><Award size={22} className="text-amber-500"/></div>
            <div><h2 className="text-3xl font-black text-slate-900">Hall of Fame</h2><p className="text-slate-500 font-medium">Past event winners</p></div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead><tr className="bg-slate-50 border-b border-slate-200">{["Event","Winning Team","Score","Results"].map(h=><th key={h} className="table-head">{h}</th>)}</tr></thead>
              <tbody>
                {PAST.map((p,i)=>(
                  <tr key={p.id} className={`border-t border-slate-100 hover:bg-slate-50/50 transition-colors ${i===0?"bg-amber-50/30":""}`}>
                    <td className="table-cell font-bold text-slate-900">{p.title}</td>
                    <td className="table-cell"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-base">🏆</div><span className="font-semibold text-slate-700">{p.winner}</span></div></td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full" style={{width:`${p.score}%`}}/></div>
                        <span className="font-black text-slate-900">{p.score}</span>
                      </div>
                    </td>
                    <td className="table-cell"><Link to="/leaderboard" className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-500 hover:text-sky-600">View<ArrowRight size={13}/></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="relative rounded-3xl overflow-hidden p-12 text-center text-white shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-violet-600 to-indigo-700"/>
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 30% 50%,rgba(255,255,255,.3) 0%,transparent 60%)"}}/>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full text-sm font-bold mb-6"><Star size={14} className="text-yellow-300"/>Join 4,800+ participants</div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Ready to compete?</h2>
            <p className="text-white/80 font-medium text-lg mb-10 max-w-xl mx-auto">Join thousands of participants across India's top hackathons.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register" className="px-8 py-4 bg-white text-sky-600 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl text-lg">Get Started Free</Link>
              <Link to="/events" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-lg">Browse Events</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
