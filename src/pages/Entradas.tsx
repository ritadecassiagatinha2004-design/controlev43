import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncome, formatCurrency, useAddIncome, useUpdateIncome, useDeleteIncome, months, usePayments, useMembers } from "@/hooks/useFinancialData";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Plus, Trash2, Save, X, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { parseBRNumber } from "@/lib/number";

const Entradas = () => {
  const { data: income, isLoading } = useIncome(2026);
  const { data: payments } = usePayments(2026);
  const { data: members } = useMembers();
  const totalFilhos = members?.length || 0;
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
  const [newData, setNewData] = useState({ description: "", value: 0, month: months[new Date().getMonth()] });

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

  const [bulkText, setBulkText] = useState("");
  const parseLine = (raw: string): { description: string; value: number } | null => {
    const line = raw.trim();
    if (!line) return null;
    const m = line.match(/^(.+?)\s+([\d.]+(?:[ ,.]\d{1,2})?)\s*$/);
    if (!m) return null;
    const description = m[1].trim().replace(/[:\-–—]\s*$/, "");
    const value = parseBRNumber(m[2].trim().replace(/\s+/, ","));
    if (!(value > 0) || !description) return null;
    return { description, value };
  };
  const lines = bulkText.split(/\r?\n/);
  const parsedIncome = lines.map(parseLine).filter((x): x is { description: string; value: number } => x !== null);
  const skippedLines = lines.filter((l) => l.trim().length > 0 && !parseLine(l));
  const resetBulk = () => { setAdding(false); setBulkText(""); };

  const handleAdd = async () => {
    if (parsedIncome.length === 0) {
      toast({ title: "Nada para salvar", description: "Cole pelo menos uma linha válida (ex: 'Rifa 1.000,00')", variant: "destructive" });
      return;
    }
    try {
      await Promise.all(parsedIncome.map((r) => addIncome.mutateAsync({ description: r.description, value: r.value, month: newData.month, year: 2026 })));
      toast({ title: "Adicionadas!", description: `${parsedIncome.length} entrada(s) salva(s) em ${newData.month}` });
      resetBulk();
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
              <Button onClick={() => { setNewData((d) => ({ ...d, month: months[new Date().getMonth()] })); setAdding(true); }} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Nova Entrada
              </Button>
            )}
          </div>

          <Dialog open={adding} onOpenChange={(open) => { if (!open) resetBulk(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Entradas</DialogTitle>
              </DialogHeader>
              <div className="mb-2 max-w-xs">
                <label className="text-sm text-muted-foreground">Mês</label>
                <Select value={newData.month} onValueChange={(v) => setNewData({ ...newData, month: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Cole sua lista (uma linha por entrada: <span className="font-mono text-xs">descrição valor</span>)
                </label>
                <Textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={"Rifa 1.000,00\nFilhos festa 360,00\nDoação assist 605,00\nBaixa da aplicação 500,00"}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Aceita formatos: <span className="font-mono">360,00</span>, <span className="font-mono">605 00</span>, <span className="font-mono">1.000 00</span>
                </p>
              </div>
              {(parsedIncome.length > 0 || skippedLines.length > 0) && (
                <div className="rounded-md border bg-muted/30 p-3 space-y-2">
                  <p className="text-sm font-medium">
                    Pré-visualização: {parsedIncome.length} entrada(s) reconhecida(s)
                    {skippedLines.length > 0 && ` · ${skippedLines.length} linha(s) inválida(s)`}
                  </p>
                  {parsedIncome.length > 0 && (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {parsedIncome.map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-foreground">{p.description}</span>
                          <span className="font-medium text-primary">{formatCurrency(p.value)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-semibold border-t pt-1">
                        <span>Total</span>
                        <span>{formatCurrency(parsedIncome.reduce((s, p) => s + p.value, 0))}</span>
                      </div>
                    </div>
                  )}
                  {skippedLines.length > 0 && (
                    <div className="text-xs text-destructive">
                      Ignoradas: {skippedLines.map((l) => `"${l.trim()}"`).join(", ")}
                    </div>
                  )}
                </div>
              )}
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={resetBulk}><X className="w-4 h-4 mr-2" />Cancelar</Button>
                <Button onClick={handleAdd} disabled={addIncome.isPending}><Save className="w-4 h-4 mr-2" />Salvar todas</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
                        {paidCount > 0 && (
                          <tr className="border-b border-border bg-muted/20">
                            <td className="py-3 pr-2 text-sm text-foreground break-words">
                              Mensalidades ({paidCount} {paidCount === 1 ? "paga" : "pagas"} de {totalFilhos} {totalFilhos === 1 ? "filho" : "filhos"})
                            </td>
                            <td className="py-3 text-sm font-medium text-green-600 text-right whitespace-nowrap">
                              {formatCurrency(mensalidadesTotal)}
                            </td>
                            {isAdmin && <td className="py-3" />}
                          </tr>
                        )}
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
