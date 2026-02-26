import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, CloudOff, Loader2, Check, AlertCircle, LogOut } from "lucide-react";

export function AuthStatus() {
  const { user, isConfigured, isLoading, syncStatus, sendMagicLink, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isConfigured) return null;
  if (isLoading) return null;

  // Signed in — show sync status
  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <SyncIndicator status={syncStatus} />
        <span className="text-stone hidden sm:inline truncate max-w-[140px]">
          {user.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="h-7 px-2 text-stone hover:text-forest"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  // Magic link sent
  if (sent) {
    return (
      <div className="flex items-center gap-2 text-sm text-sage-dark">
        <Check className="h-4 w-4" />
        <span>Check your email</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setSent(false); setShowInput(false); }}
          className="h-7 px-2 text-stone"
        >
          Dismiss
        </Button>
      </div>
    );
  }

  // Email input form
  if (showInput) {
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email.trim()) return;
          setSending(true);
          setError(null);
          const result = await sendMagicLink(email.trim());
          setSending(false);
          if (result.error) {
            setError(result.error);
          } else {
            setSent(true);
          }
        }}
        className="flex items-center gap-2"
      >
        <Input
          type="email"
          placeholder="Email for cloud sync"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-8 w-48 text-sm"
          autoFocus
        />
        <Button
          type="submit"
          size="sm"
          disabled={sending}
          className="h-8 bg-sage hover:bg-sage-dark text-sm"
        >
          {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Send Link"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => { setShowInput(false); setError(null); }}
          className="h-7 px-2 text-stone"
        >
          Cancel
        </Button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </form>
    );
  }

  // Default: sign-in button
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setShowInput(true)}
      className="h-8 gap-1.5 text-stone hover:text-forest text-sm"
    >
      <CloudOff className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Enable Cloud Sync</span>
    </Button>
  );
}

function SyncIndicator({ status }: { status: string }) {
  switch (status) {
    case "syncing":
      return <Loader2 className="h-3.5 w-3.5 text-sage animate-spin" />;
    case "synced":
      return <Cloud className="h-3.5 w-3.5 text-sage" />;
    case "error":
      return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
    default:
      return <Cloud className="h-3.5 w-3.5 text-stone/50" />;
  }
}
