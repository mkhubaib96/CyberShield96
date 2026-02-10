import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "primary" | "danger" | "warning" | "success";
}

const variantStyles = {
  default: "bg-card",
  primary: "gradient-primary text-primary-foreground",
  danger: "bg-destructive/5 border-destructive/20",
  warning: "bg-warning/5 border-warning/20",
  success: "bg-success/5 border-success/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 shadow-card transition-all duration-200 hover:shadow-card-hover animate-fade-up",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium", variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground")}>
            {title}
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn("mt-0.5 text-xs", variant === "primary" ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trend.positive ? "text-success" : "text-destructive")}>
              {trend.positive ? "↓" : "↑"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
