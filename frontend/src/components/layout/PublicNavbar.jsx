import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trophy, X, ChevronRight, ChevronDown, LayoutDashboard, Globe, LogOut, Menu } from "lucide-react";

function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function UserDropdown({ role, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const nav = useNavigate();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const roleLabel = { admin:"Administrator", organizer:"Organizer", participant:"Participant" }[role] || role;
  return (
    <div style={{ position:"relative" }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"7px 12px", borderRadius:"10px", border:"1px solid rgba(255,255,255,0.18)", background:"rgba(255,255,255,0.1)", cursor:"pointer" }}>
        <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:900, fontSize:13 }}>{role[0].toUpperCase()}</div>
        <span style={{ color:"#fff", fontWeight:700, fontSize:14, textTransform:"capitalize" }}>{role}</span>
        <ChevronDown size={13} style={{ color:"rgba(255,255,255,0.6)", transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:220, background:"white", borderRadius:14, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", border:"1px solid #e2e8f0", overflow:"hidden", zIndex:9999 }}>
          <div style={{ padding:"14px 16px", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", color:"white" }}>
            <p style={{ fontWeight:700, textTransform:"capitalize", fontSize:15 }}>{role} User</p>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{roleLabel}</p>
          </div>
          <div style={{ padding:8 }}>
            {[{icon:LayoutDashboard,label:"Dashboard",path:"/dashboard"},{icon:Globe,label:"Browse Events",path:"/events"}].map(({icon:Icon,label,path})=>(
              <button key={label} onClick={()=>{setOpen(false);nav(path);}} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:"none", background:"transparent", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <Icon size={15} style={{ color:"#94a3b8" }}/><span style={{ fontSize:14, fontWeight:600, color:"#334155" }}>{label}</span>
              </button>
            ))}
          </div>
          <div style={{ padding:8, borderTop:"1px solid #f1f5f9" }}>
            <button onClick={()=>{setOpen(false);onLogout();}} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:"none", background:"transparent", cursor:"pointer" }}
              onMouseEnter={e=>e.currentTarget.style.background="#fef2f2"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <LogOut size={15} style={{ color:"#ef4444" }}/><span style={{ fontSize:14, fontWeight:600, color:"#ef4444" }}>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setUserRole(localStorage.getItem("userRole")); }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    setUserRole(null);
    navigate("/");
  };

  const navLinks = [
    { name:"Events", path:"/events" },
    { name:"Leaderboard", path:"/leaderboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:9999, background:"rgba(10,15,30,0.92)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", borderBottom:"1px solid rgba(255,255,255,0.07)", boxShadow:"0 2px 24px rgba(0,0,0,0.35)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 32px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0 }}>
          <div style={{ background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", padding:8, borderRadius:10, color:"white", display:"flex" }}>
            <Trophy size={16} />
          </div>
          <span style={{ fontWeight:900, fontSize:18, color:"#ffffff", letterSpacing:"-0.02em" }}>EventHub</span>
        </Link>

        {!isMobile && (
          <nav style={{ display:"flex", alignItems:"center", gap:4 }}>
            {navLinks.map(link => (
              <Link key={link.name} to={link.path}
                style={{ fontWeight:600, fontSize:14, padding:"8px 14px", borderRadius:10, textDecoration:"none", color:isActive(link.path)?"#38bdf8":"rgba(255,255,255,0.85)", background:isActive(link.path)?"rgba(56,189,248,0.12)":"transparent", transition:"all 0.2s", whiteSpace:"nowrap" }}
                onMouseEnter={e=>{ if(!isActive(link.path)){e.currentTarget.style.color="#38bdf8";e.currentTarget.style.background="rgba(56,189,248,0.1)";} }}
                onMouseLeave={e=>{ if(!isActive(link.path)){e.currentTarget.style.color="rgba(255,255,255,0.85)";e.currentTarget.style.background="transparent";} }}
              >{link.name}</Link>
            ))}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginLeft:12 }}>
              {userRole ? (
                <UserDropdown role={userRole} onLogout={handleLogout} />
              ) : (
                <>
                  <Link to="/login"
                    style={{ fontWeight:600, fontSize:14, padding:"8px 14px", borderRadius:10, textDecoration:"none", color:"rgba(255,255,255,0.85)", whiteSpace:"nowrap" }}
                    onMouseEnter={e=>{e.currentTarget.style.color="#38bdf8";e.currentTarget.style.background="rgba(56,189,248,0.1)";}}
                    onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.85)";e.currentTarget.style.background="transparent";}}>
                    Sign In
                  </Link>
                  <Link to="/register"
                    style={{ fontWeight:700, fontSize:14, padding:"9px 18px", borderRadius:10, textDecoration:"none", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", color:"white", display:"flex", alignItems:"center", gap:5, boxShadow:"0 4px 14px rgba(14,165,233,0.35)", whiteSpace:"nowrap" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(14,165,233,0.5)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 14px rgba(14,165,233,0.35)";}}>
                    Get Started <ChevronRight size={14} />
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}

        {isMobile && (
          <button onClick={() => setMobileOpen(o => !o)}
            style={{ padding:8, borderRadius:10, border:"none", background:"transparent", cursor:"pointer", color:"#ffffff", display:"flex" }}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {isMobile && mobileOpen && (
        <div style={{ background:"rgba(10,15,30,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"16px 24px 24px" }}>
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} onClick={() => setMobileOpen(false)}
              style={{ display:"block", fontWeight:600, fontSize:16, padding:"12px 16px", borderRadius:10, textDecoration:"none", color:isActive(link.path)?"#38bdf8":"rgba(255,255,255,0.85)", marginBottom:4 }}>
              {link.name}
            </Link>
          ))}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", marginTop:12, paddingTop:16, display:"flex", flexDirection:"column", gap:10 }}>
            {userRole ? (
              <>
                <Link to="/dashboard" onClick={()=>setMobileOpen(false)} style={{ fontWeight:700, textAlign:"center", padding:12, color:"#38bdf8", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:10, textDecoration:"none", display:"block" }}>Dashboard</Link>
                <button onClick={()=>{handleLogout();setMobileOpen(false);}} style={{ fontWeight:600, padding:12, color:"#f87171", background:"transparent", border:"none", borderRadius:10, cursor:"pointer", fontSize:15 }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={()=>setMobileOpen(false)} style={{ fontWeight:700, textAlign:"center", padding:12, color:"rgba(255,255,255,0.85)", background:"rgba(255,255,255,0.08)", borderRadius:10, textDecoration:"none", display:"block" }}>Sign In</Link>
                <Link to="/register" onClick={()=>setMobileOpen(false)} style={{ fontWeight:700, textAlign:"center", padding:12, color:"white", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", borderRadius:10, textDecoration:"none", display:"block" }}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
