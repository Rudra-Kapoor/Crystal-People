// Hardcoded users — no auth system needed for this prototype
// In production replace with a real auth system

export const USERS = [
  // ── Manager ─────────────────────────────────────────────
  {
    id: "mgr-001",
    email: "manager@crystal.com",
    password: "manager123",
    role: "manager",
    name: "Sarah Mitchell",
    initials: "SM",
    avatar: "bg-indigo-600",
    department: "Management",
  },

  // ── Employees ────────────────────────────────────────────
  { id: "emp-001", email: "alice.johnson@crystal.com",   password: "emp123", role: "employee", name: "Alice Johnson",   initials: "AJ", avatar: "bg-rose-500",    department: "Engineering"  },
  { id: "emp-002", email: "bob.williams@crystal.com",    password: "emp123", role: "employee", name: "Bob Williams",    initials: "BW", avatar: "bg-sky-500",     department: "Design"       },
  { id: "emp-003", email: "carol.chen@crystal.com",      password: "emp123", role: "employee", name: "Carol Chen",      initials: "CC", avatar: "bg-emerald-500", department: "Engineering"  },
  { id: "emp-004", email: "david.patel@crystal.com",     password: "emp123", role: "employee", name: "David Patel",     initials: "DP", avatar: "bg-amber-500",   department: "Sales"        },
  { id: "emp-005", email: "eva.martinez@crystal.com",    password: "emp123", role: "employee", name: "Eva Martinez",    initials: "EM", avatar: "bg-violet-500",  department: "Marketing"    },
  { id: "emp-006", email: "frank.nguyen@crystal.com",    password: "emp123", role: "employee", name: "Frank Nguyen",    initials: "FN", avatar: "bg-teal-500",    department: "Engineering"  },
  { id: "emp-007", email: "grace.kim@crystal.com",       password: "emp123", role: "employee", name: "Grace Kim",       initials: "GK", avatar: "bg-pink-500",    department: "HR"           },
  { id: "emp-008", email: "henry.okonkwo@crystal.com",   password: "emp123", role: "employee", name: "Henry Okonkwo",   initials: "HO", avatar: "bg-orange-500",  department: "Finance"      },
  { id: "emp-009", email: "isabella.russo@crystal.com",  password: "emp123", role: "employee", name: "Isabella Russo",  initials: "IR", avatar: "bg-cyan-500",    department: "Design"       },
  { id: "emp-010", email: "james.taylor@crystal.com",    password: "emp123", role: "employee", name: "James Taylor",    initials: "JT", avatar: "bg-lime-600",    department: "Sales"        },
  { id: "emp-011", email: "karen.brown@crystal.com",     password: "emp123", role: "employee", name: "Karen Brown",     initials: "KB", avatar: "bg-red-500",     department: "Marketing"    },
  { id: "emp-012", email: "liam.smith@crystal.com",      password: "emp123", role: "employee", name: "Liam Smith",      initials: "LS", avatar: "bg-blue-500",    department: "Engineering"  },
  { id: "emp-013", email: "maya.garcia@crystal.com",     password: "emp123", role: "employee", name: "Maya Garcia",     initials: "MG", avatar: "bg-fuchsia-500", department: "Operations"   },
  { id: "emp-014", email: "noah.lee@crystal.com",        password: "emp123", role: "employee", name: "Noah Lee",        initials: "NL", avatar: "bg-indigo-500",  department: "Finance"      },
  { id: "emp-015", email: "olivia.white@crystal.com",    password: "emp123", role: "employee", name: "Olivia White",    initials: "OW", avatar: "bg-yellow-500",  department: "Sales"        },
  { id: "emp-016", email: "peter.jackson@crystal.com",   password: "emp123", role: "employee", name: "Peter Jackson",   initials: "PJ", avatar: "bg-stone-500",   department: "Engineering"  },
  { id: "emp-017", email: "quinn.adams@crystal.com",     password: "emp123", role: "employee", name: "Quinn Adams",     initials: "QA", avatar: "bg-slate-500",   department: "Design"       },
  { id: "emp-018", email: "rachel.thomas@crystal.com",   password: "emp123", role: "employee", name: "Rachel Thomas",   initials: "RT", avatar: "bg-green-500",   department: "HR"           },
  { id: "emp-019", email: "sam.harris@crystal.com",      password: "emp123", role: "employee", name: "Sam Harris",      initials: "SH", avatar: "bg-purple-500",  department: "Operations"   },
  { id: "emp-020", email: "tara.wilson@crystal.com",     password: "emp123", role: "employee", name: "Tara Wilson",     initials: "TW", avatar: "bg-pink-600",    department: "Marketing"    },
];

export const EMPLOYEES = USERS.filter((u) => u.role === "employee");
export const MANAGER = USERS.find((u) => u.role === "manager");

export const findUser = (email, password) =>
  USERS.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
  ) || null;
