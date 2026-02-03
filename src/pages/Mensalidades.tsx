import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { members, months } from "@/data/financialData";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Mensalidades = () => {
  const [selectedYear] = useState("2026");

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
              <p className="text-muted-foreground">Acompanhamento dos pagamentos dos filhos de casa</p>
            </div>
            <Select defaultValue={selectedYear}>
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
                    {members.map((member, index) => (
                      <tr key={member.name} className={cn(index !== members.length - 1 && "border-b border-border")}>
                        <td className="py-3 px-4 text-sm font-medium text-foreground sticky left-0 bg-card">
                          {member.name}
                        </td>
                        {months.map((month) => {
                          const status = member.payments[month];
                          const isPago = status === "Pago";
                          return (
                            <td key={month} className="py-3 px-2 text-center">
                              <span
                                className={cn(
                                  "inline-block px-3 py-1 rounded-md text-xs font-medium",
                                  isPago
                                    ? "bg-green-500 text-white"
                                    : "bg-muted text-muted-foreground"
                                )}
                              >
                                {status}
                              </span>
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
