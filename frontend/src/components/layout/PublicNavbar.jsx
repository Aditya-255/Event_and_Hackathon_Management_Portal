import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Trophy, Menu, X, ChevronRight, ChevronDown, LayoutDashboard, User, LogOut, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RC = { admin:"from-rose-500 to-pink-600", organizer:"from-violet-500 to-purple-600", participant:"from-sky-500 to-cyan-500" };
const RL = { admin:"Administrator", organizer:"Organizer", participant:"Participant" };

function UserDropdown({ role, onLogout, solid }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const nav = useNavigate();
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const c = RC[role] || "from-sky-500 to-cyan-500";
  const btnBg = solid ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.15)";
  const btnBorder = solid ? "rgba(15,23,42,0.12)" : "rgba(255,255,255,0.25)";
  const nameColor = solid ? "#1e293b" : "#ffffff";
  const chevronColor = solid ? "#64748b" : "rgba(255,255,255,0.7)";
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 12px", borderRadius:"12px", border:`1px solid ${btnBorder}`, background:btnBg, cursor:"pointer", transition:"all 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background = solid ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.25)"}
        onMouseLeave={e => e.currentTarget.style.background = btnBg}
      >
        <div style={{ width:"32px", height:"32px", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"900", fontSize:"14px", boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }} className={`bg-gradient-to-br ${c}`}>{role[0].toUpperCase()}</div>
        <span style={{ color:nameColor, fontWeight:"700", fontSize:"14px", textTransform:"capitalize" }} className="hidden sm:block">{role}</span>
        <ChevronDown size={13} style={{ color:chevronColor, transition:"transform 0.2s", transform:open?"rotate(180deg)":"rotate(0deg)" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:8,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:0.96}} transition={{duration:0.15}}
            style={{ position:"absolute", right:0, top:"100%", marginTop:"8px", width:"240px", background:"white", borderRadius:"16px", boxShadow:"0 20px 60px rgba(0,0,0,0.12),0 4px 16px rgba(0,0,0,0.06)", border:"1px solid #e2e8f0", overflow:"hidden", zIndex:50 }}>
            <div className={`bg-gradient-to-br ${c}`} style={{ padding:"16px", color:"white" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"900", fontSize:"20px" }}>{role[0].toUpperCase()}</div>
                <div><p style={{ fontWeight:"700", textTransform:"capitalize" }}>{role} User</p><p style={{ fontSize:"12px", color:"rgba(255,255,255,0.7)" }}>{RL[role]||role}</p></div>
              </div>
            </div>
            <div style={{ padding:"8px" }}>
              {[{icon:LayoutDashboard,label:"Dashboard",path:"/dashboard"},{icon:User,label:"My Profile",path:"/dashboard"},{icon:Globe,label:"Browse Events",path:"/events"}].map(({icon:Icon,label,path}) => (
                <button key={label} onClick={() => { setOpen(false); nav(path); }}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"10px 12px", borderRadius:"10px", border:"none", background:"transparent", cursor:"pointer", textAlign:"left", transition:"background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <Icon size={15} style={{ color:"#94a3b8" }} /><span style={{ fontSize:"14px", fontWeight:"600", color:"#334155" }}>{label}</span>
                </button>
              ))}
            </div>
            <div style={{ padding:"8px", borderTop:"1px solid #f1f5f9" }}>
              <button onClick={() => { setOpen(false); onLogout(); }}
                style={{ width:"100%", display:"flex", alignItems:"center", gap:"12px", padding:"10px 12px", borderRadius:"10px", border:"none", background:"transparent", cursor:"pointer", textAlign:"left", transition:"background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background="#fef2f2"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                <LogOut size={15} style={{ color:"#ef4444" }} /><span style={{ fontSize:"14px", fontWeight:"600", color:"#ef4444" }}>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setUserRole(localStorage.getItem("userRole")); }, [location]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { localStorage.removeItem("userRole"); localStorage.removeItem("token"); setUserRole(null); navigate("/"); };
  const navLinks = [{ name: "Events", path: "/events" }, { name: "Leaderboard", path: "/leaderboard" }];

  // solid = white bg; transparent = over hero image
  const solid = scrolled || location.pathname !== "/";

  const headerStyle = solid
    ? { background:"rgba(255,255,255,0.96)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:"1px solid rgba(226,232,240,0.8)", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }
    : { background:"transparent" };

  const logoColor = solid ? "#0f172a" : "#ffffff";
  const linkColor = solid ? "#475569" : "rgba(255,255,255,0.9)";
  const linkHoverBg = solid ? "rgba(241,245,249,1)" : "rgba(255,255,255,0.12)";
  const mobileToggleColor = solid ? "#334155" : "#ffffff";

  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:50, transition:"all 0.4s ease", ...headerStyle }}>
      <div style={{ maxWidth:"1280px", margin:"0 auto", padding: solid ? "12px 48px" : "16px 48px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:"12px", textDecoration:"none" }}>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,#38bdf8,#a78bfa)", borderRadius:"12px", filter:"blur(8px)", opacity:0.4 }} />
            <div style={{ position:"relative", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", padding:"10px", borderRadius:"12px", color:"white", boxShadow:"0 4px 14px rgba(14,165,233,0.3)" }}>
              <Trophy size={17} />
            </div>
          </div>
          <span style={{ fontWeight:"900", fontSize:"20px", letterSpacing:"-0.025em", color:logoColor, transition:"color 0.3s" }}>EventHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display:"none", alignItems:"center", gap:"4px" }} className="md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.name} to={link.path}
                style={{ fontWeight:"600", fontSize:"14px", padding:"8px 16px", borderRadius:"12px", textDecoration:"none", position:"relative", transition:"all 0.2s", color: isActive ? "#0ea5e9" : linkColor, background: isActive ? "rgba(14,165,233,0.1)" : "transparent" }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = linkHoverBg; e.currentTarget.style.color = "#0ea5e9"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = linkColor; } }}
              >
                {link.name}
                {isActive && <motion.div layoutId="nav-ul" style={{ position:"absolute", bottom:0, left:"8px", right:"8px", height:"2px", background:"linear-gradient(to right,#0ea5e9,#8b5cf6)", borderRadius:"99px" }} />}
              </Link>
            );
          })}

          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginLeft:"16px" }}>
            {userRole ? (
              <UserDropdown role={userRole} onLogout={handleLogout} solid={solid} />
            ) : (
              <>
                <Link to="/login"
                  style={{ fontWeight:"600", fontSize:"14px", padding:"8px 16px", borderRadius:"12px", textDecoration:"none", color:linkColor, transition:"all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = linkHoverBg; e.currentTarget.style.color = "#0ea5e9"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = linkColor; }}
                >
                  Sign In
                </Link>
                <Link to="/register"
                  style={{ fontWeight:"700", fontSize:"14px", padding:"10px 20px", borderRadius:"12px", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", color:"white", textDecoration:"none", boxShadow:"0 4px 14px rgba(14,165,233,0.3)", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"6px" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(14,165,233,0.45)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(14,165,233,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  Get Started <ChevronRight size={14} />
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          style={{ display:"flex", padding:"8px", borderRadius:"12px", border:"none", background:"transparent", cursor:"pointer", color:mobileToggleColor, transition:"all 0.2s" }}
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          onMouseEnter={e => e.currentTarget.style.background = solid ? "#f1f5f9" : "rgba(255,255,255,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
            style={{ background:"rgba(255,255,255,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid #e2e8f0", overflow:"hidden" }}
            className="md:hidden"
          >
            <div style={{ padding:"16px 24px", display:"flex", flexDirection:"column", gap:"8px" }}>
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setMobileOpen(false)}
                  style={{ fontWeight:"600", fontSize:"16px", padding:"12px", borderRadius:"12px", textDecoration:"none", color: location.pathname===link.path ? "#0ea5e9" : "#334155", background: location.pathname===link.path ? "rgba(14,165,233,0.08)" : "transparent", transition:"all 0.2s" }}
                >{link.name}</Link>
              ))}
              <div style={{ borderTop:"1px solid #f1f5f9", marginTop:"8px", paddingTop:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
                {userRole ? (
                  <>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)} style={{ fontWeight:"700", textAlign:"center", padding:"12px", color:"#0ea5e9", background:"rgba(14,165,233,0.06)", border:"1px solid rgba(14,165,233,0.2)", borderRadius:"12px", textDecoration:"none", display:"block" }}>Dashboard</Link>
                    <button onClick={() => { handleLogout(); setMobileOpen(false); }} style={{ fontWeight:"600", padding:"12px", color:"#ef4444", background:"transparent", border:"none", borderRadius:"12px", cursor:"pointer", transition:"background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#fef2f2"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} style={{ fontWeight:"700", textAlign:"center", padding:"12px", color:"#334155", background:"#f1f5f9", borderRadius:"12px", textDecoration:"none", display:"block" }}>Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} style={{ fontWeight:"700", textAlign:"center", padding:"12px", color:"white", background:"linear-gradient(135deg,#0ea5e9,#8b5cf6)", borderRadius:"12px", textDecoration:"none", display:"block" }}>Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}