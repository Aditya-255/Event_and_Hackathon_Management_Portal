import React, { useState } from 'react';
import { Settings, Shield, Bell, Globe, Database, Trash2, Download, RefreshCw, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
  </label>
);

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maintenance: false,
    autoApprove: true,
    emailNotifs: true,
    publicLeaderboard: true,
    allowRegistration: true,
    twoFactor: false,
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const sections = [
    {
      title: 'General Configuration',
      icon: Settings,
      color: 'text-sky-500',
      bg: 'bg-sky-50',
      items: [
        { key: 'maintenance', label: 'Maintenance Mode', desc: 'Temporarily disable public access to the platform' },
        { key: 'allowRegistration', label: 'Allow New Registrations', desc: 'Enable or disable new user sign-ups' },
        { key: 'autoApprove', label: 'Auto-Approve Organizers', desc: 'Automatically verify new organizer accounts' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      items: [
        { key: 'emailNotifs', label: 'Email Notifications', desc: 'Send automatic registration and event emails' },
      ]
    },
    {
      title: 'Privacy & Visibility',
      icon: Globe,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      items: [
        { key: 'publicLeaderboard', label: 'Public Leaderboard', desc: 'Allow non-logged-in users to view leaderboards' },
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      items: [
        { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts' },
      ]
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">System Settings</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">Configure platform-wide settings and preferences</p>
      </div>

      {sections.map((section, si) => {
        const Icon = section.icon;
        return (
          <motion.div key={section.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl ${section.bg} flex items-center justify-center`}>
                <Icon size={17} className={section.color} />
              </div>
              <h2 className="font-black text-slate-900">{section.title}</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {section.items.map(item => (
                <div key={item.key} className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{item.label}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle checked={settings[item.key]} onChange={() => toggle(item.key)} />
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-red-100 flex items-center gap-3 bg-red-50">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
            <Shield size={17} className="text-red-500" />
          </div>
          <h2 className="font-black text-red-700">Danger Zone</h2>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm font-medium text-slate-500 mb-4">These actions are irreversible. Proceed with caution.</p>
          {[
            { icon: Download, label: 'Download Database Backup', desc: 'Export full platform data', color: 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-600' },
            { icon: RefreshCw, label: 'Force Sign-out All Users', desc: 'Terminate all active sessions', color: 'hover:bg-amber-50 hover:border-amber-200 hover:text-amber-600' },
            { icon: Trash2, label: 'Purge Old Event Data', desc: 'Permanently delete archived events', color: 'hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-red-500 border-red-200' },
          ].map(action => {
            const Icon = action.icon;
            return (
              <button key={action.label}
                className={`w-full flex items-center gap-4 p-4 border border-slate-200 rounded-xl transition-all text-left group ${action.color}`}
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-current/10 flex items-center justify-center shrink-0 transition-colors">
                  <Icon size={16} className="text-slate-500 group-hover:text-current" />
                </div>
                <div>
                  <p className="font-bold text-sm">{action.label}</p>
                  <p className="text-xs text-slate-400 font-medium">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all text-sm">
          <Save size={15} /> Save All Settings
        </button>
      </div>
    </div>
  );
}
