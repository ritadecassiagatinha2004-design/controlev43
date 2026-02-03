import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses, formatCurrency, useAddExpense, useUpdateExpense, useDeleteExpense, months } from "@/hooks/useFinancialData";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2, Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Gastos = () => {
  const { data: expenses, isLoading } = useExpenses(2026);
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();
  const { isAdmin } = useAuthContext();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ description: "", value: 0 });
  const [adding, setAdding] = useState(false);
  const [addingMonth, setAddingMonth] = useState<string | null>(null);
  const [newData, setNewData] = useState({ description: "", value: 0, month: "Janeiro" });

  // Group expenses by month
  const expensesByMonth = expenses?.reduce((acc, expense) => {
    if (!acc[expense.month]) {
      acc[expense.month] = [];
    }
    acc[expense.month].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

  const handleEdit = (item: { id: string; description: string; value: number }) => {
    setEditingId(item.id);
    setEditData({ description: item.description, value: item.value });
  };

  const handleSave = async (id: string) => {
    try {
      await updateExpense.mutateAsync({ id, ...editData });
      setEditingId(null);
      toast({ title: "Salvo!", description: "Gasto atualizado com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    try {
      await addExpense.mutateAsync({
        description: newData.description,
        value: newData.value,
        month: addingMonth || newData.month,
        year: 2026,
      });
      setAdding(false);
      setAddingMonth(null);
      setNewData({ description: "", value: 0, month: "Janeiro" });
      toast({ title: "Adicionado!", description: "Novo gasto adicionado com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense.mutateAsync(id);
      toast({ title: "Removido!", description: "Gasto removido com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const monthsWithExpenses = Object.keys(expensesByMonth || {});

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Header />
        <NavigationTabs />
        
        <main className="py-8">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">
                Controle de Gastos
              </h2>
              <p className="text-muted-foreground">Despesas mensais da casa</p>
            </div>
            {isAdmin && (
              <Button onClick={() => { setAdding(true); setAddingMonth(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Gasto
              </Button>
            )}
          </div>

          {/* Add new expense form */}
          {adding && !addingMonth && (
            <Card className="mb-6 border-primary">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Gasto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Mês</label>
                    <Select value={newData.month} onValueChange={(v) => setNewData({ ...newData, month: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Descrição</label>
                    <Input
                      value={newData.description}
                      onChange={(e) => setNewData({ ...newData, description: e.target.value })}
                      placeholder="Descrição do gasto"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Valor (R$)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newData.value}
                      onChange={(e) => setNewData({ ...newData, value: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleAdd}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expenses by Month */}
          {monthsWithExpenses.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhum gasto registrado ainda
              </CardContent>
            </Card>
          ) : (
            monthsWithExpenses.map((month) => {
              const monthExpenses = expensesByMonth?.[month] || [];
              const total = monthExpenses.reduce((sum, e) => sum + e.value, 0);
              
              return (
                <Card key={month} className="border shadow-sm mb-6">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {month}
                      </CardTitle>
                      <span className="px-4 py-2 bg-warning/20 text-foreground rounded-full text-sm font-semibold">
                        Total: {formatCurrency(total)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-sm font-medium text-muted-foreground">
                            Descrição
                          </th>
                          <th className="text-right py-3 text-sm font-medium text-muted-foreground">
                            Valor
                          </th>
                          {isAdmin && (
                            <th className="text-right py-3 text-sm font-medium text-muted-foreground w-24">
                              Ações
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {monthExpenses.map((item, index) => (
                          <tr
                            key={item.id}
                            className={cn(
                              index !== monthExpenses.length - 1 && "border-b border-border"
                            )}
                          >
                            {editingId === item.id ? (
                              <>
                                <td className="py-4">
                                  <Input
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                  />
                                </td>
                                <td className="py-4 text-right">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editData.value}
                                    onChange={(e) => setEditData({ ...editData, value: parseFloat(e.target.value) || 0 })}
                                    className="w-32 ml-auto"
                                  />
                                </td>
                                <td className="py-4 text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button size="sm" onClick={() => handleSave(item.id)}>
                                      <Save className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-4 text-sm text-foreground">
                                  {item.description}
                                </td>
                                <td className="py-4 text-sm font-medium text-destructive text-right">
                                  {formatCurrency(item.value)}
                                </td>
                                {isAdmin && (
                                  <td className="py-4 text-right">
                                    <div className="flex justify-end gap-1">
                                      <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </td>
                                )}
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
};

export default Gastos;
