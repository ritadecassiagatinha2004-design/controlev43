import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cashFlowData, formatCurrency } from "@/data/financialData";
import { cn } from "@/lib/utils";

export function CashFlowTable() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Caixa da Casa</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-0">
          {cashFlowData.map((item, index) => (
            <div
              key={item.month}
              className={cn(
                "flex items-center justify-between py-4",
                index !== cashFlowData.length - 1 && "border-b border-border"
              )}
            >
              <span className="text-sm font-medium text-foreground">{item.month}</span>
              <span className="text-sm font-semibold text-primary">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
