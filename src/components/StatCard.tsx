import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconVariant?: "purple" | "green" | "orange" | "blue";
}

const iconVariantClasses = {
  purple: "stat-card-icon stat-card-icon-purple",
  green: "stat-card-icon stat-card-icon-green",
  orange: "stat-card-icon stat-card-icon-orange",
  blue: "stat-card-icon stat-card-icon-blue",
};

export function StatCard({ title, value, subtitle, icon: Icon, iconVariant = "purple" }: StatCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-primary">{subtitle}</p>
          </div>
          <div className={iconVariantClasses[iconVariant]}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
