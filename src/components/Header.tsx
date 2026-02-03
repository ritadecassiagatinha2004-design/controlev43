import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-xl font-bold">
          <span className="text-foreground">C.E.C.P.B.E.C.P</span>
          <span className="text-primary ml-2">2025</span>
        </h1>
        <p className="text-sm text-muted-foreground">Sistema de Controle</p>
      </div>
      <Button variant="outline" className="gap-2 text-muted-foreground">
        <Settings className="w-4 h-4" />
        Admin
      </Button>
    </header>
  );
}
