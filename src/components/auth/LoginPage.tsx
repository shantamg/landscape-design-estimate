import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    setChecking(true);
    setError(false);

    // Small delay so the spinner is visible
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError(true);
        setPassword("");
      }
      setChecking(false);
    }, 300);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Branding */}
        <div className="text-center space-y-3">
          <img src="/logo.png" alt="Nancy Lyons Garden Design" className="w-16 h-16 mx-auto" />
          <div>
            <h1 className="text-2xl font-heading font-bold text-forest tracking-wide">
              Nancy Lyons Garden Design
            </h1>
            <p className="text-sm text-stone tracking-wider uppercase mt-1">
              Estimate Builder
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
            />
            <Button
              type="submit"
              disabled={checking}
              className="w-full bg-sage hover:bg-sage-dark"
            >
              {checking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">Incorrect password</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
