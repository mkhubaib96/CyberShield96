import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import type { Alert, ThreatLevel } from "@/lib/mock-data";

const severityConfig: Record<ThreatLevel, { icon: typeof AlertTriangle; className: string; label: string }> = {
  low: { icon: ShieldCheck, className: "bg-info/10 text-info", label: "Low" },
  medium: { icon: AlertTriangle, className: "bg-warning/10 text-warning", label: "Medium" },
  high: { icon: ShieldAlert, className: "bg-destructive/10 text-destructive", label: "High" },
  critical: { icon: ShieldX, className: "gradient-danger text-destructive-foreground", label: "Critical" },
};

export function AlertCard({ alert }: { alert: Alert }) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group flex items-start gap-4 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-card-hover",
        !alert.isRead && "border-l-4 border-l-destructive bg-destructive/[0.02]"
      )}
    >
      <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg", config.className)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-foreground">{alert.threatType}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", config.className)}>
            {config.label}
          </span>
          {!alert.isRead && (
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse-soft" />
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{alert.summary}</p>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
              {alert.childAvatar}
            </span>
            {alert.childName}
          </span>
          <span>•</span>
          <span>{alert.platform}</span>
          <span>•</span>
          <span>{alert.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
