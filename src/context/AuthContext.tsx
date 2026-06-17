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

// Remembers that this device successfully signed in at least once. Lets a
// returning user keep working in local-only mode if Supabase is later
// unreachable (e.g. a paused free-tier project), instead of being trapped at a
// magic-link login page they can't pass while the cloud is down.
const PRIOR_LOGIN_KEY = "nlgd_prior_login";

// Hard ceiling on the initial session check. supabase-js can hang indefinitely
// trying to refresh an expired token when the host doesn't resolve, which would
// leave the app stuck on a blank screen. If we hit this, fall through to
// local-only mode instead of waiting forever.
const SESSION_TIMEOUT_MS = 4000;

function hasPriorLogin(): boolean {
  try {
    return !!localStorage.getItem(PRIOR_LOGIN_KEY);
  } catch {
    return false;
  }
}

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
      if (userId) {
        // We reached Supabase and have a real session: clear any
        // "unavailable" state and remember this device has signed in.
        setSupabaseUnavailable(false);
        try {
          localStorage.setItem(PRIOR_LOGIN_KEY, s?.user?.email ?? "1");
        } catch {
          /* ignore storage failures */
        }
      }
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

    // Check for existing session, but never block the app forever: if Supabase
    // is unreachable the session check can hang, so race it against a timeout.
    const sessionTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("session-check-timeout")), SESSION_TIMEOUT_MS)
    );
    Promise.race([getSession(), sessionTimeout])
      .then((s) => adoptSession(s as Session | null))
      .catch(() => {
        // Supabase unavailable or too slow — fall through to local-only mode
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
    try {
      localStorage.removeItem(PRIOR_LOGIN_KEY);
    } catch {
      /* ignore storage failures */
    }
    await signOut();
    setSession(null);
  }, []);

  // Bypass auth in local dev (no Supabase email flow needed)
  const isDevBypass = !isSupabaseConfigured() || import.meta.env.DEV;
  // If Supabase is unreachable but this device signed in before, let the user
  // keep working locally rather than trapping them at a login they can't pass.
  const offlineFallback = supabaseUnavailable && hasPriorLogin();
  const isAuthenticated = isDevBypass || !!session?.user || offlineFallback;
  const userEmail =
    session?.user?.email ??
    (isDevBypass ? "dev@localhost" : offlineFallback ? "offline" : null);

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
