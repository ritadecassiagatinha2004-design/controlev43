import { Home, Users, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  icon: typeof Home;
  path: string;
}

const tabs: Tab[] = [
  { id: "inicio", label: "Início", icon: Home, path: "/" },
  { id: "mensalidades", label: "Mensalidades", icon: Users, path: "/mensalidades" },
  { id: "gastos", label: "Gastos", icon: TrendingDown, path: "/gastos" },
  { id: "entradas", label: "Entradas", icon: TrendingUp, path: "/entradas" },
];

export function NavigationTabs() {
  const location = useLocation();

  return (
    <nav className="grid grid-cols-2 gap-2 py-2 -mx-3 sm:mx-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <Link
            key={tab.id}
            to={tab.path}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
