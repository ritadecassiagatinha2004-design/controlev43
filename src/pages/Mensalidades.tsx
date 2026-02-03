import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMembers, usePayments, useUpdatePayment, months } from "@/hooks/useFinancialData";
import { useAdminStore } from "@/stores/adminStore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Mensalidades = () => {
  const [selectedYear] = useState(2026);
  const { data: members, isLoading: membersLoading } = useMembers();
  const { data: payments, isLoading: paymentsLoading } = usePayments(selectedYear);
  const updatePayment = useUpdatePayment();
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const { toast } = useToast();

  const getPaymentStatus = (memberId: string, month: string) => {
    const payment = payments?.find((p) => p.member_id === memberId && p.month === month);
    return payment;
  };

  const handleToggleStatus = async (memberId: string, month: string) => {
    if (!isAdmin) return;
    
    const payment = getPaymentStatus(memberId, month);
    if (!payment) return;
    
    const newStatus = payment.status === "Pago" ? "Pendente" : "Pago";
    
    try {
      await updatePayment.mutateAsync({ id: payment.id, status: newStatus });
      toast({
        title: "Atualizado!",
        description: `Status alterado para ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      });
    }
  };

  if (membersLoading || paymentsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

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
                Controle de Mensalidades
              </h2>
              <p className="text-muted-foreground">
                Acompanhamento dos pagamentos dos filhos de casa
                {isAdmin && <span className="text-primary ml-2">(Clique para alterar status)</span>}
              </p>
            </div>
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

          {/* Payments Table */}
          <Card className="border shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground bg-muted/30 sticky left-0">
                        Filhos(a)
                      </th>
                      {months.map((month) => (
                        <th key={month} className="text-center py-4 px-2 text-sm font-medium text-muted-foreground bg-muted/30 min-w-[90px]">
                          {month}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members?.map((member, index) => (
                      <tr key={member.id} className={cn(index !== (members?.length || 0) - 1 && "border-b border-border")}>
                        <td className="py-3 px-4 text-sm font-medium text-foreground sticky left-0 bg-card">
                          {member.name}
                        </td>
                        {months.map((month) => {
                          const payment = getPaymentStatus(member.id, month);
                          const isPago = payment?.status === "Pago";
                          return (
                            <td key={month} className="py-3 px-2 text-center">
                              <button
                                onClick={() => handleToggleStatus(member.id, month)}
                                disabled={!isAdmin || updatePayment.isPending}
                                className={cn(
                                  "inline-block px-3 py-1 rounded-md text-xs font-medium transition-all",
                                  isPago
                                    ? "bg-green-500 text-white"
                                    : "bg-muted text-muted-foreground",
                                  isAdmin && "cursor-pointer hover:opacity-80"
                                )}
                              >
                                {payment?.status || "Pendente"}
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
        </main>
      </div>
    </div>
  );
};

export default Mensalidades;
