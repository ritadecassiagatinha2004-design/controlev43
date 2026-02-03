import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between py-6 border-b border-border">
      <div>
        <h1 className="text-xl font-bold text-primary">
          Controle Financeiro
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-primary font-medium">{formattedDate}</span>
        <Button variant="outline" className="gap-2 text-muted-foreground">
          <Settings className="w-4 h-4" />
          Admin
        </Button>
      </div>
    </header>
  );
}
