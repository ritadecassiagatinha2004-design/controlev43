import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpenses, formatCurrency, useAddExpense, useUpdateExpense, useDeleteExpense, months } from "@/hooks/useFinancialData";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Plus, Trash2, Save, X, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
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
  const [bulkMonth, setBulkMonth] = useState<string>("Janeiro");
  const [bulkText, setBulkText] = useState<string>("");

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

  // Parse one line: "Letícia 44,90" / "Andressa   102 60" / "João 200.00"
  // Strategy: take last token as the value (allowing spaces between cents),
  // and treat everything before as description.
  const parseLine = (raw: string): { description: string; value: number } | null => {
    const line = raw.trim();
    if (!line) return null;

    // Match: <description> <value at end>
    // Value: digits + optional decimal separator (',', '.', or space) + cents
    const m = line.match(/^(.+?)\s+([\d.]+(?:[ ,.]\d{1,2})?)\s*$/);
    if (!m) return null;

    const description = m[1].trim().replace(/[:\-–—]\s*$/, "");
    let valueStr = m[2].trim();

    // Normalize: "102 60" -> "102,60"; "1.234,56" -> "1234.56"; "44,90" -> "44.90"
    if (/\s/.test(valueStr)) {
      valueStr = valueStr.replace(/\s+/, ",");
    }
    // If has both . and , -> . is thousands sep
    if (valueStr.includes(",") && valueStr.includes(".")) {
      valueStr = valueStr.replace(/\./g, "").replace(",", ".");
    } else {
      valueStr = valueStr.replace(",", ".");
    }

    const value = parseFloat(valueStr);
    if (isNaN(value) || value <= 0 || !description) return null;
    return { description, value };
  };

  const parsedExpenses = bulkText
    .split(/\r?\n/)
    .map((l) => parseLine(l))
    .filter((x): x is { description: string; value: number } => x !== null);

  const skippedLines = bulkText
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0 && !parseLine(l));

  const resetBulk = () => {
    setAdding(false);
    setAddingMonth(null);
    setBulkText("");
  };

  const handleAddBulk = async () => {
    const month = addingMonth || bulkMonth;
    if (parsedExpenses.length === 0) {
      toast({ title: "Nada para salvar", description: "Cole pelo menos uma linha válida (ex: 'Letícia 44,90')", variant: "destructive" });
      return;
    }

    try {
      await Promise.all(
        parsedExpenses.map((r) =>
          addExpense.mutateAsync({
            description: r.description,
            value: r.value,
            month,
            year: 2026,
            status: "Pendente",
          })
        )
      );
      toast({ title: "Adicionados!", description: `${parsedExpenses.length} gasto(s) salvo(s) em ${month}` });
      resetBulk();
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


  const handleCycleStatus = async (item: { id: string; status: "Pendente" | "Pago" | "Deve" }) => {
    const next = item.status === "Pendente" ? "Pago" : item.status === "Pago" ? "Deve" : "Pendente";
    try {
      await updateExpense.mutateAsync({ id: item.id, status: next });
    } catch {
      toast({ title: "Erro", description: "Não foi possível atualizar status", variant: "destructive" });
    }
  };

  const MONTH_INDEX: Record<string, number> = {
    Janeiro: 0, Fevereiro: 1, "Março": 2, Marco: 2, Abril: 3, Maio: 4, Junho: 5,
    Julho: 6, Agosto: 7, Setembro: 8, Outubro: 9, Novembro: 10, Dezembro: 11,
  };

  const monthsWithExpenses = useMemo(() => {
    const list = Object.keys(expensesByMonth || {});
    return list.sort((a, b) => (MONTH_INDEX[a] ?? 99) - (MONTH_INDEX[b] ?? 99));
  }, [expensesByMonth]);

  const currentMonthIdx = new Date().getMonth();
  const isOpenByDefault = (month: string) => {
    const idx = MONTH_INDEX[month] ?? 99;
    // Mês atual e mês anterior ficam abertos
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

          {/* Add new expenses dialog (bulk) */}
          <Dialog open={adding} onOpenChange={(open) => { if (!open) resetBulk(); }}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Gastos</DialogTitle>
              </DialogHeader>

              <div className="mb-2 max-w-xs">
                <label className="text-sm text-muted-foreground">Mês</label>
                <Select value={bulkMonth} onValueChange={setBulkMonth} disabled={!!addingMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {addingMonth && (
                  <p className="text-xs text-muted-foreground mt-1">Adicionando em <strong>{addingMonth}</strong></p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Cole sua lista (uma linha por gasto: <span className="font-mono text-xs">nome valor</span>)
                </label>
                <Textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={"Letícia 44,90\nAndressa 102,60\nJoão 200,00\nElaine 30,00"}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Aceita formatos: <span className="font-mono">44,90</span>, <span className="font-mono">102 60</span>, <span className="font-mono">200.00</span>
                </p>
              </div>

              {(parsedExpenses.length > 0 || skippedLines.length > 0) && (
                <div className="rounded-md border bg-muted/30 p-3 space-y-2">
                  <p className="text-sm font-medium">
                    Pré-visualização: {parsedExpenses.length} gasto(s) reconhecido(s)
                    {skippedLines.length > 0 && ` · ${skippedLines.length} linha(s) inválida(s)`}
                  </p>
                  {parsedExpenses.length > 0 && (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {parsedExpenses.map((p, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-foreground">{p.description}</span>
                          <span className="font-medium text-destructive">{formatCurrency(p.value)}</span>
                        </div>
                      ))}
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
                <Button variant="outline" onClick={resetBulk}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleAddBulk} disabled={addExpense.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar todos
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
              
              const collapsed = isCollapsed(month);
              return (
                <Card key={month} className="border shadow-sm mb-6">
                  <CardHeader className="pb-4">
                    <button
                      type="button"
                      onClick={() => toggleMonth(month)}
                      className="w-full flex items-center justify-between gap-3 text-left hover:opacity-80 transition-opacity"
                      aria-expanded={!collapsed}
                    >
                      <div className="flex items-center gap-2">
                        {collapsed ? (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                        <CardTitle className="text-xl font-semibold text-foreground">
                          {month}
                        </CardTitle>
                      </div>
                      <span className="px-4 py-2 bg-red-200 text-black rounded-full text-base font-semibold">
                        Total: {formatCurrency(total)}
                      </span>
                    </button>
                  </CardHeader>
                  {!collapsed && (
                  <CardContent className="pt-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-base font-medium text-muted-foreground">
                            Descrição
                          </th>
                          <th className="text-right py-3 text-base font-medium text-muted-foreground">
                            Valor
                          </th>
                          {isAdmin && (
                            <th className="text-right py-3 text-base font-medium text-muted-foreground w-24">
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
                                <td className="py-4 text-base text-foreground">
                                  {item.description}
                                </td>
                                <td className="py-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => isAdmin && handleCycleStatus(item)}
                                    disabled={!isAdmin}
                                    className={cn(
                                      "px-4 py-2 rounded-md text-base font-semibold transition-colors min-w-[130px] inline-flex items-center justify-center gap-2",
                                      item.status === "Pago" && "bg-green-500 text-white hover:bg-green-600",
                                      item.status === "Deve" && "bg-red-500 text-white hover:bg-red-600",
                                      item.status === "Pendente" && "bg-muted text-muted-foreground hover:bg-muted/80",
                                      !isAdmin && "cursor-default opacity-90"
                                    )}
                                    title={isAdmin ? "Clique para alternar status" : undefined}
                                  >
                                    <span>{formatCurrency(item.value)}</span>
                                  </button>
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

export default Gastos;
