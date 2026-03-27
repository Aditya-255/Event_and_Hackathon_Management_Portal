import React, { useState, useEffect } from "react";
import { UserPlus, CheckCircle, Trophy, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { teamsAPI, eventsAPI } from "../../lib/api";

export default function ParticipantRegister() {
  const [form,    setForm]    = useState({ event_id: "", team_name: "", members: "2", tier: "Junior" });
  const [events,  setEvents]  = useState([]);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    eventsAPI.getAll({ status: "Active" })
      .then(({ data }) => setEvents(data || []))
      .catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.event_id) { setError("Please select an event."); return; }
    setError(""); setLoading(true);
    try {
      await teamsAPI.register({
        event_id:  parseInt(form.event_id),
        team_name: form.team_name,
        members:   parseInt(form.members),
        tier:      form.tier,
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
      ><CheckCircle size={48} /></motion.div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Registration Successful!</h2>
      <p className="text-slate-500 font-medium mb-6">Team <strong className="text-slate-900">{form.team_name}</strong> has been registered.</p>
      <button onClick={() => { setDone(false); setForm({ event_id: "", team_name: "", members: "2", tier: "Junior" }); }} className="btn-primary">
        Register Another Team
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Team Registration</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">Register your team for an active event</p>
      </div>

      <div className="card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-sky-500 to-violet-600" />
        <div className="p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center"><Trophy size={14} className="text-sky-500" /></div>
                Event Information
              </h3>
              <div>
                <label className="label">Select Event <span className="text-red-500">*</span></label>
                <select required value={form.event_id} onChange={e => setForm({ ...form, event_id: e.target.value })} className="input">
                  <option value="" disabled>Choose an active event</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                  {events.length === 0 && <option disabled>No active events available</option>}
                </select>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center"><UserPlus size={14} className="text-violet-500" /></div>
                Team Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Team Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={form.team_name} onChange={e => setForm({ ...form, team_name: e.target.value })}
                    placeholder="e.g. Innovators Hub" className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Team Size</label>
                    <select value={form.members} onChange={e => setForm({ ...form, members: e.target.value })} className="input">
                      {[2, 3, 4].map(n => <option key={n} value={n}>{n} Members</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Competition Tier</label>
                    <select value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })} className="input">
                      {["Junior", "Senior", "Professional"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loading}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <><UserPlus size={16} />Register Team<ChevronRight size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
