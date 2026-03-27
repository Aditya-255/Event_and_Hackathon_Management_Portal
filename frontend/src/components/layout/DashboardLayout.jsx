import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Trophy, LayoutDashboard, PlusCircle, Award, Globe, LogOut,
  Activity, ChevronRight, Users, Settings, BarChart3, Shield,
  Calendar, Gavel, UserCheck, Bell, Search, Menu, X,
  ChevronDown, User, HelpCircle, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── role-based sidebar config ── */
const MENU = {
  participant: {
    label: 'Participant',
    color: 'from-sky-500 to-cyan-500',
    sections: [
      {
        title: 'Main',
        items: [
          { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { path: '/dashboard/activities', label: 'My Activities', icon: Activity },
        ]
      },
      {
        title: 'Actions',
        items: [
          { path: '/dashboard/register-team', label: 'Register Team', icon: PlusCircle },
          { path: '/dashboard/submit-abstract', label: 'Submit Abstract', icon: Award },
        ]
      },
      {
        title: 'Explore',
        items: [
          { path: '/events', label: 'Browse Events', icon: Calendar },
          { path: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
        ]
      }
    ]
  },
  organizer: {
    label: 'Organizer',
    color: 'from-violet-500 to-purple-600',
    sections: [
      {
        title: 'Main',
        items: [
          { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        ]
      },
      {
        title: 'Management',
        items: [
          { path: '/dashboard/organizer/events', label: 'My Events', icon: Calendar },
          { path: '/dashboard/organizer/teams', label: 'Teams', icon: Users },
          { path: '/dashboard/organizer/judging', label: 'Judging', icon: Gavel },
        ]
      },
      {
        title: 'Reports',
        items: [
          { path: '/leaderboard', label: 'Leaderboard', icon: BarChart3 },
        ]
      }
    ]
  },
  admin: {
    label: 'Administrator',
    color: 'from-rose-500 to-pink-600',
    sections: [
      {
        title: 'Main',
        items: [
          { path: '/dashboard', label: 'Admin Hub', icon: LayoutDashboard },
        ]
      },
      {
        title: 'Management',
        items: [
          { path: '/dashboard/admin/users', label: 'Users', icon: Users },
          { path: '/dashboard/admin/events', label: 'Events', icon: Calendar },
        ]
      },
      {
        title: 'Analytics',
        items: [
          { path: '/dashboard/admin/leaderboards', label: 'Leaderboards', icon: BarChart3 },
        ]
      },
      {
        title: 'System',
        items: [
          { path: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
        ]
      }
    ]
  }
};

/* ── Profile Dropdown ── */
const ProfileDropdown = ({ role, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleColors = {
    admin: 'from-rose-500 to-pink-600',
    organizer: 'from-violet-500 to-purple-600',
    participant: 'from-sky-500 to-cyan-500',
  };

  const roleLabels = {
    admin: 'Administrator',
    organizer: 'Organizer',
    participant: 'Participant',
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors group"
      >
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleColors[role] || 'from-sky-500 to-cyan-500'} flex items-center justify-center text-white font-black text-sm shadow-md`}>
          {role.charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-bold text-slate-900 capitalize leading-none">{role} User</p>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{roleLabels[role]}</p>
        </div>
        <ChevronDown size={15} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-slate-200 overflow-hidden z-50"
          >
            {/* Profile Header */}
            <div className={`p-4 bg-gradient-to-br ${roleColors[role] || 'from-sky-500 to-cyan-500'} text-white`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
                  {role.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold capitalize">{role} User</p>
                  <p className="text-xs text-white/70">{role}@eventhub.com</p>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                {roleLabels[role]}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => { setOpen(false); navigate('/dashboard'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center">
                  <User size={15} className="text-sky-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">My Profile</p>
                  <p className="text-xs text-slate-400">View your account</p>
                </div>
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => { setOpen(false); navigate('/dashboard/admin/settings'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Settings size={15} className="text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Settings</p>
                    <p className="text-xs text-slate-400">System configuration</p>
                  </div>
                </button>
              )}

              <button
                onClick={() => { setOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Globe size={15} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Public Site</p>
                  <p className="text-xs text-slate-400">Go to homepage</p>
                </div>
              </button>

              <button
                onClick={() => { setOpen(false); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <HelpCircle size={15} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Help & Support</p>
                  <p className="text-xs text-slate-400">Documentation</p>
                </div>
              </button>
            </div>

            <div className="p-2 border-t border-slate-100">
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                  <LogOut size={15} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600">Sign Out</p>
                  <p className="text-xs text-slate-400">End your session</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Main Layout ── */
const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'participant';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);

  const config = MENU[role] || MENU.participant;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const roleIcons = { admin: Shield, organizer: Briefcase, participant: UserCheck };
  const RoleIcon = roleIcons[role] || UserCheck;

  const roleAccentColors = {
    admin: 'from-rose-500 to-pink-600',
    organizer: 'from-violet-500 to-purple-600',
    participant: 'from-sky-500 to-cyan-500',
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-violet-500 rounded-xl blur-sm opacity-60" />
          <div className="relative bg-gradient-to-br from-sky-500 to-violet-600 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg">
            <Trophy size={17} className="text-white" />
          </div>
        </div>
        <div>
          <span className="font-black text-lg text-white tracking-tight">EventHub</span>
          <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Management Portal</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-4 py-3">
        <div className={`flex items-center gap-2.5 bg-gradient-to-r ${roleAccentColors[role]} rounded-xl px-3 py-2.5`}>
          <RoleIcon size={15} className="text-white" />
          <span className="text-xs font-bold text-white capitalize">{config.label} Panel</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-white/60 animate-pulse" />
        </div>
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {config.sections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] px-3 mb-2">{section.title}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 font-semibold text-sm transition-all duration-150 ${
                    active
                      ? `bg-gradient-to-r ${roleAccentColors[role]} text-white shadow-lg`
                      : 'text-slate-400 hover:bg-white/6 hover:text-slate-200'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-white' : 'text-slate-500'} />
                  <span>{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User Card */}
      <div className="p-4 border-t border-white/8">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleAccentColors[role]} flex items-center justify-center text-white font-black text-sm shadow-md`}>
            {role.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white capitalize truncate">{role} User</p>
            <p className="text-xs text-slate-500 font-medium truncate">{role}@eventhub.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#F1F5F9' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-64 flex-col h-screen sticky top-0 flex-shrink-0"
        style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1A2744 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 flex flex-col z-50 lg:hidden"
              style={{ background: 'linear-gradient(180deg, #0F172A 0%, #1A2744 100%)' }}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
              >
                <X size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3.5">
            {/* Left: Hamburger + Breadcrumb */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Menu size={20} />
              </button>
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                  <span className="capitalize">{config.label}</span>
                  <ChevronRight size={13} />
                  <span className="text-slate-700 font-bold capitalize">
                    {location.pathname === '/dashboard'
                      ? 'Dashboard'
                      : location.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Right: Search + Notifications + Profile */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-52">
                <Search size={15} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent text-sm font-medium text-slate-600 placeholder-slate-400 outline-none w-full"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell size={18} />
                {notifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* Divider */}
              <div className="w-px h-8 bg-slate-200 mx-1" />

              {/* Profile Dropdown */}
              <ProfileDropdown role={role} onLogout={handleLogout} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
