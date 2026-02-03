import { Calendar } from "lucide-react";

export function DateBadge() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm w-fit">
      <Calendar className="w-4 h-4 text-primary" />
      <span className="text-sm text-muted-foreground">{formattedDate}</span>
    </div>
  );
}
