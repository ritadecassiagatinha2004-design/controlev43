import { Wallet, TrendingUp, DollarSign, Users } from "lucide-react";
import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { StatCard } from "@/components/StatCard";
import { CashFlowTable } from "@/components/CashFlowTable";
import { dashboardData, formatCurrency } from "@/data/financialData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Header />
        <NavigationTabs />
        
        <main className="py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={`Caixa Atual (${dashboardData.caixaAtual.month})`}
              value={formatCurrency(dashboardData.caixaAtual.value)}
              subtitle="Saldo em caixa"
              icon={Wallet}
              iconVariant="purple"
            />
            <StatCard
              title="Investimento"
              value={formatCurrency(dashboardData.investimento.value)}
              subtitle="Valor aplicado"
              icon={TrendingUp}
              iconVariant="purple"
            />
            <StatCard
              title="Entrada Mensal"
              value={formatCurrency(dashboardData.entradaMensal.value)}
              subtitle="Total do mês atual"
              icon={DollarSign}
              iconVariant="green"
            />
            <StatCard
              title="Filhos da Casa"
              value={String(dashboardData.filhosDaCasa)}
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
