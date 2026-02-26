import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSession, signOut, onAuthStateChange } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

interface AuthContextValue {
  isAuthenticated: boolean;
  session: Session | null;
  userEmail: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Check for existing session
    getSession().then((s) => {
      setSession(s);
      setLoading(false);
    });

    // Listen for auth state changes (magic link callback, sign out, etc.)
    const { unsubscribe } = onAuthStateChange((s) => {
      setSession(s);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
  }, []);

  const isAuthenticated = !!session?.user;
  const userEmail = session?.user?.email ?? null;

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, session, userEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
