import { useState, useEffect, useCallback } from "react";
import { Users, TrendingUp, ClipboardCheck, Send, Wand2, ShieldAlert, Lightbulb, ChevronDown, Settings } from "lucide-react";
import { MONTHS, getCurrentMonthYear, avgScore, scoreToColor, getTeamStats } from "../utils/helpers";
import { fetchAllReviews, submitReview } from "../services/sheetsService";
import { fetchEmployeesForManager } from "../services/userService";
import { checkFeedbackConsistency, improveFeedback, suggestImprovements } from "../services/claudeService";
import { useAuth } from "../contexts/AuthContext";
import ScoreSlider from "./ScoreSlider";
import AIPanel from "./AIPanel";
import HRAssistant from "./HRAssistant";
import TeamOverview from "./TeamOverview";
import ManageTeam from "./ManageTeam";

const { month: CURR_MONTH, year: CURR_YEAR } = getCurrentMonthYear();

export default function ManagerDashboard() {
  const { user } = useAuth();

  const [employees, setEmployees]   = useState([]);
  const [empLoading, setEmpLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [month, setMonth] = useState(CURR_MONTH);
  const [year, setYear]   = useState(CURR_YEAR);
  const [scores, setScores]   = useState({ outputQuality: 3, attendance: 3, teamwork: 3 });
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [allReviews, setAllReviews]     = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [consistencyResult, setConsistencyResult] = useState(null);
  const [consistencyLoading, setConsistencyLoading] = useState(false);
  const [improvedFeedback, setImprovedFeedback]   = useState(null);
  const [improveLoading, setImproveLoading]       = useState(false);
  const [improveSuggestions, setImproveSuggestions] = useState(null);
  const [suggestLoading, setSuggestLoading]         = useState(false);

  const [activeTab, setActiveTab] = useState("review");

  const loadEmployees = useCallback(async () => {
    setEmpLoading(true);
    const { data } = await fetchEmployeesForManager(user.id);
    setEmployees(data);
    if (data.length > 0 && !selectedEmployee) setSelectedEmployee(data[0]);
    setEmpLoading(false);
  }, [user.id]);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    const { data } = await fetchAllReviews();
    // filter to only this manager's employees
    setAllReviews(data);
    setReviewsLoading(false);
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);
  useEffect(() => { loadReviews(); },  [loadReviews]);

  const teamStats = getTeamStats(allReviews);

  const handleCheckConsistency = async () => {
    if (!comment.trim()) return;
    setConsistencyLoading(true); setConsistencyResult(null);
    const res = await checkFeedbackConsistency(scores, comment);
    setConsistencyResult(res); setConsistencyLoading(false);
  };

  const handleImproveFeedback = async () => {
    if (!comment.trim() || !selectedEmployee) return;
    setImproveLoading(true); setImprovedFeedback(null);
    const res = await improveFeedback(scores, comment, selectedEmployee.name);
    setImprovedFeedback(res); setImproveLoading(false);
  };

  const handleSuggestImprovements = async () => {
    if (!selectedEmployee) return;
    setSuggestLoading(true); setImproveSuggestions(null);
    const res = await suggestImprovements(scores, comment, selectedEmployee.name);
    setImproveSuggestions(res); setSuggestLoading(false);
  };

  const applyImprovedFeedback = () => {
    if (improvedFeedback?.text) { setComment(improvedFeedback.text); setImprovedFeedback(null); }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee) { alert("Please select an employee."); return; }
    if (!comment.trim())   { alert("Please add a comment before submitting."); return; }
    setSubmitting(true);
    const result = await submitReview({
      employeeId: selectedEmployee.id, employeeName: selectedEmployee.name,
      month, year, ...scores, comment, managerId: user.id, managerName: user.name,
    });
    if (result.success) {
      setSubmitSuccess(true);
      setComment(""); setScores({ outputQuality: 3, attendance: 3, teamwork: 3 });
      setConsistencyResult(null); setImprovedFeedback(null); setImproveSuggestions(null);
      loadReviews();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } else {
      alert("Failed to save review.");
    }
    setSubmitting(false);
  };

  const years = [CURR_YEAR - 1, CURR_YEAR, CURR_YEAR + 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: "👥", label: "Team Size",      value: employees.length },
          { icon: "📊", label: "Reviewed",        value: teamStats.reviewedCount },
          { icon: "⭐", label: "Team Average",    value: teamStats.avgScore || "–" },
          { icon: "🏆", label: "Top Performer",   value: teamStats.topPerformer?.employeeName?.split(" ")[0] || "–" },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
        {[
          { id: "review", icon: <ClipboardCheck size={15} />, label: "New Review" },
          { id: "team",   icon: <Users size={15} />,          label: "Team Overview" },
          { id: "hr",     icon: <TrendingUp size={15} />,     label: "HR Assistant" },
          { id: "manage", icon: <Settings size={15} />,       label: "Manage Team" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── Review Form ── */}
      {activeTab === "review" && (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="card space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardCheck size={20} className="text-indigo-600" />Monthly Performance Review
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">Score an employee across three dimensions and add feedback.</p>
              </div>

              {empLoading ? (
                <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />Loading team…
                </div>
              ) : employees.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-4">
                  ⚠️ No employees yet. Go to <button onClick={() => setActiveTab("manage")} className="underline font-medium">Manage Team</button> to add your first employee.
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="label">Employee</label>
                      <div className="relative">
                        <select value={selectedEmployee?.id || ""} onChange={(e) => setSelectedEmployee(employees.find((emp) => emp.id === e.target.value))} className="input appearance-none pr-8">
                          {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Month</label>
                      <div className="relative">
                        <select value={month} onChange={(e) => setMonth(e.target.value)} className="input appearance-none pr-8">
                          {MONTHS.map((m) => <option key={m}>{m}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Year</label>
                      <div className="relative">
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input appearance-none pr-8">
                          {years.map((y) => <option key={y}>{y}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {selectedEmployee && (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                      <div className={`w-10 h-10 rounded-full ${selectedEmployee.avatar || "bg-slate-400"} flex items-center justify-center text-white font-bold text-sm`}>
                        {selectedEmployee.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{selectedEmployee.name}</div>
                        <div className="text-xs text-slate-500">{selectedEmployee.department} · {selectedEmployee.email}</div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <ScoreSlider label="Output Quality" icon="📋" value={scores.outputQuality} onChange={(v) => setScores((s) => ({ ...s, outputQuality: v }))} />
                    <ScoreSlider label="Attendance"     icon="📅" value={scores.attendance}    onChange={(v) => setScores((s) => ({ ...s, attendance: v }))} />
                    <ScoreSlider label="Teamwork"       icon="🤝" value={scores.teamwork}      onChange={(v) => setScores((s) => ({ ...s, teamwork: v }))} />
                  </div>

                  <div className={`text-center text-sm px-4 py-2 rounded-xl font-semibold ${scoreToColor(avgScore({ ...scores }))}`}>
                    Overall Average: {avgScore({ ...scores })}/5
                  </div>

                  <div>
                    <label className="label">Manager Comment</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} placeholder="Write your performance feedback here…" className="input resize-none" />
                    <p className="text-xs text-slate-400 mt-1">{comment.length} characters</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={handleCheckConsistency} disabled={!comment.trim() || consistencyLoading} className="btn-secondary text-sm disabled:opacity-50">
                      <ShieldAlert size={15} className="text-amber-500" />Check Consistency
                    </button>
                    <button onClick={handleImproveFeedback} disabled={!comment.trim() || improveLoading} className="btn-secondary text-sm disabled:opacity-50">
                      <Wand2 size={15} className="text-violet-500" />Improve Feedback
                    </button>
                    <button onClick={handleSuggestImprovements} disabled={suggestLoading} className="btn-secondary text-sm disabled:opacity-50">
                      <Lightbulb size={15} className="text-amber-500" />Suggest Improvements
                    </button>
                  </div>

                  {submitSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 animate-fade-in">
                      ✅ Review saved successfully!
                    </div>
                  )}

                  <button onClick={handleSubmit} disabled={submitting || !comment.trim() || !selectedEmployee} className="btn-primary w-full justify-center">
                    {submitting
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                      : <><Send size={16} />Submit Review</>}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {(consistencyResult || consistencyLoading) && (
              <AIPanel title="Consistency Check" content={consistencyResult?.text} loading={consistencyLoading}
                error={consistencyResult?.success === false ? consistencyResult.error : null}
                onRefresh={handleCheckConsistency}
                variant={consistencyResult?.text?.startsWith("✅") ? "success" : "warning"} />
            )}
            {(improvedFeedback || improveLoading) && (
              <AIPanel title="✨ Improved Feedback" content={improvedFeedback?.text} loading={improveLoading}
                error={improvedFeedback?.success === false ? improvedFeedback.error : null}
                onRefresh={handleImproveFeedback}>
                {improvedFeedback?.text && (
                  <button onClick={applyImprovedFeedback} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                    Apply this feedback →
                  </button>
                )}
              </AIPanel>
            )}
            {(improveSuggestions || suggestLoading) && (
              <AIPanel title="💡 Improvement Actions" content={improveSuggestions?.text} loading={suggestLoading}
                error={improveSuggestions?.success === false ? improveSuggestions.error : null}
                onRefresh={handleSuggestImprovements} />
            )}
            {!consistencyResult && !consistencyLoading && !improvedFeedback && !improveLoading && !improveSuggestions && !suggestLoading && (
              <div className="ai-panel text-center py-8">
                <div className="text-4xl mb-3">🤖</div>
                <p className="text-sm font-medium text-indigo-700">Claude AI Assistant</p>
                <p className="text-xs text-slate-500 mt-1">Use the buttons above to check consistency, improve feedback, or get improvement suggestions.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "team"   && <TeamOverview reviews={allReviews} employees={employees} loading={reviewsLoading} />}
      {activeTab === "hr"     && <HRAssistant allReviews={allReviews} />}
      {activeTab === "manage" && <ManageTeam employees={employees} managerId={user.id} onRefresh={loadEmployees} />}
    </div>
  );
}
