  import React, { useState } from "react";
import { Upload, FileText, CheckCircle, Info, Trophy, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ParticipantSubmitAbstract() {
  const [form, setForm] = useState({ eventId: "", teamName: "", description: "" });
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.eventId || !form.teamName) {
      alert("Please fill in event and team name.");
      return;
    }
    if (!file) {
      alert("Please upload your abstract file (PDF/PPT).");
      return;
    }
    setDone(true);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg"
      >
        <CheckCircle size={48} />
      </motion.div>
      <h2 className="text-3xl font-black text-slate-900 mb-2">Abstract Submitted successfully!</h2>
      <p className="text-slate-500 font-medium mb-6">Your abstract for <strong className="text-slate-900">{form.teamName}</strong> is under review.</p>
      <button onClick={() => { setDone(false); setForm({ eventId: "", teamName: "", description: "" }); setFile(null); }} className="btn-primary">Submit Another Abstract</button>
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
          <form onSubmit={submit} className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center"><Trophy size={14} className="text-sky-500" /></div>
                Event & Team Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Select Event <span className="text-red-500">*</span></label>
                  <select required value={form.eventId} onChange={e => setForm({ ...form, eventId: e.target.value })} className="input">
                    <option value="" disabled>Choose an active event</option>
                    <option value="spring-2026">Spring Hackathon 2026</option>
                    <option value="ai-2026">AI Challenge 2026</option>
                    <option value="web-dev">Web Dev Sprint</option>
                  </select>
                </div>
                <div>
                  <label className="label">Team Name <span className="text-red-500">*</span></label>
                  <input required type="text" value={form.teamName} onChange={e => setForm({ ...form, teamName: e.target.value })} placeholder="e.g. Project-X" className="input" />
                </div>
              </div>
              <div className="mb-4">
                <label className="label">Project Description</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief overview of your solution..." className="input"></textarea>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
                <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center"><FileText size={14} className="text-violet-500" /></div>
                Document Upload
              </h3>
              
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-sky-400 hover:bg-sky-50/50 transition-colors relative">
                <input type="file" required onChange={handleFileChange} accept=".pdf,.ppt,.pptx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                {!file ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                      <Upload size={24} />
                    </div>
                    <p className="font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-slate-500">PDF or PPTX (Max 10MB)</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                      <FileText size={24} />
                    </div>
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
              <button type="submit" className="btn-primary">Submit Abstract<ChevronRight size={16} /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
