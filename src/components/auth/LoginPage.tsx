import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { signInWithMagicLink, isEmailAllowed } from "@/lib/auth";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isEmailAllowed(email)) {
      setError("This email is not authorized");
      return;
    }

    setSending(true);
    const result = await signInWithMagicLink(email);
    setSending(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccessMessage("Check your email for a sign-in link");
    }
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
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
              autoFocus
            />
            <Button
              type="submit"
              disabled={sending}
              className="w-full bg-sage hover:bg-sage-dark"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            {successMessage && (
              <p className="text-sm text-green-600 text-center">{successMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
