import React,{useState} from "react";
import {UserPlus,Info,CheckCircle,User,Trophy,ChevronRight} from "lucide-react";
import {motion} from "framer-motion";

export default function ParticipantRegister(){
  const [form,setForm]=useState({eventId:"",teamName:"",captain:"",members:"2",tier:"Junior"});
  const [done,setDone]=useState(false);

  const submit=(e)=>{
    e.preventDefault();
    if(!form.eventId){alert("Please select an event.");return;}
    setDone(true);
  };

  if(done) return(
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",bounce:.5}}
        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
      ><CheckCircle size={48}/></motion.div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Registration Successful!</h2>
      <p className="text-slate-500 font-medium mb-6">Team <strong className="text-slate-900">{form.teamName}</strong> has been registered.</p>
      <button onClick={()=>setDone(false)} className="btn-primary">Register Another Team</button>
    </div>
  );

  return(
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Team Registration</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">Register your team for an active event</p>
      </div>

      <div className="card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-sky-500 to-violet-600"/>
        <div className="p-8">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center"><Trophy size={14} className="text-sky-500"/></div>
                Event Information
              </h3>
              <div>
                <label className="label">Select Event <span className="text-red-500">*</span></label>
                <select required value={form.eventId} onChange={e=>setForm({...form,eventId:e.target.value})} className="input">
                  <option value="" disabled>Choose an active event</option>
                  <option value="spring-2026">Spring Hackathon 2026</option>
                  <option value="ai-2026">AI Challenge 2026</option>
                  <option value="web-dev">Web Dev Sprint</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center"><UserPlus size={14} className="text-violet-500"/></div>
                Team Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Team Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={form.teamName} onChange={e=>setForm({...form,teamName:e.target.value})} placeholder="e.g. Project-X" className="input"/>
                </div>
                <div>
                  <label className="label">Captain Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-slate-400" size={16}/>
                    <input required type="text" value={form.captain} onChange={e=>setForm({...form,captain:e.target.value})} placeholder="Full name" className="input pl-10"/>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Team Size</label>
                  <select value={form.members} onChange={e=>setForm({...form,members:e.target.value})} className="input">
                    {["2","3","4"].map(n=><option key={n}>{n} Members</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Competition Tier</label>
                  <select value={form.tier} onChange={e=>setForm({...form,tier:e.target.value})} className="input">
                    {["Junior","Senior","Professional"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-sky-50 border border-sky-200 p-4 rounded-xl">
              <Info size={17} className="text-sky-500 shrink-0 mt-0.5"/>
              <p className="text-sm text-sky-700 font-medium">Ensure all team members register under the same team name. Check your email for confirmation.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" className="btn-primary">Finalize Registration<ChevronRight size={16}/></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
