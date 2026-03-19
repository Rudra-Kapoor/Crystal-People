const BASE_URL = import.meta.env.VITE_SHEETS_API_URL || "";
export const isDemoMode = !BASE_URL;

const DEMO_USERS_KEY = "crystal_users_demo";

const AVATAR_COLORS = [
  "bg-rose-500","bg-sky-500","bg-emerald-500","bg-amber-500",
  "bg-violet-500","bg-teal-500","bg-pink-500","bg-orange-500",
  "bg-cyan-500","bg-lime-600","bg-red-500","bg-blue-500",
  "bg-indigo-500","bg-purple-500","bg-green-500","bg-yellow-500",
  "bg-fuchsia-500","bg-slate-500","bg-stone-500","bg-pink-600",
];

export function randomAvatar(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export function makeInitials(name = "") {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

// ── Hardcoded demo users — always available in demo mode ─────────
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

// ── Demo storage helpers ──────────────────────────────────────────
function getDemoUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "null");
    // If nothing stored yet, seed with demo users
    if (!stored || stored.length === 0) {
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEMO_SEED_USERS));
      return DEMO_SEED_USERS;
    }
    // Merge: always ensure seed users exist (in case localStorage was partially cleared)
    const storedIds = new Set(stored.map((u) => u.id));
    const merged = [...stored];
    for (const seedUser of DEMO_SEED_USERS) {
      if (!storedIds.has(seedUser.id)) merged.push(seedUser);
    }
    return merged;
  } catch {
    return DEMO_SEED_USERS;
  }
}

function saveDemoUsers(users) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

// ── Fetch all users ───────────────────────────────────────────────
export async function fetchUsers() {
  if (isDemoMode) {
    return { success: true, data: getDemoUsers() };
  }
  try {
    const API_BASE = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${API_BASE}/api/sheets?action=getUsers`);
    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (err) {
    return { success: false, error: err.message, data: [] };
  }
}

// ── Login ─────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const { data, success, error } = await fetchUsers();
  if (!success) return { success: false, error: error || "Could not load users" };

  const found = data.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!found) return { success: false, error: "Invalid email or password" };

  const { password: _, ...safeUser } = found;
  return { success: true, user: safeUser };
}

// ── Manager signup ────────────────────────────────────────────────
export async function signupManager({ name, email, password, department }) {
  const id = `mgr-${Date.now()}`;
  const user = {
    id,
    name,
    email,
    password,
    role: "manager",
    department: department || "Management",
    initials: makeInitials(name),
    avatar: "bg-indigo-600",
    managerId: "",
    createdAt: new Date().toISOString(),
  };

  if (isDemoMode) {
    const existing = getDemoUsers();
    if (existing.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already exists" };
    }
    saveDemoUsers([...existing, user]);
    const { password: _, ...safe } = user;
    return { success: true, user: safe };
  }

  try {
    const API_BASE = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${API_BASE}/api/sheets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addUser", user }),
      redirect: "follow",
    });
    const json = await res.json();
    if (!json.success) return { success: false, error: json.error };
    const { password: _, ...safe } = user;
    return { success: true, user: safe };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Add employee ──────────────────────────────────────────────────
export async function addEmployee({ name, email, password, department, managerId }, existingCount = 0) {
  const id = `emp-${Date.now()}`;
  const user = {
    id,
    name,
    email,
    password,
    role: "employee",
    department,
    initials: makeInitials(name),
    avatar: randomAvatar(existingCount),
    managerId,
    createdAt: new Date().toISOString(),
  };

  if (isDemoMode) {
    const existing = getDemoUsers();
    if (existing.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already exists" };
    }
    saveDemoUsers([...existing, user]);
    const { password: _, ...safe } = user;
    return { success: true, user: safe };
  }

  try {
    const API_BASE = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${API_BASE}/api/sheets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addUser", user }),
      redirect: "follow",
    });
    const json = await res.json();
    if (!json.success) return { success: false, error: json.error };
    const { password: _, ...safe } = user;
    return { success: true, user: safe };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Delete employee ───────────────────────────────────────────────
export async function deleteEmployee(userId) {
  if (isDemoMode) {
    const existing = getDemoUsers().filter((u) => u.id !== userId);
    saveDemoUsers(existing);
    return { success: true };
  }
  try {
        const API_BASE = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${API_BASE}/api/sheets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteUser", userId }),
      redirect: "follow",
    });
    const json = await res.json();
    return { success: json.success, error: json.error };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Fetch employees for a manager ─────────────────────────────────
export async function fetchEmployeesForManager(managerId) {
  const { data, success, error } = await fetchUsers();
  if (!success) return { success: false, error, data: [] };
  const employees = data.filter((u) => u.role === "employee" && u.managerId === managerId);
  return { success: true, data: employees };
}
