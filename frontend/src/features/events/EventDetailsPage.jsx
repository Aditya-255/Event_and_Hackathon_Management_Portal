import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, ChevronRight, Trophy, Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { eventsAPI } from "../../lib/api";

const statusCls = {
  "Active":            "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Registration Open": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Upcoming":          "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Completed":         "bg-slate-500/40 text-slate-300 border-slate-500/30",
  "Draft":             "bg-slate-500/40 text-slate-300 border-slate-500/30",
};

export default function EventDetailsPage() {
  const { id }    = useParams();
  const [ev,      setEv]      = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    eventsAPI.getOne(id)
      .then(({ data }) => setEv(data))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 size={40} className="animate-spin text-sky-500" />
    </div>
  );

  if (error || !ev) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <p className="text-2xl font-black text-slate-900 mb-2">Event Not Found</p>
      <Link to="/events" className="text-sky-500 font-bold hover:underline">Back to Events</Link>
    </div>
  );

  const teamsCount = parseInt(ev.teams_count || 0);
  const maxTeams   = parseInt(ev.max_teams || 50);
  const pct        = maxTeams > 0 ? Math.round((teamsCount / maxTeams) * 100) : 0;
  const spotsLeft  = Math.max(0, maxTeams - teamsCount);
  const isOpen     = ["Active", "Registration Open"].includes(ev.status);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-8">
        <Link to="/events" className="hover:text-sky-500 transition-colors">Events</Link>
        <ChevronRight size={14} />
        <span className="text-slate-700">{ev.title}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
            <div className="relative h-56">
              <img src={ev.image_url || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200"} alt={ev.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
              <div className="absolute bottom-5 left-6">
                <span className={"inline-block px-3 py-1.5 backdrop-blur-md rounded-full text-xs font-black mb-2 border " + (statusCls[ev.status] || statusCls.Draft)}>
                  {ev.status?.toUpperCase()}
                </span>
                <h1 className="text-3xl font-black text-white">{ev.title}</h1>
              </div>
            </div>
            <div className="p-8">
              <p className="text-slate-500 font-medium leading-relaxed text-lg mb-6">{ev.description || "Join this exciting event and showcase your skills."}</p>
              {isOpen && (
                <div className="flex flex-wrap gap-3">
                  <Link to="/dashboard/register-team" className="btn-primary">Register Team</Link>
                  <Link to="/dashboard/submit-abstract" className="btn-secondary">Submit Abstract</Link>
                </div>
              )}
            </div>
          </motion.div>
          <div className="card p-8">
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">About the Event</h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-6">{ev.description || "Details about this event will be posted soon."}</p>
            {ev.prize && (
              <>
                <h4 className="font-bold text-slate-900 mb-3">Prize Pool</h4>
                <div className="space-y-3">
                  {[
                    { p: "1st Place", v: ev.prize, c: "from-yellow-400 to-orange-400", bg: "bg-yellow-50 border-yellow-200" },
                    { p: "2nd Place", v: "Runner Up", c: "from-slate-400 to-slate-500", bg: "bg-slate-50 border-slate-200" },
                    { p: "3rd Place", v: "2nd Runner Up", c: "from-amber-600 to-amber-700", bg: "bg-amber-50 border-amber-200" },
                  ].map(x => (
                    <div key={x.p} className={"flex items-center gap-4 p-4 rounded-xl border " + x.bg}>
                      <div className={"w-10 h-10 rounded-xl bg-gradient-to-br " + x.c + " flex items-center justify-center"}><Trophy size={18} className="text-white" /></div>
                      <div><p className="font-bold text-slate-900">{x.p}</p><p className="text-sm text-slate-500">{x.v}</p></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <h3 className="font-bold text-slate-900 mb-5">Event Overview</h3>
            <div className="space-y-4">
              {[
                { icon: Calendar, label: "Date",      v: ev.start_date ? new Date(ev.start_date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "TBD", s: ev.end_date ? "Ends " + new Date(ev.end_date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}) : "", c: "bg-sky-50 text-sky-500" },
                { icon: MapPin,   label: "Location",  v: ev.location || "TBD",  s: ev.organizer_name ? "By " + ev.organizer_name : "", c: "bg-violet-50 text-violet-500" },
                { icon: Users,    label: "Team Size", v: "2-4 Members",          s: "All disciplines",                                  c: "bg-emerald-50 text-emerald-500" },
                { icon: Award,    label: "Prize",     v: ev.prize || "TBD",      s: "Across positions",                                 c: "bg-amber-50 text-amber-500" },
              ].map(({ icon: Icon, label, v, s, c }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className={"w-10 h-10 " + c + " rounded-xl flex items-center justify-center shrink-0"}><Icon size={18} /></div>
                  <div><p className="text-xs font-bold text-slate-400">{label}</p><p className="font-bold text-slate-900">{v}</p>{s && <p className="text-xs text-slate-400">{s}</p>}</div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 mb-3">Registration</h3>
            <div className="flex justify-between text-sm font-semibold text-slate-500 mb-2"><span>{teamsCount} / {maxTeams} teams</span><span>{pct}%</span></div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className={"h-full rounded-full " + (pct >= 100 ? "bg-red-400" : "bg-gradient-to-r from-sky-500 to-violet-500")} style={{ width: Math.min(pct,100) + "%" }} />
            </div>
            <p className="text-xs text-slate-400 font-medium">{pct >= 100 ? "Event is full" : spotsLeft + " spots remaining"}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
            <Trophy size={80} className="absolute -bottom-4 -right-4 text-white/5" />
            <h3 className="font-bold mb-2">Ready to win?</h3>
            <p className="text-sm text-slate-400 mb-5">Register your team and submit your abstract before the deadline.</p>
            {isOpen ? (
              <Link to="/dashboard/register-team" className="block w-full text-center px-4 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">Register Now</Link>
            ) : (
              <div className="w-full text-center px-4 py-3 bg-white/10 text-slate-400 font-bold rounded-xl">{ev.status === "Completed" ? "Event Ended" : "Registration Closed"}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}