import { Home, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon: typeof Home;
}

const tabs: Tab[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "mensalidades", label: "Mensalidades", icon: DollarSign },
  { id: "gastos", label: "Gastos", icon: TrendingDown },
  { id: "entradas", label: "Entradas", icon: TrendingUp },
];

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function NavigationTabs({ activeTab, onTabChange }: NavigationTabsProps) {
  return (
    <nav className="flex items-center gap-1 bg-card rounded-xl p-1 shadow-sm w-fit">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
