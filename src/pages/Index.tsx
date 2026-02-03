import { useState } from "react";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { StatCard } from "@/components/StatCard";
import { CashFlowTable } from "@/components/CashFlowTable";
import { DateBadge } from "@/components/DateBadge";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inicio");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Header />
        
        <main className="py-8">
          {/* Navigation and Date */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <DateBadge />
          </div>

          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Painel de Controle - Fevereiro
            </h2>
            <p className="text-muted-foreground">Visão geral das finanças da casa</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Caixa Atual (Outubro)"
              value="R$ 2.818,17"
              subtitle="Saldo em caixa"
              icon={DollarSign}
              iconVariant="purple"
            />
            <StatCard
              title="Investimento"
              value="R$ 5.451,72"
              subtitle="Valor aplicado"
              icon={TrendingUp}
              iconVariant="purple"
            />
            <StatCard
              title="Entrada Mensal"
              value="R$ 2.400,00"
              subtitle="Fevereiro"
              icon={TrendingUp}
              iconVariant="green"
            />
            <StatCard
              title="Filhos da Casa"
              value="12"
              subtitle="Membros ativos"
              icon={Users}
              iconVariant="blue"
            />
          </div>

          {/* Cash Flow Table */}
          <CashFlowTable />
        </main>
      </div>
    </div>
  );
};

export default Index;
