import React, { useState } from "react";
import { Trophy, Mail, Lock, ArrowRight, Info, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { authAPI } from "../../lib/api";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const fd = new FormData(e.target);
    try {
      const { data } = await authAPI.login({ email: fd.get("email"), password: fd.get("password") });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role.toLowerCase());
      localStorage.setItem("userName", data.user.name);
      nav(loc.state?.returnTo || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" alt="bg" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-sky-900/50 to-slate-950/70"/>
        <div className="absolute inset-0 flex flex-col justify-center px-14 text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-bold w-max mb-8"><Trophy size={16} className="text-yellow-300"/>EventHub RKU Platform</div>
          <h2 className="text-5xl font-black leading-tight mb-5">Build. Compete.<br/><span className="gradient-text">Win Together.</span></h2>
          <p className="text-slate-300 font-medium leading-relaxed max-w-sm text-lg">Sign in to track your events, manage your team, and compete in India's best hackathons.</p>
          <div className="mt-10 flex gap-8">
            {["120+ Events","4,800+ Teams","₹25L+ Prizes"].map(s=>(
              <div key={s} className="text-center">
                <p className="font-black text-white text-lg">{s.split(" ")[0]}</p>
                <p className="text-slate-400 text-xs font-medium">{s.split(" ").slice(1).join(" ")}</p>
              </div>
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
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome back 👋</h1>
          <p className="text-slate-500 font-medium mb-8">Don't have an account? <Link to="/register" className="font-bold text-sky-500 hover:underline">Register now</Link></p>

          {/* Demo credentials */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 rounded-l-2xl"/>
            <div className="flex gap-3 pl-2">
              <Info className="text-sky-500 shrink-0 mt-0.5" size={17}/>
              <div className="text-sm">
                <p className="font-bold text-sky-900 mb-2">Demo Credentials</p>
                <div className="space-y-1 text-xs font-medium text-sky-800">
                  <p><span className="font-bold">Admin:</span> admin@eventhub.com / admin123</p>
                  <p><span className="font-bold">Organizer:</span> organizer@eventhub.com / org123</p>
                  <p><span className="font-bold">Participant:</span> participant@eventhub.com / part123</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
              <AlertCircle size={16}/> {error}
            </div>
          )}

          <motion.form initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-5" onSubmit={submit}>
            <div>
              <label className="label">Email address</label>
              <div className="relative"><Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16}/><input name="email" type="email" required className="input pl-10" placeholder="you@eventhub.com"/></div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative"><Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16}/><input name="password" type="password" required className="input pl-10" placeholder="••••••••"/></div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-violet-600 shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2">
              {loading ? <><Loader2 size={18} className="animate-spin"/> Signing in...</> : <>Sign in <ArrowRight size={18}/></>}
            </button>
            <div className="relative my-4 flex items-center gap-3"><div className="flex-1 h-px bg-slate-200"/><span className="text-xs font-bold text-slate-400 uppercase">or</span><div className="flex-1 h-px bg-slate-200"/></div>
            <Link to="/dashboard" className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-all">Continue as Guest →</Link>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
