import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AuthStatus() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      className="h-7 px-2 text-stone hover:text-forest"
      title="Sign out"
    >
      <LogOut className="h-3.5 w-3.5" />
    </Button>
  );
}
