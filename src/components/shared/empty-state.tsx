import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <Icon className="h-16 w-16 text-muted-foreground/20 mb-4" />
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>}
      {children}
    </div>
  );
}
