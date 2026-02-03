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
    <nav className="flex items-center gap-1 border-b border-border">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;
        
        return (
          <Link
            key={tab.id}
            to={tab.path}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px]",
              isActive
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
