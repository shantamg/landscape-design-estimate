import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cloud, CloudOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signInWithMagicLink, signOut, getSession, isEmailAllowed, onAuthStateChange } from "@/lib/auth";
import {
  getSyncStatus,
  onSyncStatusChange,
  pushAllToCloud,
  flushSyncQueue,
} from "@/lib/sync";
import {
  listEstimates,
  listContracts,
  loadSettings,
  loadCatalog,
} from "@/lib/storage";

export function CloudSyncSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  // Check for existing session on mount + listen for auth state changes
  useEffect(() => {
    getSession().then((session) => {
      if (session?.user?.email) {
        setSignedInEmail(session.user.email);
      }
    });

    const { unsubscribe } = onAuthStateChange((session) => {
      setSignedInEmail(session?.user?.email ?? null);
      if (session?.user) {
        setSuccessMessage("");
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for sync status changes
  useEffect(() => {
    const unsubscribe = onSyncStatusChange((status) => {
      setSyncStatus(status);
      if (status === "synced") {
        setLastSynced(new Date().toLocaleTimeString());
      }
    });
    return unsubscribe;
  }, []);

  if (!isSupabaseConfigured()) return null;

  async function handleSendMagicLink() {
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    if (!isEmailAllowed(email)) {
      setError("This email is not authorized for cloud sync");
      return;
    }

    setSending(true);
    const result = await signInWithMagicLink(email);
    setSending(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage("Check your email for a sign-in link");
      setEmail("");
    }
  }

  async function handleSyncNow() {
    await pushAllToCloud({
      estimates: listEstimates(),
      contracts: listContracts(),
      settings: loadSettings(),
      catalogs: {
        plant: loadCatalog("plant"),
        service: loadCatalog("service"),
        material: loadCatalog("material"),
      },
    });
    await flushSyncQueue();
  }

  async function handleSignOut() {
    await signOut();
    setSignedInEmail(null);
    setSyncStatus("idle");
    setLastSynced(null);
  }

  // Signed-in state
  if (signedInEmail) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h3 className="text-base font-heading font-bold text-forest tracking-wide">
          Cloud Sync
        </h3>

        <div className="flex items-center gap-2 text-sm text-foreground">
          <Cloud className="h-4 w-4 text-sage" />
          <span>Signed in as <strong>{signedInEmail}</strong></span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {syncStatus === "syncing" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Syncing...</span>
            </>
          )}
          {syncStatus === "synced" && (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              <span>Synced{lastSynced ? ` at ${lastSynced}` : ""}</span>
            </>
          )}
          {syncStatus === "error" && (
            <>
              <AlertCircle className="h-3.5 w-3.5 text-red-500" />
              <span>Sync error — try again</span>
            </>
          )}
          {syncStatus === "idle" && (
            <>
              <CloudOff className="h-3.5 w-3.5" />
              <span>Not synced yet</span>
            </>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncNow}
            disabled={syncStatus === "syncing"}
          >
            {syncStatus === "syncing" ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Cloud className="h-3.5 w-3.5 mr-1.5" />
            )}
            Sync Now
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </section>
    );
  }

  // Signed-out state
  return (
    <section className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h3 className="text-base font-heading font-bold text-forest tracking-wide">
        Cloud Sync
      </h3>

      <p className="text-sm text-muted-foreground">
        Sign in to back up your estimates and settings to the cloud. Data syncs
        automatically so you can access it from any device.
      </p>

      <div className="flex gap-2 max-w-md">
        <Input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
            setSuccessMessage("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSendMagicLink()}
        />
        <Button
          variant="outline"
          onClick={handleSendMagicLink}
          disabled={sending}
          className="shrink-0"
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : null}
          Send Magic Link
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}
    </section>
  );
}
