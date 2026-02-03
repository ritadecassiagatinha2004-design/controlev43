import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { AdminLoginDialog } from "@/components/AdminLoginDialog";

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAdmin, signOut, user } = useAuthContext();
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
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
      <header className="flex items-center justify-between py-6 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-primary">
            Controle Financeiro
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary font-medium">{formattedDate}</span>
          {isAdmin && user ? (
            <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          ) : (
            <Button variant="outline" className="gap-2 text-muted-foreground" onClick={() => setLoginOpen(true)}>
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          )}
        </div>
      </header>
      <AdminLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
