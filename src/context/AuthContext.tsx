import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSession, signOut, onAuthStateChange } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { pullFromCloud } from "@/lib/sync";
import { applyCloudData } from "@/lib/storage";

interface AuthContextValue {
  isAuthenticated: boolean;
  session: Session | null;
  userEmail: string | null;
  logout: () => Promise<void>;
  supabaseUnavailable: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseUnavailable, setSupabaseUnavailable] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Pull cloud data into local storage once per signed-in user, so saved
    // estimates/invoices (and recorded payments) appear on any device. Without
    // this the app only ever pushes local data up and never reads it back.
    let pulledUserId: string | null = null;
    async function adoptSession(s: Session | null) {
      const userId = s?.user?.id ?? null;
      if (userId && userId !== pulledUserId) {
        pulledUserId = userId;
        try {
          const cloud = await pullFromCloud();
          if (cloud) applyCloudData(cloud);
        } catch (err) {
          console.error("[auth] cloud pull failed:", err);
        }
      }
      setSession(s);
      setLoading(false);
    }

    // Check for existing session
    getSession()
      .then(adoptSession)
      .catch(() => {
        // Supabase unavailable — fall through to local-only mode
        setSupabaseUnavailable(true);
        setLoading(false);
      });

    // Listen for auth state changes (magic link callback, sign out, etc.)
    const { unsubscribe } = onAuthStateChange((s) => {
      void adoptSession(s);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
  }, []);

  // Bypass auth in local dev (no Supabase email flow needed)
  const isDevBypass = !isSupabaseConfigured() || import.meta.env.DEV;
  const isAuthenticated = isDevBypass || !!session?.user;
  const userEmail = session?.user?.email ?? (isDevBypass ? "dev@localhost" : null);

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, session, userEmail, logout, supabaseUnavailable }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
