// Google Sheets Service
// All data is persisted via a Google Apps Script Web App (see /google-apps-script/Code.gs)
// Set VITE_SHEETS_API_URL in your .env after deploying the Apps Script

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL || "";

// Demo mode: when no Sheets URL is set, use localStorage
const DEMO_MODE = !BASE_URL;

const DEMO_KEY = "crystal_reviews_demo";

function getDemoReviews() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveDemoReviews(reviews) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(reviews));
}

// ── Seed demo data if empty ──────────────────────────────────────
function seedDemoData() {
  const existing = getDemoReviews();
  if (existing.length > 0) return;

  const months = [
    { month: "January",  year: 2025 },
    { month: "February", year: 2025 },
    { month: "March",    year: 2025 },
    { month: "April",    year: 2025 },
    { month: "May",      year: 2025 },
    { month: "June",     year: 2025 },
  ];

  const empData = [
    { id: "emp-001", name: "Alice Johnson",   baseDept: "Engineering" },
    { id: "emp-002", name: "Bob Williams",    baseDept: "Design"      },
    { id: "emp-003", name: "Carol Chen",      baseDept: "Engineering" },
    { id: "emp-004", name: "David Patel",     baseDept: "Sales"       },
    { id: "emp-005", name: "Eva Martinez",    baseDept: "Marketing"   },
    { id: "emp-006", name: "Frank Nguyen",    baseDept: "Engineering" },
    { id: "emp-007", name: "Grace Kim",       baseDept: "HR"          },
    { id: "emp-008", name: "Henry Okonkwo",   baseDept: "Finance"     },
  ];

  const sampleComments = [
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
      const base = 3 + (Math.random() > 0.5 ? 1 : 0);
      reviews.push({
        id: `rev-demo-${String(idCount++).padStart(4, "0")}`,
        employeeId: emp.id,
        employeeName: emp.name,
        month: m.month,
        year: m.year,
        outputQuality: Math.min(5, Math.max(1, base + Math.floor(Math.random() * 2) - 0)),
        attendance:    Math.min(5, Math.max(1, base + Math.floor(Math.random() * 2) - 1)),
        teamwork:      Math.min(5, Math.max(1, base + Math.floor(Math.random() * 2) - 0)),
        comment: sampleComments[(idCount + idx) % sampleComments.length],
        managerId: "mgr-001",
        managerName: "Sarah Mitchell",
        timestamp: new Date(m.year, months.indexOf(m), 15).toISOString(),
      });
    });
  });

  saveDemoReviews(reviews);
}

// ── API calls ────────────────────────────────────────────────────

export async function fetchAllReviews() {
  if (DEMO_MODE) {
    seedDemoData();
    return { success: true, data: getDemoReviews() };
  }

  try {
    const url = `${BASE_URL}?action=getReviews`;
    const res = await fetch(url, { redirect: "follow" });
    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (err) {
    console.error("Sheets fetch error:", err);
    return { success: false, error: err.message, data: [] };
  }
}

export async function fetchEmployeeReviews(employeeId) {
  const { data, success, error } = await fetchAllReviews();
  const filtered = data.filter((r) => r.employeeId === employeeId);
  return { success, error, data: filtered };
}

export async function submitReview(review) {
  const newReview = {
    id: `rev-${Date.now()}`,
    ...review,
    timestamp: new Date().toISOString(),
  };

  if (DEMO_MODE) {
    const existing = getDemoReviews();
    // Replace if same employee + month + year already exists
    const idx = existing.findIndex(
      (r) =>
        r.employeeId === review.employeeId &&
        r.month === review.month &&
        r.year === review.year
    );
    if (idx >= 0) existing[idx] = newReview;
    else existing.push(newReview);
    saveDemoReviews(existing);
    return { success: true, data: newReview };
  }

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submitReview", review: newReview }),
      redirect: "follow",
    });
    const json = await res.json();
    return { success: json.success, data: json.data };
  } catch (err) {
    console.error("Sheets submit error:", err);
    return { success: false, error: err.message };
  }
}

export const isDemoMode = DEMO_MODE;
