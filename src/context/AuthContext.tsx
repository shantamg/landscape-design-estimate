import { createContext, useContext, useState, useCallback } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
const SESSION_KEY = "nlgd-authenticated";

interface AuthContextValue {
  isAuthenticated: boolean;
  isConfigured: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = !!ADMIN_PASSWORD;
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!configured) return true;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });

  const login = useCallback(
    (password: string): boolean => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "true");
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isConfigured: configured, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
