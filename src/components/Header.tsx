import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { AdminLoginDialog } from "@/components/AdminLoginDialog";

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAdmin, signOut, user } = useAuthContext();

  const today = new Date();
  const formattedDateFull = today.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedDateShort = today.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-2 py-4 sm:py-6 border-b border-border">
        <h1 className="text-base sm:text-xl font-bold text-primary truncate">
          Controle Financeiro
        </h1>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <span className="hidden sm:inline text-sm text-primary font-medium">{formattedDateFull}</span>
          <span className="sm:hidden text-xs text-primary font-medium">{formattedDateShort}</span>
          {isAdmin && user ? (
            <Button size="sm" variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          ) : (
            <Button size="sm" variant="outline" className="gap-2 text-muted-foreground" onClick={() => setLoginOpen(true)}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}
        </div>
      </header>
      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
