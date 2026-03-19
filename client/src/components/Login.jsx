import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Eye, EyeOff, Zap } from "lucide-react";
import { signupManager } from "../services/userService";
import { isDemoMode } from "../services/sheetsService";

// Demo credentials shown when no Sheets URL is configured
const DEMO_MANAGER = { email: "manager@crystal.com", password: "manager123", name: "Sarah Mitchell (Manager)" };
const DEMO_EMPLOYEES = [
  { email: "alice.johnson@crystal.com",  password: "emp123", name: "Alice Johnson" },
  { email: "bob.williams@crystal.com",   password: "emp123", name: "Bob Williams" },
  { email: "carol.chen@crystal.com",     password: "emp123", name: "Carol Chen" },
  { email: "david.patel@crystal.com",    password: "emp123", name: "David Patel" },
  { email: "eva.martinez@crystal.com",   password: "emp123", name: "Eva Martinez" },
];

export default function Login() {
  const { login } = useAuth();
  const [tab, setTab] = useState("login");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const [sName, setSName]         = useState("");
  const [sEmail, setSEmail]       = useState("");
  const [sPassword, setSPassword] = useState("");
  const [sDept, setSDept]         = useState("");
  const [sError, setSError]       = useState("");
  const [sLoading, setSLoading]   = useState(false);
  const [sSuccess, setSSuccess]   = useState(false);
  const [showDemoEmployees, setShowDemoEmployees] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (!result.success) setError(result.error);
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSError("");
    if (sPassword.length < 6) { setSError("Password must be at least 6 characters"); return; }
    setSLoading(true);
    const result = await signupManager({ name: sName, email: sEmail, password: sPassword, department: sDept });
    if (result.success) {
      setSSuccess(true);
      await login(sEmail, sPassword);
    } else {
      setSError(result.error || "Signup failed. Try again.");
    }
    setSLoading(false);
  };

  // One-click fill credentials
  const quickFill = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setTab("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-violet-900 to-indigo-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500 opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-brand mb-4 shadow-lg shadow-indigo-900/50">
            <span className="text-3xl">💎</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Crystal People</h1>
          <p className="text-indigo-300 mt-1 text-sm">Performance Management Hub</p>
          {isDemoMode && (
            <span className="mt-2 inline-block bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs px-3 py-1 rounded-full">
              ⚡ Demo Mode — using local data
            </span>
          )}
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">

          {/* Tabs */}
          <div className="flex gap-1 bg-white/10 rounded-xl p-1 mb-6">
            {[{ id: "login", label: "Sign In" }, { id: "signup", label: "Manager Sign Up" }].map((t) => (
              <button key={t.id} onClick={() => { setTab(t.id); setError(""); setSError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white text-indigo-700 shadow-sm" : "text-indigo-200 hover:text-white"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Login Form ── */}
          {tab === "login" && (
            <>
              {error && (
                <div className="mb-4 bg-rose-500/20 border border-rose-400/30 text-rose-200 text-sm rounded-xl px-4 py-3 animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourcompany.com" required
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300/60 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                    <button type="button" onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full gradient-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition-all">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                    : "Sign in"}
                </button>
              </form>

              {/* ── Demo credentials section ── */}
              {isDemoMode && (
                <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                  <p className="text-xs font-medium text-indigo-300 flex items-center gap-1.5">
                    <Zap size={12} className="text-amber-400" />
                    Demo accounts — click any to fill credentials instantly
                  </p>

                  {/* Manager quick login */}
                  <button onClick={() => quickFill(DEMO_MANAGER)}
                    className="w-full flex items-center gap-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-xl px-4 py-3 transition-all text-left">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">SM</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold">Sarah Mitchell — Manager</p>
                      <p className="text-indigo-300 text-xs truncate">{DEMO_MANAGER.email}</p>
                    </div>
                    <span className="text-indigo-400 text-xs">👔 Manager</span>
                  </button>

                  {/* Employee quick logins toggle */}
                  <button onClick={() => setShowDemoEmployees((v) => !v)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 transition-all text-left">
                    <span className="text-indigo-200 text-xs font-medium">👤 Employee accounts (5 shown)</span>
                    <span className="text-indigo-400 text-xs">{showDemoEmployees ? "▲ Hide" : "▼ Show"}</span>
                  </button>

                  {showDemoEmployees && (
                    <div className="space-y-2 animate-fade-in">
                      {DEMO_EMPLOYEES.map((emp) => {
                        const initials = emp.name.split(" ").map((w) => w[0]).join("");
                        return (
                          <button key={emp.email} onClick={() => quickFill(emp)}
                            className="w-full flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 transition-all text-left">
                            <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium">{emp.name}</p>
                              <p className="text-indigo-300 text-xs truncate">{emp.email}</p>
                            </div>
                            <span className="text-slate-400 text-xs font-mono">{emp.password}</span>
                          </button>
                        );
                      })}
                      <p className="text-xs text-indigo-400 text-center pt-1">
                        All 20 employees use password <span className="font-mono text-indigo-300">emp123</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!isDemoMode && (
                <p className="text-xs text-indigo-400 text-center mt-5">
                  New manager?{" "}
                  <button onClick={() => setTab("signup")} className="underline text-indigo-300 hover:text-white">
                    Sign up here.
                  </button>
                  <br />Employees — ask your manager to add you from their dashboard.
                </p>
              )}
            </>
          )}

          {/* ── Signup Form ── */}
          {tab === "signup" && (
            <>
              <p className="text-sm text-indigo-200 mb-5">
                Create a manager account. Then add your employees from the dashboard.
              </p>

              {sError && (
                <div className="mb-4 bg-rose-500/20 border border-rose-400/30 text-rose-200 text-sm rounded-xl px-4 py-3 animate-fade-in">
                  {sError}
                </div>
              )}
              {sSuccess && (
                <div className="mb-4 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm rounded-xl px-4 py-3">
                  ✅ Account created! Logging you in…
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">Full Name</label>
                  <input type="text" value={sName} onChange={(e) => setSName(e.target.value)}
                    placeholder="Sarah Mitchell" required
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">Work Email</label>
                  <input type="email" value={sEmail} onChange={(e) => setSEmail(e.target.value)}
                    placeholder="manager@company.com" required
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">Department</label>
                  <input type="text" value={sDept} onChange={(e) => setSDept(e.target.value)}
                    placeholder="e.g. Engineering, Sales, HR…"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-indigo-200 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} value={sPassword} onChange={(e) => setSPassword(e.target.value)}
                      placeholder="Min. 6 characters" required
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300/60 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all" />
                    <button type="button" onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={sLoading || sSuccess}
                  className="w-full gradient-brand text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 mt-2 transition-all">
                  {sLoading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</>
                    : "Create Manager Account"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}