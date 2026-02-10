import { useState } from "react";
import { AlertCard } from "@/components/AlertCard";
import { alerts as allAlerts, type ThreatLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const filters: { label: string; value: ThreatLevel | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export default function Alerts() {
  const [activeFilter, setActiveFilter] = useState<ThreatLevel | "all">("all");

  const filtered = activeFilter === "all" ? allAlerts : allAlerts.filter((a) => a.severity === activeFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Alerts</h1>
        <p className="mt-1 text-muted-foreground">All detected threats and safety events</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              activeFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="text-muted-foreground">No alerts matching this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}
