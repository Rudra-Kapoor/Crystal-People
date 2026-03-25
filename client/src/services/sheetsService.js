// All Sheets calls go through Render backend to avoid CORS issues
const API_BASE = import.meta.env.VITE_API_URL || "";
export const isDemoMode = !import.meta.env.VITE_API_URL;

const DEMO_KEY = "crystal_reviews_demo";

// ── Demo helpers ─────────────────────────────────────────────────
function getDemoReviews() {
  try { return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]"); }
  catch { return []; }
}

function saveDemoReviews(reviews) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(reviews));
}

function seedDemoData() {
  if (getDemoReviews().length > 0) return;

  const months = [
    { month: "October",  year: 2024 },
    { month: "November", year: 2024 },
    { month: "December", year: 2024 },
    { month: "January",  year: 2025 },
    { month: "February", year: 2025 },
    { month: "March",    year: 2025 },
  ];

  const empData = [
    { id: "emp-001", name: "Alice Johnson"  },
    { id: "emp-002", name: "Bob Williams"   },
    { id: "emp-003", name: "Carol Chen"     },
    { id: "emp-004", name: "David Patel"    },
    { id: "emp-005", name: "Eva Martinez"   },
    { id: "emp-006", name: "Frank Nguyen"   },
    { id: "emp-007", name: "Grace Kim"      },
    { id: "emp-008", name: "Henry Okonkwo"  },
  ];

  const comments = [
    "Excellent work this month. Delivered all tasks ahead of deadline.",
    "Good performance overall with some room for improvement in communication.",
    "Showed great initiative and helped teammates with blockers.",
    "Attendance was slightly inconsistent but quality of work remained high.",
    "Proactive in team meetings and contributed solid ideas.",
    "Met expectations. Should focus more on independent problem solving.",
    "Outstanding collaboration with cross-functional teams.",
    "Needs to work on time management to avoid last-minute rushes.",
  ];

  const reviews = [];
  let idCount = 1;

  empData.forEach((emp) => {
    months.forEach((m, idx) => {
      const base = 3;
      reviews.push({
        id: `rev-demo-${String(idCount++).padStart(4, "0")}`,
        employeeId:    emp.id,
        employeeName:  emp.name,
        month:         m.month,
        year:          m.year,
        outputQuality: Math.min(5, Math.max(1, base + Math.floor(Math.random() * 3) - 1)),
        attendance:    Math.min(5, Math.max(1, base + Math.floor(Math.random() * 3) - 1)),
        teamwork:      Math.min(5, Math.max(1, base + Math.floor(Math.random() * 3) - 1)),
        comment:       comments[(idCount + idx) % comments.length],
        managerId:     "mgr-001",
        managerName:   "Sarah Mitchell",
        timestamp:     new Date(m.year, idx, 15).toISOString(),
      });
    });
  });

  saveDemoReviews(reviews);
}

// ── Fetch all reviews ─────────────────────────────────────────────
export async function fetchAllReviews() {
  if (isDemoMode) {
    seedDemoData();
    return { success: true, data: getDemoReviews() };
  }
  try {
    const res = await fetch(`${API_BASE}/api/sheets?action=getReviews`);
    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (err) {
    console.error("Sheets fetch error:", err);
    return { success: false, error: err.message, data: [] };
  }
}

// ── Fetch reviews for one employee ────────────────────────────────
export async function fetchEmployeeReviews(employeeId) {
  const { data, success, error } = await fetchAllReviews();
  return { success, error, data: data.filter((r) => r.employeeId === employeeId) };
}

// ── Submit a review ───────────────────────────────────────────────
export async function submitReview(review) {
  const newReview = {
    id: `rev-${Date.now()}`,
    ...review,
    timestamp: new Date().toISOString(),
  };

  if (isDemoMode) {
    const existing = getDemoReviews();
    // Always append in Demo Mode to match Sheets behavior (keeps history)
    existing.push(newReview);
    saveDemoReviews(existing);
    return { success: true, data: newReview };
  }

  try {
    const res = await fetch(`${API_BASE}/api/sheets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submitReview", review: newReview }),
    });
    const json = await res.json();
    return { success: json.success, data: json.data };
  } catch (err) {
    console.error("Sheets submit error:", err);
    return { success: false, error: err.message };
  }
}
