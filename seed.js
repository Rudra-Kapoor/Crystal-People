import dotenv from "dotenv";
dotenv.config();

const SHEETS_URL = process.env.VITE_SHEETS_API_URL;
if (!SHEETS_URL) {
  console.error("VITE_SHEETS_API_URL is missing in .env");
  process.exit(1);
}

const DEMO_SEED_USERS = [
  { id: "mgr-001",  name: "Sarah Mitchell",  email: "manager@crystal.com",          password: "manager123", role: "manager",   department: "Management",   initials: "SM", avatar: "bg-indigo-600",  managerId: "",       createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-001",  name: "Alice Johnson",   email: "alice.johnson@crystal.com",    password: "emp123",     role: "employee",  department: "Engineering",  initials: "AJ", avatar: "bg-rose-500",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-002",  name: "Bob Williams",    email: "bob.williams@crystal.com",     password: "emp123",     role: "employee",  department: "Design",       initials: "BW", avatar: "bg-sky-500",     managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-003",  name: "Carol Chen",      email: "carol.chen@crystal.com",       password: "emp123",     role: "employee",  department: "Engineering",  initials: "CC", avatar: "bg-emerald-500", managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-004",  name: "David Patel",     email: "david.patel@crystal.com",      password: "emp123",     role: "employee",  department: "Sales",        initials: "DP", avatar: "bg-amber-500",   managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-005",  name: "Eva Martinez",    email: "eva.martinez@crystal.com",     password: "emp123",     role: "employee",  department: "Marketing",    initials: "EM", avatar: "bg-violet-500",  managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-006",  name: "Frank Nguyen",    email: "frank.nguyen@crystal.com",     password: "emp123",     role: "employee",  department: "Engineering",  initials: "FN", avatar: "bg-teal-500",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-007",  name: "Grace Kim",       email: "grace.kim@crystal.com",        password: "emp123",     role: "employee",  department: "HR",           initials: "GK", avatar: "bg-pink-500",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-008",  name: "Henry Okonkwo",   email: "henry.okonkwo@crystal.com",    password: "emp123",     role: "employee",  department: "Finance",      initials: "HO", avatar: "bg-orange-500",  managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-009",  name: "Isabella Russo",  email: "isabella.russo@crystal.com",   password: "emp123",     role: "employee",  department: "Design",       initials: "IR", avatar: "bg-cyan-500",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-010",  name: "James Taylor",    email: "james.taylor@crystal.com",     password: "emp123",     role: "employee",  department: "Sales",        initials: "JT", avatar: "bg-lime-600",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-011",  name: "Karen Brown",     email: "karen.brown@crystal.com",      password: "emp123",     role: "employee",  department: "Marketing",    initials: "KB", avatar: "bg-red-500",     managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-012",  name: "Liam Smith",      email: "liam.smith@crystal.com",       password: "emp123",     role: "employee",  department: "Engineering",  initials: "LS", avatar: "bg-blue-500",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-013",  name: "Maya Garcia",     email: "maya.garcia@crystal.com",      password: "emp123",     role: "employee",  department: "Operations",   initials: "MG", avatar: "bg-fuchsia-500", managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-014",  name: "Noah Lee",        email: "noah.lee@crystal.com",         password: "emp123",     role: "employee",  department: "Finance",      initials: "NL", avatar: "bg-indigo-500",  managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-015",  name: "Olivia White",    email: "olivia.white@crystal.com",     password: "emp123",     role: "employee",  department: "Sales",        initials: "OW", avatar: "bg-yellow-500",  managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-016",  name: "Peter Jackson",   email: "peter.jackson@crystal.com",    password: "emp123",     role: "employee",  department: "Engineering",  initials: "PJ", avatar: "bg-stone-500",   managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-017",  name: "Quinn Adams",     email: "quinn.adams@crystal.com",      password: "emp123",     role: "employee",  department: "Design",       initials: "QA", avatar: "bg-slate-500",   managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-018",  name: "Rachel Thomas",   email: "rachel.thomas@crystal.com",    password: "emp123",     role: "employee",  department: "HR",           initials: "RT", avatar: "bg-green-500",   managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-019",  name: "Sam Harris",      email: "sam.harris@crystal.com",       password: "emp123",     role: "employee",  department: "Operations",   initials: "SH", avatar: "bg-purple-500",  managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "emp-020",  name: "Tara Wilson",     email: "tara.wilson@crystal.com",      password: "emp123",     role: "employee",  department: "Marketing",    initials: "TW", avatar: "bg-pink-600",    managerId: "mgr-001", createdAt: "2025-01-01T00:00:00.000Z" },
];

function generateReviews() {
  const months = [
    { month: "October",  year: 2024 },
    { month: "November", year: 2024 },
    { month: "December", year: 2024 },
    { month: "January",  year: 2025 },
    { month: "February", year: 2025 },
    { month: "March",    year: 2025 },
  ];

  const empData = DEMO_SEED_USERS.filter(u => u.role === "employee").slice(0, 8);

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
        employeeId:   emp.id,
        employeeName: emp.name,
        month:        m.month,
        year:         m.year,
        outputQuality: Math.min(5, Math.max(1, base + Math.floor(Math.random() * 3) - 1)),
        attendance:    Math.min(5, Math.max(1, base + Math.floor(Math.random() * 3) - 1)),
        teamwork:      Math.min(5, Math.max(1, base + Math.floor(Math.random() * 3) - 1)),
        comment:      comments[(idCount + idx) % comments.length],
        managerId:    "mgr-001",
        managerName:  "Sarah Mitchell",
        timestamp:    new Date(m.year, idx, 15).toISOString(),
      });
    });
  });

  return reviews;
}

async function run() {
  console.log("Seeding Google Sheets...");
  // 1. Send Users
  let userCount = 0;
  for (const user of DEMO_SEED_USERS) {
    try {
      const resp = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addUser", user }),
      });
      const data = await resp.json();
      if (data.success || data.error === "Email already exists") {
        userCount++;
      } else {
        console.error("Failed to add user", user.email, data.error);
      }
    } catch(err) {
      console.error("Error connecting for user", user.email, err.message);
    }
  }
  console.log(`Finished checking/adding ${userCount} users.`);

  // 2. Send Reviews
  const reviews = generateReviews();
  let revCount = 0;
  for (const review of reviews) {
    try {
      const resp = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submitReview", review }),
      });
      const data = await resp.json();
      if (data.success) {
        revCount++;
      } else {
        console.error("Failed to add review", review.id, data.error);
      }
    } catch(err){
      console.error("Error connecting for review", review.id, err.message);
    }
  }
  console.log(`Finished adding ${revCount} reviews.`);
  console.log("Seed completed!");
}

run();
