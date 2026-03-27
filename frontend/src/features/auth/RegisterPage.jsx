import React, { useState } from "react";
import { Trophy, Mail, Lock, User, ArrowRight, Building, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../lib/api";

const S = {
  page: { minHeight:"100vh", display:"flex", fontFamily:"Inter,sans-serif" },
  panel: { flex:1, position:"relative", overflow:"hidden", minHeight:"100vh" },
  panelImg: { width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 },
  panelOverlay: { position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(15,23,42,0.93) 0%,rgba(109,40,217,0.45) 50%,rgba(15,23,42,0.8) 100%)" },
  panelContent: { position:"relative", zIndex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 56px", height:"100%", color:"white" },
  badge: { display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 16px", borderRadius:99, fontSize:13, fontWeight:700, marginBottom:32, width:"fit-content" },
  h2: { fontSize:48, fontWeight:900, lineHeight:1.1, marginBottom:20, letterSpacing:"-0.03em" },
  gradText: { background:"linear-gradient(135deg,#38bdf8,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" },
  subText: { color:"rgba(203,213,225,0.9)", fontWeight:500, lineHeight:1.7, maxWidth:320, fontSize:16 },
  featureGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:36, maxWidth:300 },
  featureItem: { display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:500, color:"rgba(203,213,225,0.9)" },
  right: { width:"100%", maxWidth:520, display:"flex", flexDirection:"column", justifyContent:"center", padding:"48px 56px", background:"white", overflowY:"auto" },
  logo: { display:"flex", alignItems:"center", gap:12, textDecoration:"none", marginBottom:36 },
  logoIcon: { background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", padding:10, borderRadius:12, color:"white", display:"flex" },
  logoText: { fontWeight:900, fontSize:20, color:"#0f172a" },
  h1: { fontSize:30, fontWeight:900, color:"#0f172a", marginBottom:8, letterSpacing:"-0.02em" },
  sub: { color:"#64748b", fontWeight:500, marginBottom:28, fontSize:15 },
  link: { color:"#0ea5e9", fontWeight:700, textDecoration:"none" },
  errBox: { display:"flex", alignItems:"center", gap:8, background:"#fef2f2", border:"1px solid #fecaca", color:"#dc2626", padding:"12px 16px", borderRadius:12, marginBottom:20, fontSize:14, fontWeight:500 },
  label: { display:"block", fontSize:13, fontWeight:700, color:"#374151", marginBottom:6 },
  inputWrap: { position:"relative" },
  inputIcon: { position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" },
  input: { width:"100%", padding:"12px 14px 12px 42px", border:"1.5px solid #e2e8f0", borderRadius:12, fontSize:14, fontWeight:500, color:"#0f172a", background:"#f8fafc", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s" },
  field: { marginBottom:18 },
  terms: { fontSize:12, color:"#94a3b8", fontWeight:500, marginBottom:16, lineHeight:1.5 },
  btn: { width:"100%", display:"flex", justifyContent:"center", alignItems:"center", gap:8, padding:"14px 24px", borderRadius:12, fontWeight:700, fontSize:15, color:"white", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", border:"none", cursor:"pointer", boxShadow:"0 4px 20px rgba(14,165,233,0.3)", transition:"all 0.2s" },
};

const FEATURES = [
  { e:"✅", l:"Free to join" },
  { e:"🔐", l:"Role-based access" },
  { e:"📊", l:"Live leaderboards" },
  { e:"👥", l:"Team management" },
];

const FIELDS = [
  { name:"name",       type:"text",     label:"Full Name",                 Icon:User,     ph:"Aditya Patel" },
  { name:"university", type:"text",     label:"Organization / University", Icon:Building, ph:"RK University" },
  { name:"email",      type:"email",    label:"Email address",             Icon:Mail,     ph:"you@university.edu" },
  { name:"password",   type:"password", label:"Password",                  Icon:Lock,     ph:"••••••••" },
];

export default function RegisterPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const [fields, setFields] = useState({ name:"", university:"", email:"", password:"" });
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!fields.name.trim()) errs.name = "Full name is required";
    else if (fields.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!fields.university.trim()) errs.university = "Organization / University is required";
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
      const { data } = await authAPI.register({
        name:       fields.name,
        university: fields.university,
        email:      fields.email,
        password:   fields.password,
      });
      localStorage.setItem("token",    data.token);
      localStorage.setItem("userRole", data.user.role.toLowerCase());
      localStorage.setItem("userName", data.user.name);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
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
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200" alt="bg" style={S.panelImg} />
        <div style={S.panelOverlay} />
        <div style={S.panelContent}>
          <div style={S.badge}>🚀 Join the Community</div>
          <h2 style={S.h2}>Start your<br /><span style={S.gradText}>Hackathon Journey</span></h2>
          <p style={S.subText}>Create your free account and join thousands of teams competing across India's top hackathons.</p>
          <div style={S.featureGrid}>
            {FEATURES.map(f => (
              <div key={f.l} style={S.featureItem}>
                <span>{f.e}</span>{f.l}
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

        <h1 style={S.h1}>Create an account ✨</h1>
        <p style={S.sub}>Already have an account? <Link to="/login" style={S.link}>Sign in</Link></p>

        {error && (
          <div style={S.errBox}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          {FIELDS.map(({ name, type, label, Icon, ph }) => (
            <div key={name} style={S.field}>
              <label style={S.label}>{label}</label>
              <div style={S.inputWrap}>
                <Icon size={16} style={S.inputIcon} />
                <input name={name} type={type} placeholder={ph}
                  value={fields[name]}
                  onChange={e => { setFields(f=>({...f,[name]:e.target.value})); setFieldErrors(fe=>({...fe,[name]:""})); }}
                  style={inputStyle(name)}
                  onFocus={() => setFocused(name)}
                  onBlur={() => setFocused("")} />
              </div>
              {fieldErrors[name] && <p style={{ color:"#ef4444", fontSize:12, marginTop:4, fontWeight:500 }}>{fieldErrors[name]}</p>}
            </div>
          ))}

          <p style={S.terms}>By registering, you agree to our Terms of Service and Privacy Policy.</p>

          <button type="submit" disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(14,165,233,0.45)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,165,233,0.3)"; }}>
            {loading
              ? <><Loader2 size={18} style={{ animation:"spin 1s linear infinite" }} /> Creating account...</>
              : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
