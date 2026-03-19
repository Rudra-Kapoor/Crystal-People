import { LogOut, Bell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { isDemoMode } from "../services/sheetsService";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-sm">
              <span className="text-lg">💎</span>
            </div>
            <div>
              <span className="font-bold text-slate-800 text-lg leading-none">Crystal People</span>
              {isDemoMode && (
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  Demo Mode
                </span>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <span className={`badge text-xs ${user?.role === "manager" ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
              {user?.role === "manager" ? "👔 Manager" : "👤 Employee"}
            </span>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full ${user?.avatar || "bg-slate-400"} flex items-center justify-center text-white text-xs font-bold`}>
                {user?.initials}
              </div>
              <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="btn-ghost text-slate-400 hover:text-rose-500 text-sm"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
