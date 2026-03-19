import { useState } from "react";
import { UserPlus, Trash2, Eye, EyeOff, Copy, Check } from "lucide-react";
import { addEmployee, deleteEmployee } from "../services/userService";
import { makeInitials } from "../services/userService";

export default function ManageTeam({ employees, managerId, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("emp123");
  const [dept, setDept]         = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const [copied, setCopied]     = useState("");
  const [deleting, setDeleting] = useState(null);

  const resetForm = () => {
    setName(""); setEmail(""); setPassword("emp123"); setDept("");
    setError(""); setSuccess(""); setShowForm(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email and password are required."); return;
    }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    setLoading(true);
    const result = await addEmployee(
      { name: name.trim(), email: email.trim(), password, department: dept.trim() || "General", managerId },
      employees.length
    );
    setLoading(false);
    if (result.success) {
      setSuccess(`✅ ${name} added! They can now log in with ${email} / ${password}`);
      setName(""); setEmail(""); setPassword("emp123"); setDept("");
      onRefresh();
    } else {
      setError(result.error || "Failed to add employee.");
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Remove ${emp.name} from the team? Their review history won't be deleted.`)) return;
    setDeleting(emp.id);
    await deleteEmployee(emp.id);
    onRefresh();
    setDeleting(null);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header + Add button */}
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">Team Members</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {employees.length} employee{employees.length !== 1 ? "s" : ""} · Add them here so they can log in
          </p>
        </div>
        <button onClick={() => { setShowForm((v) => !v); setError(""); setSuccess(""); }}
          className="btn-primary text-sm">
          <UserPlus size={16} />
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <div className="card border-indigo-100 bg-indigo-50/50 animate-slide-up space-y-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <UserPlus size={16} className="text-indigo-600" /> New Employee
          </h3>

          {error   && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3">{error}</div>}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl px-4 py-3 space-y-2">
              <p>{success}</p>
              <p className="text-xs text-emerald-600">Share these credentials with the employee so they can log in.</p>
            </div>
          )}

          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alice Johnson" className="input" required />
            </div>
            <div>
              <label className="label">Work Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alice@company.com" className="input" required />
            </div>
            <div>
              <label className="label">Department</label>
              <input type="text" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="Engineering, Sales, Design…" className="input" />
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 4 characters" className="input pr-9" required />
                <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Share this with the employee — they'll use it to log in.</p>
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</> : <><UserPlus size={15} />Add Employee</>}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Employee List */}
      {employees.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">👥</div>
          <p className="font-semibold text-slate-700">No employees yet</p>
          <p className="text-sm text-slate-400 mt-1">Click "Add Employee" above to get started.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Employee</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Department</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Login Email</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${emp.avatar || "bg-slate-400"} flex items-center justify-center text-white text-xs font-bold`}>
                        {emp.initials || makeInitials(emp.name)}
                      </div>
                      <span className="font-medium text-slate-800">{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{emp.department || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 font-mono text-xs">{emp.email}</span>
                      <button onClick={() => copyToClipboard(emp.email, `email-${emp.id}`)} className="text-slate-400 hover:text-indigo-600 transition-colors" title="Copy email">
                        {copied === `email-${emp.id}` ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(emp)}
                      disabled={deleting === emp.id}
                      className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all disabled:opacity-50"
                      title="Remove employee"
                    >
                      {deleting === emp.id
                        ? <div className="w-4 h-4 border-2 border-rose-300 border-t-rose-500 rounded-full animate-spin" />
                        : <Trash2 size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
