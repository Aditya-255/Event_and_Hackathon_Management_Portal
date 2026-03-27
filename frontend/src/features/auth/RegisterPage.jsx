import React from "react";
import {Trophy,Mail,Lock,User,ArrowRight,Building} from "lucide-react";
import {Link,useNavigate} from "react-router-dom";
import {motion} from "framer-motion";

export default function RegisterPage(){
  const nav=useNavigate();
  const submit=(e)=>{e.preventDefault();nav("/login");};
  return(
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200" alt="bg" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-violet-900/50 to-slate-950/70"/>
        <div className="absolute inset-0 flex flex-col justify-center px-14 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-bold w-max mb-8">🚀 Join the Community</div>
          <h2 className="text-5xl font-black leading-tight mb-5">Start your<br/><span className="gradient-text">Hackathon Journey</span></h2>
          <p className="text-slate-300 font-medium leading-relaxed max-w-sm text-lg">Create your free account and join thousands of teams competing across India's top hackathons.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs">
            {[{l:"Free to join",e:"✅"},{l:"Role-based access",e:"🔐"},{l:"Live leaderboards",e:"📊"},{l:"Team management",e:"👥"}].map(f=>(
              <div key={f.l} className="flex items-center gap-2 text-sm font-medium text-slate-300"><span>{f.e}</span>{f.l}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-8 md:px-16 bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="bg-gradient-to-br from-sky-500 to-violet-600 p-2.5 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform"><Trophy size={20}/></div>
            <span className="font-black text-xl text-slate-900">EventHub</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Create an account ✨</h1>
          <p className="text-slate-500 font-medium mb-8">Already have an account? <Link to="/login" className="font-bold text-sky-500 hover:underline">Sign in</Link></p>

          <motion.form initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-5" onSubmit={submit}>
            {[{name:"name",type:"text",label:"Full Name",icon:User,ph:"Aditya Patel"},{name:"university",type:"text",label:"Organization / University",icon:Building,ph:"RK University"},{name:"email",type:"email",label:"Email address",icon:Mail,ph:"you@university.edu"},{name:"password",type:"password",label:"Password",icon:Lock,ph:"••••••••"}].map(f=>{
              const Icon=f.icon;
              return(
                <div key={f.name}>
                  <label className="label">{f.label}</label>
                  <div className="relative"><Icon className="absolute left-3.5 top-3.5 text-slate-400" size={16}/><input name={f.name} type={f.type} required className="input pl-10" placeholder={f.ph}/></div>
                </div>
              );
            })}
            <p className="text-xs text-slate-400 font-medium">By registering, you agree to our Terms of Service and Privacy Policy.</p>
            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all group mt-2">
              Create Account<ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
