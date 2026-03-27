import React from "react";
import {useParams,Link} from "react-router-dom";
import {Calendar,MapPin,Users,ChevronRight,Trophy,Clock,CheckCircle,Award} from "lucide-react";
import {motion} from "framer-motion";

export default function EventDetailsPage(){
  const {id}=useParams();
  return(
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link to="/events" className="hover:text-sky-500 transition-colors">Events</Link>
        <ChevronRight size={14}/>
        <span className="text-slate-700">RKU Spring Hackathon 2026</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card overflow-hidden">
            <div className="relative h-56">
              <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200" alt="Event" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"/>
              <div className="absolute bottom-5 left-6">
                <span className="inline-block px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md rounded-full text-xs font-black mb-2">REGISTRATION OPEN</span>
                <h1 className="text-3xl font-black text-white">RKU Spring Hackathon 2026</h1>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-500 font-medium leading-relaxed text-lg mb-6">Join the biggest competitive coding event of the semester. Build innovative solutions for real-world problems at RK University.</p>
              <div className="flex flex-wrap gap-3">
                <Link to={`/dashboard/register-team`} className="btn-primary">Register Team</Link>
                <Link to="/dashboard/submit-abstract" className="btn-secondary">Submit Abstract</Link>
              </div>
            </div>
          </motion.div>

          <div className="card p-8">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">About the Event</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-6">The RKU Spring Hackathon is a 48-hour event. Students from all disciplines can form teams of up to 4 members.</p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {["🎓 EdTech","🌱 Sustainability","💡 Open Innovation"].map(t=>(
                <div key={t} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-sm font-bold text-slate-700">{t}</p>
                </div>
              ))}
            </div>
            <h4 className="font-bold text-slate-900 mb-3">Prize Pool</h4>
            <div className="space-y-3">
              {[{p:"1st Place",v:"₹50,000 + Internship",c:"from-yellow-400 to-orange-400",bg:"bg-yellow-50 border-yellow-200"},{p:"2nd Place",v:"₹30,000",c:"from-slate-400 to-slate-500",bg:"bg-slate-50 border-slate-200"},{p:"3rd Place",v:"₹15,000",c:"from-amber-600 to-amber-700",bg:"bg-amber-50 border-amber-200"}].map(x=>(
                <div key={x.p} className={`flex items-center gap-4 p-4 rounded-xl border ${x.bg}`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${x.c} flex items-center justify-center`}><Trophy size={18} className="text-white"/></div>
                  <div><p className="font-bold text-slate-900">{x.p}</p><p className="text-sm text-slate-500">{x.v}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.1}} className="card p-6">
            <h3 className="font-bold text-slate-900 mb-5">Event Overview</h3>
            <div className="space-y-4">
              {[{icon:Calendar,label:"Date",v:"Mar 27–28, 2026",s:"Starts 9:00 AM",c:"bg-sky-50 text-sky-500"},{icon:MapPin,label:"Location",v:"RKU Main Campus",s:"T-Block Auditorium",c:"bg-violet-50 text-violet-500"},{icon:Users,label:"Team Size",v:"2–4 Members",s:"All disciplines",c:"bg-emerald-50 text-emerald-500"},{icon:Award,label:"Prize Pool",v:"₹95,000",s:"Across positions",c:"bg-amber-50 text-amber-500"}].map(({icon:Icon,label,v,s,c})=>(
                <div key={label} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 ${c} rounded-xl flex items-center justify-center shrink-0`}><Icon size={18}/></div>
                  <div><p className="text-xs font-bold text-slate-400">{label}</p><p className="font-bold text-slate-900">{v}</p><p className="text-xs text-slate-400">{s}</p></div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-3">Registration</h3>
            <div className="flex justify-between text-sm font-semibold text-slate-500 mb-2"><span>24 / 50 teams</span><span>48%</span></div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full" style={{width:"48%"}}/>
            </div>
            <p className="text-xs text-slate-400 font-medium">26 spots remaining</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
            <Trophy size={80} className="absolute -bottom-4 -right-4 text-white/5"/>
            <h3 className="font-bold mb-2">Ready to win?</h3>
            <p className="text-sm text-slate-400 mb-5">Register your team and submit your abstract before the deadline.</p>
            <Link to="/dashboard/register-team" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
