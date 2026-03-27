import React, { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, Info, Trophy, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { abstractsAPI, teamsAPI, eventsAPI } from "../../lib/api";

export default function ParticipantSubmitAbstract() {
  const [form,    setForm]    = useState({ event_id: "", team_id: "", project_name: "", description: "", category: "Open" });
  const [file,    setFile]    = useState(null);
  const [teams,   setTeams]   = useState([]);
  const [events,  setEvents]  = useState([]);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  useEffect(() => {
    Promise.all([
      teamsAPI.getAll().catch(() => ({ data: [] })),
      eventsAPI.getAll().catch(() => ({ data: [] })),
    ]).then(([tr, er]) => {
      setTeams(tr.data || []);
      setEvents(er.data || []);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.team_id || !form.event_id) { setError("Please select a team and event."); return; }
    setError(""); setLoading(true);
    try {
      const fd = new FormData();
      fd.append("team_id",      form.team_id);
      fd.append("event_id",     form.event_id);
      fd.append("project_name", form.project_name);
      fd.append("description",  form.description);
      fd.append("category",     form.category);
      if (file) fd.append("file", file);
      await abstractsAPI.submit(fd);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || "Submission failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
      ><CheckCircle size={48} /></motion.div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Abstract Submitted!</h2>
      <p className="text-slate-500 font-medium mb-6">Your abstract for <strong className="text-slate-900">{form.project_name}</strong> is under review.</p>
      <button onClick={() => { setDone(false); setForm({ event_id: "", team_id: "", project_name: "", description: "", category: "Open" }); setFile(null); }} className="btn-primary">
        Submit Another
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Submit Abstract</h1>
        <p className="text-slate-500 font-medium text-sm mt-0.5">Upload your project proposal for evaluation</p>
      </div>

      <div className="card overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-sky-500 to-violet-600" />
        <div className="p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
          )}
          <form onSubmit={submit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center"><Trophy size={14} className="text-sky-500" /></div>
                Event and Team
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Select Event <span className="text-red-500">*</span></label>
                  <select required value={form.event_id} onChange={e => setForm({ ...form, event_id: e.target.value })} className="input">
                    <option value="" disabled>Choose event</option>
                    {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Select Team <span className="text-red-500">*</span></label>
                  <select required value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })} className="input">
                    <option value="" disabled>Choose team</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Project Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={form.project_name} onChange={e => setForm({ ...form, project_name: e.target.value })}
                    placeholder="e.g. EcoTrack" className="input"
                  />
                </div>
                <div>
                  <label className="label">Category / Track</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input">
                    {["Open", "Tech", "AI/ML", "Sustainability", "EdTech", "Design"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="label">Project Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief overview of your solution..." className="input"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center"><FileText size={14} className="text-violet-500" /></div>
                Document Upload
              </h3>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-sky-400 hover:bg-sky-50/50 transition-colors relative">
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf,.ppt,.pptx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {!file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4"><Upload size={24} /></div>
                    <p className="font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PDF or PPTX (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4"><FileText size={24} /></div>
                    <p className="font-bold text-slate-700 mb-1">{file.name}</p>
                    <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-xs text-sky-500 font-bold mt-2">Click to replace file</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 bg-sky-50 border border-sky-200 p-4 rounded-xl">
              <Info size={17} className="text-sky-500 shrink-0 mt-0.5" />
              <p className="text-sm text-sky-700 font-medium">Ensure your abstract clearly highlights the problem, your proposed solution, and tech stack.</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loading}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>Submit Abstract<ChevronRight size={16} /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
