import React, { useEffect, useState } from "react";
import { Star, Trophy } from "lucide-react";
import { leaderboardAPI } from "../../lib/api";

const rankCls = {
  1: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  2: "bg-slate-200 text-slate-700 border border-slate-300",
  3: "bg-amber-100 text-amber-800 border border-amber-200",
};

export default function DashboardLeaderboard({ eventId, eventName }) {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const req = eventId
      ? leaderboardAPI.byEvent(eventId)
      : leaderboardAPI.global();
    req.then(({ data }) => setData(data.slice(0, 10)))
       .catch(() => setData([]))
       .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div className="card p-8 text-center text-slate-400 font-medium">Loading rankings...</div>;
  if (!data.length) return <div className="card p-8 text-center text-slate-400 font-medium">No scores recorded yet.</div>;

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
          <Trophy size={17} className="text-sky-500" />{eventName || "Global"} Rankings
        </h3>
        <span className="badge-sky">{data.length} Teams</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="table-head">Rank</th>
              <th className="table-head">Team</th>
              <th className="table-head">Track</th>
              <th className="table-head text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.map(t => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="table-cell">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-sm ${rankCls[t.rank] || "bg-slate-50 text-slate-400 border border-slate-200"}`}>{t.rank}</span>
                </td>
                <td className="table-cell font-extrabold text-slate-900">{t.team}</td>
                <td className="table-cell"><span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md text-xs font-bold">{t.track}</span></td>
                <td className="table-cell text-right">
                  <span className="inline-flex items-center gap-1 bg-sky-50 border border-sky-200 px-2 py-1 rounded-lg text-sky-600 font-black text-sm">
                    {parseFloat(t.score).toFixed(1)}<Star size={11} className="fill-sky-500 text-sky-500" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
