import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem("crystal_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // login now fetches from Sheets/localStorage
  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (result.success) {
      setUser(result.user);
      sessionStorage.setItem("crystal_user", JSON.stringify(result.user));
    }
    return result;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("crystal_user");
  };

  // Update cached user after profile changes
  const refreshUser = (updated) => {
    setUser(updated);
    sessionStorage.setItem("crystal_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
