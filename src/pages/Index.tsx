import { Wallet, TrendingUp, DollarSign, Users, Pencil, Save, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { CashFlowTable } from "@/components/CashFlowTable";
import { useDashboardConfig, useCashFlow, formatCurrency, useUpdateDashboardConfig } from "@/hooks/useFinancialData";
import { useAuthContext } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { data: config, isLoading: configLoading } = useDashboardConfig();
  const { isLoading: cashFlowLoading } = useCashFlow();
  const { isAdmin } = useAuthContext();
  const updateConfig = useUpdateDashboardConfig();
  const { toast } = useToast();
  
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    caixa_atual_value: 0,
    caixa_atual_month: "",
    investimento_value: 0,
    entrada_mensal_value: 0,
    entrada_mensal_month: "",
    filhos_da_casa: 12,
  });

  const handleEdit = () => {
    if (config) {
      setEditData({
        caixa_atual_value: config.caixa_atual_value,
        caixa_atual_month: config.caixa_atual_month,
        investimento_value: config.investimento_value,
        entrada_mensal_value: config.entrada_mensal_value,
        entrada_mensal_month: config.entrada_mensal_month,
        filhos_da_casa: config.filhos_da_casa,
      });
      setEditing(true);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    
    try {
      await updateConfig.mutateAsync({
        id: config.id,
        ...editData,
      });
      setEditing(false);
      toast({
        title: "Salvo!",
        description: "Configurações atualizadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    }
  };

  const isLoading = configLoading || cashFlowLoading;

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <>
          {/* Admin Edit Button */}
          {isAdmin && !editing && (
            <div className="mb-4 flex justify-end">
              <Button onClick={handleEdit} className="gap-2">
                <Pencil className="w-4 h-4" />
                Editar Dashboard
              </Button>
            </div>
          )}

          {/* Edit Mode */}
          {editing && (
            <Card className="mb-6 border-primary">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Editar Configurações</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Caixa Atual (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.caixa_atual_value}
                      onChange={(e) => setEditData({ ...editData, caixa_atual_value: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Mês do Caixa</label>
                    <Input
                      value={editData.caixa_atual_month}
                      onChange={(e) => setEditData({ ...editData, caixa_atual_month: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Investimento (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.investimento_value}
                      onChange={(e) => setEditData({ ...editData, investimento_value: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Entrada Mensal (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.entrada_mensal_value}
                      onChange={(e) => setEditData({ ...editData, entrada_mensal_value: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Mês da Entrada</label>
                    <Input
                      value={editData.entrada_mensal_month}
                      onChange={(e) => setEditData({ ...editData, entrada_mensal_month: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Filhos da Casa</label>
                    <Input
                      type="number"
                      value={editData.filhos_da_casa}
                      onChange={(e) => setEditData({ ...editData, filhos_da_casa: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={updateConfig.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {updateConfig.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title={`Caixa Atual (${config?.caixa_atual_month || ""})`}
              value={formatCurrency(config?.caixa_atual_value || 0)}
              subtitle="Saldo em caixa"
              icon={Wallet}
              iconVariant="purple"
            />
            <StatCard
              title="Investimento"
              value={formatCurrency(config?.investimento_value || 0)}
              subtitle="Valor aplicado"
              icon={TrendingUp}
              iconVariant="purple"
            />
            <StatCard
              title="Entrada Mensal"
              value={formatCurrency(config?.entrada_mensal_value || 0)}
              subtitle="Total do mês atual"
              icon={DollarSign}
              iconVariant="green"
            />
            <StatCard
              title="Filhos da Casa"
              value={String(config?.filhos_da_casa || 0)}
              subtitle="Membros ativos"
              icon={Users}
              iconVariant="blue"
            />
          </div>

          {/* Cash Flow Table */}
          <CashFlowTable />
        </>
      )}
    </Layout>
  );
};

export default Index;
