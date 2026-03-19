import { useState } from "react";
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { avgScore, scoreToColor, scoreToBarColor, sortReviewsDesc, MONTHS, getCurrentMonthYear } from "../utils/helpers";

const { month: CURR_MONTH, year: CURR_YEAR } = getCurrentMonthYear();

export default function TeamOverview({ reviews, employees = [], loading }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name" | "score" | "reviewed"
  const [sortDir, setSortDir] = useState("asc");
  const [filterMonth, setFilterMonth] = useState(CURR_MONTH);
  const [filterYear, setFilterYear] = useState(CURR_YEAR);

  if (loading) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          Loading team data…
        </div>
      </div>
    );
  }

  // Build per-employee summary
  const employeeData = employees.map((emp) => {
    const empReviews = reviews.filter((r) => r.employeeId === emp.id);
    const monthReview = empReviews.find(
      (r) => r.month === filterMonth && r.year === filterYear
    );
    const allSorted = sortReviewsDesc(empReviews);
    const latestReview = allSorted[0] || null;

    return {
      ...emp,
      reviews: empReviews,
      monthReview,
      latestReview,
      totalReviews: empReviews.length,
      avgAll: empReviews.length
        ? +( empReviews.reduce((s, r) => s + avgScore(r), 0) / empReviews.length ).toFixed(1)
        : null,
    };
  });

  // Filter + sort
  const filtered = employeeData
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va, vb;
      if (sortBy === "name")     { va = a.name; vb = b.name; }
      else if (sortBy === "score") { va = a.monthReview ? avgScore(a.monthReview) : -1; vb = b.monthReview ? avgScore(b.monthReview) : -1; }
      else                       { va = a.totalReviews; vb = b.totalReviews; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) =>
    sortBy === col ? (
      sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
    ) : (
      <ChevronDown size={13} className="opacity-30" />
    );

  const reviewedCount = filtered.filter((e) => e.monthReview).length;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="card flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee or department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="input py-2 text-sm"
          >
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="input py-2 text-sm"
          >
            {[CURR_YEAR - 1, CURR_YEAR, CURR_YEAR + 1].map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>

        <div className="text-sm text-slate-500 ml-auto">
          <span className="font-semibold text-indigo-700">{reviewedCount}</span>/{filtered.length} reviewed this period
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 cursor-pointer hover:text-indigo-600" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">Employee <SortIcon col="name" /></span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Department</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-indigo-600" onClick={() => toggleSort("score")}>
                  <span className="flex items-center justify-center gap-1">{filterMonth} Score <SortIcon col="score" /></span>
                </th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Output</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Attendance</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Teamwork</th>
                <th className="text-center px-4 py-3 font-semibold text-slate-600 cursor-pointer hover:text-indigo-600" onClick={() => toggleSort("reviewed")}>
                  <span className="flex items-center justify-center gap-1">Total Reviews <SortIcon col="reviewed" /></span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => {
                const r = emp.monthReview;
                const avg = r ? avgScore(r) : null;
                return (
                  <tr key={emp.id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                    {/* Employee */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${emp.avatar} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          {emp.initials}
                        </div>
                        <span className="font-medium text-slate-800">{emp.name}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3 text-slate-500 text-xs">{emp.department}</td>

                    {/* Score */}
                    <td className="px-4 py-3 text-center">
                      {avg != null ? (
                        <span className={`badge font-bold text-sm px-3 py-1 ${scoreToColor(avg)}`}>{avg}</span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Dimensions */}
                    {["outputQuality", "attendance", "teamwork"].map((dim) => (
                      <td key={dim} className="px-4 py-3 text-center">
                        {r ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-slate-700">{r[dim]}</span>
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className={`h-full ${scoreToBarColor(r[dim])} rounded-full`} style={{ width: `${(r[dim] / 5) * 100}%` }} />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    ))}

                    {/* Total reviews */}
                    <td className="px-4 py-3 text-center">
                      <span className="text-slate-600 font-medium">{emp.totalReviews}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {r ? (
                        <span className="badge bg-emerald-100 text-emerald-700">✓ Reviewed</span>
                      ) : (
                        <span className="badge bg-rose-100 text-rose-600">⚠ Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
