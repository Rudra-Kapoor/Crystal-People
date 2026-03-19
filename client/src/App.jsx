import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import ManagerDashboard from "./components/ManagerDashboard";
import EmployeeDashboard from "./components/EmployeeDashboard";

function AppInner() {
  const { user } = useAuth();

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        {user.role === "manager" ? <ManagerDashboard /> : <EmployeeDashboard />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
