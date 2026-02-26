import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export async function signInWithMagicLink(email: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase not configured" };

  const { error } = await supabase.auth.signInWithOtp({ email });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function getUser(session: Session | null): User | null {
  return session?.user ?? null;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  if (!supabase) return { unsubscribe: () => {} };

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return { unsubscribe: () => data.subscription.unsubscribe() };
}
