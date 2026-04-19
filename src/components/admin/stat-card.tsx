import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, color = "bg-blue-50 text-blue-600", trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border p-4 hover:shadow-sm transition-shadow">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="text-xs text-muted-foreground">{label}</p>
        {trend && (
          <span className="text-xs font-medium text-emerald-600">{trend}</span>
        )}
      </div>
    </div>
  );
}
