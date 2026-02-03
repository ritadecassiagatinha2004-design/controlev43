import { Header } from "@/components/Header";
import { NavigationTabs } from "@/components/NavigationTabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { expensesData, formatCurrency } from "@/data/financialData";
import { cn } from "@/lib/utils";

const Gastos = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Header />
        <NavigationTabs />
        
        <main className="py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-1">
              Controle de Gastos
            </h2>
            <p className="text-muted-foreground">Despesas mensais da casa</p>
          </div>

          {/* Expenses by Month */}
          {expensesData.map((monthData) => (
            <Card key={monthData.month} className="border shadow-sm mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {monthData.month}
                  </CardTitle>
                  <span className="px-4 py-2 bg-warning/20 text-warning-foreground rounded-full text-sm font-semibold">
                    Total: {formatCurrency(monthData.total)}
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
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.items.map((item, index) => (
                      <tr
                        key={`${item.description}-${index}`}
                        className={cn(
                          index !== monthData.items.length - 1 && "border-b border-border"
                        )}
                      >
                        <td className="py-4 text-sm text-foreground">
                          {item.description}
                        </td>
                        <td className="py-4 text-sm font-medium text-destructive text-right">
                          {formatCurrency(item.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Gastos;
