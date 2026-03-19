import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Calendar, MessageSquare, Sparkles } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { fetchEmployeeReviews } from "../services/sheetsService";
import { summarizePerformanceTrend } from "../services/claudeService";
import { avgScore, scoreToColor, scoreToBarColor, scoreLabel, formatDate, sortReviewsDesc } from "../utils/helpers";
import AIPanel from "./AIPanel";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendSummary, setTrendSummary] = useState(null);
  const [trendLoading, setTrendLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline"); // "timeline" | "charts"

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const { data } = await fetchEmployeeReviews(user.id);
    setReviews(sortReviewsDesc(data));
    setLoading(false);
  }, [user.id]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const handleTrendSummary = async () => {
    setTrendLoading(true);
    setTrendSummary(null);
    const res = await summarizePerformanceTrend(reviews, user.name);
    setTrendSummary(res);
    setTrendLoading(false);
  };

  // Chart data (chronological)
  const chartData = [...reviews]
    .sort((a, b) => new Date(`${a.month} 1 ${a.year}`) - new Date(`${b.month} 1 ${b.year}`))
    .map((r) => ({
      label: `${r.month.slice(0, 3)} ${String(r.year).slice(-2)}`,
      "Output Quality": r.outputQuality,
      Attendance: r.attendance,
      Teamwork: r.teamwork,
      Average: +avgScore(r),
    }));

  // Latest review for radar
  const latestReview = reviews[0] || null;
  const radarData = latestReview
    ? [
        { subject: "Output Quality", value: latestReview.outputQuality, fullMark: 5 },
        { subject: "Attendance",     value: latestReview.attendance,    fullMark: 5 },
        { subject: "Teamwork",       value: latestReview.teamwork,      fullMark: 5 },
      ]
    : [];

  // Overall stats
  const overallAvg = reviews.length
    ? +(reviews.reduce((s, r) => s + avgScore(r), 0) / reviews.length).toFixed(1)
    : null;
  const latestAvg = latestReview ? avgScore(latestReview) : null;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          Loading your performance data…
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Hero */}
      <div className="card bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-0 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-16 h-16 rounded-2xl ${user.avatar} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
            {user.initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-indigo-200 text-sm mt-0.5">{user.department} · {user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Reviews", value: reviews.length },
            { label: "Latest Score", value: latestAvg != null ? `${latestAvg}/5` : "—" },
            { label: "All-time Avg", value: overallAvg != null ? `${overallAvg}/5` : "—" },
          ].map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl px-4 py-3">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-indigo-200 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Trend Button + Panel */}
      <div className="space-y-3">
        <button
          onClick={handleTrendSummary}
          disabled={trendLoading || reviews.length === 0}
          className="btn-primary"
        >
          <Sparkles size={16} />
          {trendLoading ? "Analysing your trend…" : "Generate AI Performance Summary"}
        </button>

        {(trendSummary || trendLoading) && (
          <AIPanel
            title="📈 Your Performance Trend — AI Analysis"
            content={trendSummary?.text}
            loading={trendLoading}
            error={trendSummary?.success === false ? trendSummary.error : null}
            onRefresh={handleTrendSummary}
          />
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { id: "timeline", icon: <Calendar size={15} />, label: "Timeline" },
          { id: "charts",   icon: <TrendingUp size={15} />, label: "Charts" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Timeline view ─────────────────────────────────────────── */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-slate-500 font-medium">No reviews yet</p>
              <p className="text-sm text-slate-400 mt-1">Your manager hasn't submitted any reviews for you yet.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 ml-4" />

              <div className="space-y-4 pl-16">
                {reviews.map((review, i) => {
                  const avg = avgScore(review);
                  return (
                    <div key={review.id} className="relative animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                      {/* Dot */}
                      <div className={`absolute -left-11 w-4 h-4 rounded-full border-2 border-white shadow ${scoreToBarColor(avg)} mt-4`} />

                      <div className="card hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-slate-800 text-lg">
                              {review.month} {review.year}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              <Calendar size={11} className="inline mr-1" />
                              Reviewed on {formatDate(review.timestamp)} by {review.managerName}
                            </p>
                          </div>
                          <div className={`text-2xl font-bold px-4 py-2 rounded-xl ${scoreToColor(avg)}`}>
                            {avg}
                            <span className="text-sm font-normal">/5</span>
                          </div>
                        </div>

                        {/* Score bars */}
                        <div className="grid sm:grid-cols-3 gap-4 mb-4">
                          {[
                            { label: "Output Quality", icon: "📋", value: review.outputQuality },
                            { label: "Attendance",     icon: "📅", value: review.attendance },
                            { label: "Teamwork",       icon: "🤝", value: review.teamwork },
                          ].map((s) => (
                            <div key={s.label} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 flex items-center gap-1">{s.icon} {s.label}</span>
                                <span className="font-semibold text-slate-700">{s.value}/5</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${scoreToBarColor(s.value)} rounded-full transition-all duration-500`}
                                  style={{ width: `${(s.value / 5) * 100}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400">{scoreLabel(s.value)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Comment */}
                        {review.comment && (
                          <div className="bg-slate-50 rounded-xl px-4 py-3">
                            <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                              <MessageSquare size={12} />
                              Manager Feedback
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed italic">"{review.comment}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Charts view ───────────────────────────────────────────── */}
      {activeTab === "charts" && (
        <div className="space-y-6">
          {reviews.length < 2 ? (
            <div className="card text-center py-12 text-slate-500">
              Need at least 2 reviews to show charts.
            </div>
          ) : (
            <>
              {/* Line chart */}
              <div className="card">
                <h3 className="font-semibold text-slate-800 mb-5">Score Trend Over Time</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="Output Quality" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Attendance"     stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Teamwork"       stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Average"        stroke="#8b5cf6" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Radar chart for latest */}
              {latestReview && (
                <div className="card">
                  <h3 className="font-semibold text-slate-800 mb-2">Latest Review — Skill Radar</h3>
                  <p className="text-xs text-slate-400 mb-4">{latestReview.month} {latestReview.year}</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <Radar name={user.name} dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
