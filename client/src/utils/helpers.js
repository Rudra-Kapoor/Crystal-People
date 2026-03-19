export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function getCurrentMonthYear() {
  const now = new Date();
  return { month: MONTHS[now.getMonth()], year: now.getFullYear() };
}

export function scoreToColor(score) {
  if (score >= 4.5) return "text-emerald-600 bg-emerald-50";
  if (score >= 3.5) return "text-sky-600 bg-sky-50";
  if (score >= 2.5) return "text-amber-600 bg-amber-50";
  return "text-rose-600 bg-rose-50";
}

export function scoreToBarColor(score) {
  if (score >= 4.5) return "bg-emerald-500";
  if (score >= 3.5) return "bg-sky-500";
  if (score >= 2.5) return "bg-amber-500";
  return "bg-rose-500";
}

export function scoreLabel(score) {
  if (score >= 4.5) return "Exceptional";
  if (score >= 3.5) return "Good";
  if (score >= 2.5) return "Satisfactory";
  if (score >= 1.5) return "Needs Improvement";
  return "Poor";
}

export function avgScore(review) {
  if (!review) return 0;
  return +((review.outputQuality + review.attendance + review.teamwork) / 3).toFixed(1);
}

export function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function sortReviewsDesc(reviews) {
  return [...reviews].sort((a, b) => {
    const da = new Date(`${a.month} 1 ${a.year}`);
    const db = new Date(`${b.month} 1 ${b.year}`);
    return db - da;
  });
}

export function getTeamStats(reviews) {
  if (!reviews.length) return { avgScore: 0, topPerformer: null, needsAttention: null, reviewedCount: 0 };

  // Latest review per employee
  const byEmployee = {};
  reviews.forEach((r) => {
    const key = r.employeeId;
    const prev = byEmployee[key];
    if (!prev || new Date(`${r.month} 1 ${r.year}`) > new Date(`${prev.month} 1 ${prev.year}`)) {
      byEmployee[key] = r;
    }
  });

  const latest = Object.values(byEmployee);
  const scores = latest.map((r) => avgScore(r));
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;

  const sorted = [...latest].sort((a, b) => avgScore(b) - avgScore(a));
  return {
    avgScore: +mean.toFixed(1),
    topPerformer: sorted[0] || null,
    needsAttention: sorted[sorted.length - 1] || null,
    reviewedCount: latest.length,
  };
}
