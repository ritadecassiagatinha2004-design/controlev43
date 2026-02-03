import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CashFlowItem {
  month: string;
  value: string;
}

const cashFlowData: CashFlowItem[] = [
  { month: "Janeiro", value: "R$ 59,00" },
  { month: "Fevereiro", value: "R$ 864,44" },
  { month: "Março", value: "R$ 471,73" },
  { month: "Abril", value: "R$ 752,77" },
  { month: "Maio", value: "R$ 134,74" },
  { month: "Agosto", value: "R$ 254,00" },
  { month: "Setembro", value: "R$ 1.616,62" },
  { month: "Outubro", value: "R$ 2.818,17" },
];

export function CashFlowTable() {
  return (
    <Card className="border-0 shadow-sm max-w-2xl">
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
              <span className="text-sm font-semibold text-muted-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
