import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMembers, usePayments, useUpdatePayment, useAddMember, useDeleteMember, months } from "@/hooks/useFinancialData";
import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const Mensalidades = () => {
  const [selectedYear] = useState(2026);
  const [editOpen, setEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: payments, isLoading: paymentsLoading } = usePayments(selectedYear);
  const updatePayment = useUpdatePayment();
  const addMember = useAddMember();
  const deleteMember = useDeleteMember();
  const { isAdmin } = useAuthContext();
  const { toast } = useToast();

  const getPaymentStatus = (memberId: string, month: string) => {
    const payment = payments?.find((p) => p.member_id === memberId && p.month === month);
    return payment;
  };

  const handleCycleStatus = async (memberId: string, month: string) => {
    if (!isAdmin) return;

    const payment = getPaymentStatus(memberId, month);
    if (!payment) return;

    const nextStatus: "Pago" | "Pendente" | "Deve" =
      payment.status === "Pendente" ? "Pago" : payment.status === "Pago" ? "Deve" : "Pendente";

    try {
      await updatePayment.mutateAsync({ id: payment.id, status: nextStatus });
      toast({
        title: "Atualizado!",
        description: `Status alterado para ${nextStatus}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await addMember.mutateAsync(name);
      setNewName("");
      toast({ title: "Adicionado!", description: `${name} foi adicionado(a).` });
    } catch {
      toast({ title: "Erro", description: "Não foi possível adicionar", variant: "destructive" });
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    try {
      await deleteMember.mutateAsync(id);
      toast({ title: "Removido!", description: `${name} foi removido(a).` });
    } catch {
      toast({ title: "Erro", description: "Não foi possível remover", variant: "destructive" });
    }
  };

  const isLoading = membersLoading || paymentsLoading;

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
                Controle de Mensalidades
              </h2>
              <p className="text-sm text-muted-foreground">
                Acompanhamento dos pagamentos dos filhos de casa
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Pencil className="h-4 w-4" /> Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Filhos da Casa</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="Nome do novo filho(a)"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                      />
                      <Button onClick={handleAddMember} disabled={addMember.isPending} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                      {members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                          <span className="text-sm font-medium">{member.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            disabled={deleteMember.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <Select defaultValue={String(selectedYear)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payments Table */}
          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-3 sm:py-4 sm:px-4 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/30 sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                        Filhos(a)
                      </th>
                      {months.map((month) => (
                        <th key={month} className="text-center py-3 px-2 sm:py-4 text-xs sm:text-sm font-medium text-muted-foreground bg-muted/30 min-w-[80px] sm:min-w-[90px]">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members?.map((member, index) => (
                      <tr key={member.id} className={cn(index !== (members?.length || 0) - 1 && "border-b border-border")}>
                        <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-foreground sticky left-0 z-10 bg-card shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]">
                          {member.name}
                        </td>
                        {months.map((month) => {
                          const payment = getPaymentStatus(member.id, month);
                          const status = payment?.status ?? "Pendente";
                          return (
                            <td key={month} className="py-3 px-2 text-center">
                              <button
                                onClick={() => handleCycleStatus(member.id, month)}
                                disabled={!isAdmin || updatePayment.isPending}
                                className={cn(
                                  "inline-block px-3 py-1 rounded-md text-xs font-medium transition-all select-none",
                                  status === "Pago" && "bg-green-500 text-white",
                                  status === "Deve" && "bg-red-500 text-white",
                                  status === "Pendente" && "bg-muted text-muted-foreground",
                                  isAdmin && "cursor-pointer hover:opacity-80"
                                )}
                              >
                                {status}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Layout>
  );
};

export default Mensalidades;
