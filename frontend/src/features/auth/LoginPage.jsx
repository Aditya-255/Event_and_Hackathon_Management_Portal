import React, { useState } from "react";
import { Trophy, Mail, Lock, ArrowRight, Info, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../lib/api";

const S = {
  page: { minHeight:"100vh", display:"flex", fontFamily:"Inter,sans-serif" },
  panel: { flex:1, position:"relative", overflow:"hidden", minHeight:"100vh" },
  panelImg: { width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 },
  panelOverlay: { position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(15,23,42,0.93) 0%,rgba(14,116,144,0.5) 50%,rgba(15,23,42,0.8) 100%)" },
  panelContent: { position:"relative", zIndex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px", height:"100%", color:"white" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 16px", borderRadius:99, fontSize:13, fontWeight:700, marginBottom:32, width:"fit-content" },
  h2: { fontSize:48, fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:"-0.03em" },
  gradText: { background:"linear-gradient(135deg,#38bdf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" },
  subText: { color:"rgba(203,213,225,0.9)", fontWeight:500, lineHeight:1.7, maxWidth:320, fontSize:16 },
  statsRow: { display:"flex", gap:32, marginTop:40 },
  statItem: { textAlign:"center" },
  statVal: { fontWeight:900, fontSize:18, color:"white" },
  statLbl: { fontSize:11, color:"#94a3b8", fontWeight:600, marginTop:2 },
  right: { width:"100%", maxWidth:520, display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 56px", background:"white", overflowY:"auto" },
  logo: { display:"flex", alignItems:"center", gap:12, textDecoration:"none", marginBottom:40 },
  logoIcon: { background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", padding:10, borderRadius:12, color:"white", display:"flex" },
  logoText: { fontWeight:900, fontSize:20, color:"#0f172a" },
  h1: { fontSize:30, fontWeight:900, color:"#0f172a", marginBottom:8, letterSpacing:"-0.02em" },
  sub: { color:"#64748b", fontWeight:500, marginBottom:32, fontSize:15 },
  link: { color:"#0ea5e9", fontWeight:700, textDecoration:"none" },
  demoBox: { background:"#f0f9ff", border:"1px solid #bae6fd", borderRadius:16, padding:16, marginBottom:24, position:"relative", overflow:"hidden" },
  demoBar: { position:"absolute", top:0, left:0, width:4, height:"100%", background:"#0ea5e9", borderRadius:"4px 0 0 4px" },
  demoInner: { display:"flex", gap:12, paddingLeft:8 },
  demoTitle: { fontWeight:700, color:"#0c4a6e", marginBottom:8, fontSize:14 },
  demoRow: { fontSize:12, fontWeight:500, color:"#075985", marginBottom:4 },
  errBox: { display:"flex", alignItems:"center", gap:8, background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 16px", borderRadius:12, marginBottom:20, fontSize:14, fontWeight:500 },
  label: { display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 },
  inputWrap: { position:"relative" },
  inputIcon: { position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" },
  input: { width:"100%", padding:"12px 14px 12px 42px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, fontWeight:500, color:"#0f172a", background:"#f8fafc", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s" },
  field: { marginBottom:20 },
  btn: { width:"100%", display:"flex", justifyContent:"center", alignItems:"center", gap:8, padding:"14px 24px", borderRadius:12, fontWeight:700, fontSize:15, color:"white", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(14,165,233,0.3)", transition:"all 0.2s", marginTop:8 },
  divider: { display:"flex", alignItems:"center", gap:12, margin:"20px 0" },
  divLine: { flex:1, height:1, background:"#e2e8f0" },
  divText: { fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase" },
  guestBtn: { width:"100%", display:"flex", justifyContent:"center", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:12, fontWeight:700, fontSize:14, color:"#475569", background:"#f8fafc", border:"1.5px solid #e2e8f0", textDecoration:"none", transition:"all 0.2s" },
};

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [fields, setFields] = useState({ email:"", password:"" });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!fields.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = "Enter a valid email address";
    if (!fields.password) errs.password = "Password is required";
    else if (fields.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({}); setError(""); setLoading(true);
    try {
      const { data } = await authAPI.login({ email: fields.email, password: fields.password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role.toLowerCase());
      localStorage.setItem("userName", data.user.name);
      nav(loc.state?.returnTo || "/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  const inputStyle = (name) => ({
    ...S.input,
    borderColor: fieldErrors[name] ? "#ef4444" : focused === name ? "#0ea5e9" : "#e2e8f0",
    boxShadow: fieldErrors[name] ? "0 0 0 3px rgba(239,68,68,0.1)" : focused === name ? "0 0 0 3px rgba(14,165,233,0.12)" : "none",
    background: focused === name ? "#fff" : "#f8fafc",
  });

  return (
    <div style={S.page}>
      {/* Left panel */}
      <div style={{ ...S.panel, display: window.innerWidth < 1024 ? "none" : "block" }}>
        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" alt="bg" style={S.panelImg} />
        <div style={S.panelOverlay} />
        <div style={S.panelContent}>
          <div style={S.badge}><Trophy size={15} style={{ color:"#fde047" }} /> EventHub RKU Platform</div>
          <h2 style={S.h2}>Build. Compete.<br /><span style={S.gradText}>Win Together.</span></h2>
          <p style={S.subText}>Sign in to track your events, manage your team, and compete in India's best hackathons.</p>
          <div style={S.statsRow}>
            {[["120+","Events"],["4,800+","Teams"],["₹25L+","Prizes"]].map(([v,l]) => (
              <div key={l} style={S.statItem}>
                <p style={S.statVal}>{v}</p>
                <p style={S.statLbl}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={S.right}>
        <Link to="/" style={S.logo}>
          <div style={S.logoIcon}><Trophy size={20} /></div>
          <span style={S.logoText}>EventHub</span>
        </Link>

        <h1 style={S.h1}>Welcome back 👋</h1>
        <p style={S.sub}>Don't have an account? <Link to="/register" style={S.link}>Register now</Link></p>

        {/* Demo credentials */}
        <div style={S.demoBox}>
          <div style={S.demoBar} />
          <div style={S.demoInner}>
            <Info size={16} style={{ color:"#0ea5e9", flexShrink:0, marginTop:2 }} />
            <div>
              <p style={S.demoTitle}>Demo Credentials</p>
              <p style={S.demoRow}><strong>Admin:</strong> admin@eventhub.com / admin123</p>
              <p style={S.demoRow}><strong>Organizer:</strong> organizer@eventhub.com / org123</p>
              <p style={S.demoRow}><strong>Participant:</strong> participant@eventhub.com / part123</p>
            </div>
          </div>
        </div>

        {error && (
          <div style={S.errBox}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div style={S.field}>
            <label style={S.label}>Email address</label>
            <div style={S.inputWrap}>
              <Mail size={16} style={S.inputIcon} />
              <input name="email" type="email" placeholder="you@eventhub.com"
                value={fields.email}
                onChange={e => { setFields(f=>({...f,email:e.target.value})); setFieldErrors(fe=>({...fe,email:""})); }}
                style={inputStyle("email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")} />
            </div>
            {fieldErrors.email && <p style={{ color:"#ef4444", fontSize:12, marginTop:4, fontWeight:500 }}>{fieldErrors.email}</p>}
          </div>
          <div style={S.field}>
            <label style={S.label}>Password</label>
            <div style={S.inputWrap}>
              <Lock size={16} style={S.inputIcon} />
              <input name="password" type="password" placeholder="••••••••"
                value={fields.password}
                onChange={e => { setFields(f=>({...f,password:e.target.value})); setFieldErrors(fe=>({...fe,password:""})); }}
                style={inputStyle("password")}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")} />
            </div>
            {fieldErrors.password && <p style={{ color:"#ef4444", fontSize:12, marginTop:4, fontWeight:500 }}>{fieldErrors.password}</p>}
          </div>

          <button type="submit" disabled={loading} style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(14,165,233,0.45)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.3)"; }}>
            {loading ? <><Loader2 size={18} style={{ animation:"spin 1s linear infinite" }} /> Signing in...</> : <>Sign in <ArrowRight size={18} /></>}
          </button>

          <div style={S.divider}>
            <div style={S.divLine} /><span style={S.divText}>or</span><div style={S.divLine} />
          </div>

          <Link to="/dashboard" style={S.guestBtn}
            onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
            onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}>
            Continue as Guest →
          </Link>
        </form>
      </div>
    </div>
  );
}
