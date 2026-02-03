import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCashFlow, formatCurrency, useUpdateCashFlow, useAddCashFlow, useDeleteCashFlow } from "@/hooks/useFinancialData";
import { useAdminStore } from "@/stores/adminStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function CashFlowTable() {
  const { data: cashFlow, isLoading } = useCashFlow();
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const updateCashFlow = useUpdateCashFlow();
  const addCashFlow = useAddCashFlow();
  const deleteCashFlow = useDeleteCashFlow();
  const { toast } = useToast();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ month: "", value: 0 });
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState({ month: "", value: 0 });

  const handleEdit = (item: { id: string; month: string; value: number }) => {
    setEditingId(item.id);
    setEditData({ month: item.month, value: item.value });
  };

  const handleSave = async (id: string) => {
    try {
      await updateCashFlow.mutateAsync({ id, ...editData });
      setEditingId(null);
      toast({ title: "Salvo!", description: "Caixa atualizado com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    try {
      await addCashFlow.mutateAsync({
        month: newData.month,
        value: newData.value,
        display_order: (cashFlow?.length || 0) + 1,
      });
      setAdding(false);
      setNewData({ month: "", value: 0 });
      toast({ title: "Adicionado!", description: "Novo mês adicionado com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCashFlow.mutateAsync(id);
      toast({ title: "Removido!", description: "Mês removido com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Carregando...</div>;
  }

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Caixa da Casa</CardTitle>
          {isAdmin && !adding && (
            <Button size="sm" variant="outline" onClick={() => setAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Add new row */}
        {adding && (
          <div className="flex items-center gap-2 py-4 border-b border-border bg-muted/50 px-2 rounded mb-2">
            <Input
              placeholder="Mês"
              value={newData.month}
              onChange={(e) => setNewData({ ...newData, month: e.target.value })}
              className="flex-1"
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Valor"
              value={newData.value}
              onChange={(e) => setNewData({ ...newData, value: parseFloat(e.target.value) || 0 })}
              className="w-32"
            />
            <Button size="sm" onClick={handleAdd}>
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setAdding(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        <div className="space-y-0">
          {cashFlow?.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between py-4",
                index !== (cashFlow?.length || 0) - 1 && "border-b border-border"
              )}
            >
              {editingId === item.id ? (
                <>
                  <Input
                    value={editData.month}
                    onChange={(e) => setEditData({ ...editData, month: e.target.value })}
                    className="w-32"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={editData.value}
                      onChange={(e) => setEditData({ ...editData, value: parseFloat(e.target.value) || 0 })}
                      className="w-32"
                    />
                    <Button size="sm" onClick={() => handleSave(item.id)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-foreground">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{formatCurrency(item.value)}</span>
                    {isAdmin && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
