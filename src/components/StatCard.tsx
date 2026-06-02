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
    <Card className="border shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-primary break-words">{value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn(iconVariantClasses[iconVariant], "shrink-0 w-10 h-10 sm:w-12 sm:h-12")}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
