import { platforms } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { RefreshCw, Wifi, WifiOff, Pause } from "lucide-react";

const statusConfig = {
  active: { icon: Wifi, label: "Active", className: "text-success bg-success/10" },
  paused: { icon: Pause, label: "Paused", className: "text-warning bg-warning/10" },
  disconnected: { icon: WifiOff, label: "Disconnected", className: "text-destructive bg-destructive/10" },
};

export default function Platforms() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Platforms</h1>
        <p className="mt-1 text-muted-foreground">Monitor connected platforms and sync status</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {platforms.map((p) => {
          const config = statusConfig[p.status];
          const Icon = config.icon;
          return (
            <div
              key={p.name}
              className="rounded-xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover animate-fade-up"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{p.icon}</span>
                <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", config.className)}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
              </div>
              <h3 className="mt-3 font-display font-semibold text-foreground">{p.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="h-3 w-3" />
                  Synced {p.lastSync}
                </div>
                <p>{p.threatsBlocked} threats blocked</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
