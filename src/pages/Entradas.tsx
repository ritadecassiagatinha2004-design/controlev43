import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncome, formatCurrency, useAddIncome, useUpdateIncome, useDeleteIncome, months, usePayments } from "@/hooks/useFinancialData";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2, Save, X, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

const Entradas = () => {
  const { data: income, isLoading } = useIncome(2026);
  const { data: payments } = usePayments(2026);
  const MENSALIDADE_VALUE = 50;

  const paidByMonth = useMemo(() => {
    const map: Record<string, number> = {};
    (payments || []).forEach((p) => {
      if (p.status === "Pago") map[p.month] = (map[p.month] || 0) + 1;
    });
    return map;
  }, [payments]);
  const addIncome = useAddIncome();
  const updateIncome = useUpdateIncome();
  const deleteIncome = useDeleteIncome();
  const { isAdmin } = useAuthContext();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ description: "", value: 0 });
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState({ description: "", value: 0, month: "Janeiro" });

  // Group income by month
  const incomeByMonth = income?.reduce((acc, inc) => {
    if (!acc[inc.month]) {
      acc[inc.month] = [];
    }
    acc[inc.month].push(inc);
    return acc;
  }, {} as Record<string, typeof income>);

  const handleEdit = (item: { id: string; description: string; value: number }) => {
    setEditingId(item.id);
    setEditData({ description: item.description, value: item.value });
  };

  const handleSave = async (id: string) => {
    try {
      await updateIncome.mutateAsync({ id, ...editData });
      setEditingId(null);
      toast({ title: "Salvo!", description: "Entrada atualizada com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível salvar", variant: "destructive" });
    }
  };

  const handleAdd = async () => {
    try {
      await addIncome.mutateAsync({
        description: newData.description,
        value: newData.value,
        month: newData.month,
        year: 2026,
      });
      setAdding(false);
      setNewData({ description: "", value: 0, month: "Janeiro" });
      toast({ title: "Adicionado!", description: "Nova entrada adicionada com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível adicionar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncome.mutateAsync(id);
      toast({ title: "Removido!", description: "Entrada removida com sucesso" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };

  const MONTH_INDEX: Record<string, number> = {
    Janeiro: 0, Fevereiro: 1, "Março": 2, Marco: 2, Abril: 3, Maio: 4, Junho: 5,
    Julho: 6, Agosto: 7, Setembro: 8, Outubro: 9, Novembro: 10, Dezembro: 11,
  };

  const monthsWithIncome = useMemo(() => {
    const set = new Set<string>([
      ...Object.keys(incomeByMonth || {}),
      ...Object.keys(paidByMonth),
    ]);
    return Array.from(set).sort((a, b) => (MONTH_INDEX[a] ?? 99) - (MONTH_INDEX[b] ?? 99));
  }, [incomeByMonth, paidByMonth]);

  const currentMonthIdx = new Date().getMonth();
  const isOpenByDefault = (month: string) => {
    const idx = MONTH_INDEX[month] ?? 99;
    return idx === currentMonthIdx || idx === currentMonthIdx - 1;
  };

  const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});
  const isCollapsed = (month: string) => {
    if (collapsedMonths[month] !== undefined) return collapsedMonths[month];
    return !isOpenByDefault(month);
  };
  const toggleMonth = (month: string) =>
    setCollapsedMonths((prev) => ({ ...prev, [month]: !isCollapsed(month) }));

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">
                Controle de Entradas
              </h2>
              <p className="text-sm text-muted-foreground">Receitas mensais da casa</p>
            </div>
            {isAdmin && (
              <Button onClick={() => setAdding(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nova Entrada
              </Button>
            )}
          </div>

          {/* Add new income form */}
          {adding && (
            <Card className="mb-6 border-primary">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Adicionar Nova Entrada</h3>
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
                      placeholder="Descrição da entrada"
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

          {/* Income by Month */}
          {monthsWithIncome.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhuma entrada registrada ainda
              </CardContent>
            </Card>
          ) : (
            monthsWithIncome.map((month) => {
              const monthIncome = incomeByMonth?.[month] || [];
              const paidCount = paidByMonth[month] || 0;
              const mensalidadesTotal = paidCount * MENSALIDADE_VALUE;
              const total = monthIncome.reduce((sum, i) => sum + i.value, 0) + mensalidadesTotal;
              
              const collapsed = isCollapsed(month);
              return (
                <Card key={month} className="border shadow-sm mb-4 sm:mb-6">
                  <CardHeader className="p-4 sm:p-6 sm:pb-4">
                    <button
                      type="button"
                      onClick={() => toggleMonth(month)}
                      className="w-full flex items-center justify-between gap-2 text-left hover:opacity-80 transition-opacity"
                      aria-expanded={!collapsed}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {collapsed ? (
                          <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                        <CardTitle className="text-base sm:text-lg font-semibold text-foreground truncate">
                          {month}
                        </CardTitle>
                      </div>
                      <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-black rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0">
                        {formatCurrency(total)}
                      </span>
                    </button>
                  </CardHeader>
                  {!collapsed && (
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                            Descrição
                          </th>
                          <th className="text-right py-3 text-xs sm:text-sm font-medium text-muted-foreground">
                            Valor
                          </th>
                          {isAdmin && (
                            <th className="text-right py-3 text-xs sm:text-sm font-medium text-muted-foreground w-16 sm:w-24">
                              <span className="sr-only sm:not-sr-only">Ações</span>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {monthIncome.map((item, index) => (
                          <tr
                            key={item.id}
                            className={cn(
                              index !== monthIncome.length - 1 && "border-b border-border"
                            )}
                          >
                            {editingId === item.id ? (
                              <>
                                <td className="py-3 pr-2">
                                  <Input
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                  />
                                </td>
                                <td className="py-3 text-right">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editData.value}
                                    onChange={(e) => setEditData({ ...editData, value: parseFloat(e.target.value) || 0 })}
                                    className="w-24 sm:w-32 ml-auto"
                                  />
                                </td>
                                <td className="py-3 text-right">
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
                                <td className="py-3 pr-2 text-sm text-foreground break-words">
                                  {item.description}
                                </td>
                                <td className="py-3 text-sm font-medium text-green-600 text-right whitespace-nowrap">
                                  {formatCurrency(item.value)}
                                </td>
                                {isAdmin && (
                                  <td className="py-3 text-right">
                                    <div className="flex justify-end gap-0.5 sm:gap-1">
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                                        <Pencil className="w-4 h-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(item.id)}>
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
                  )}
                </Card>
              );
            })
          )}
        </>
      )}
    </Layout>
  );
};

export default Entradas;
