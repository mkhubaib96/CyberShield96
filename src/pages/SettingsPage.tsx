import { Bell, Shield, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

function ToggleSetting({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          on ? "bg-secondary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform",
            on && "translate-x-5"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure monitoring and notification preferences</p>
      </div>

      <section className="rounded-xl border bg-card p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-secondary" />
          <h2 className="font-display font-semibold text-foreground">Notifications</h2>
        </div>
        <ToggleSetting label="Push Notifications" description="Receive instant alerts for critical threats" defaultOn />
        <ToggleSetting label="Email Digest" description="Daily summary of activity and alerts" defaultOn />
        <ToggleSetting label="SMS Alerts" description="Text messages for critical-level threats only" />
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-secondary" />
          <h2 className="font-display font-semibold text-foreground">Privacy</h2>
        </div>
        <ToggleSetting label="On-Device Processing" description="Analyze content locally to minimize data transmission" defaultOn />
        <ToggleSetting label="Anonymous Reporting" description="Strip personal identifiers from threat reports" defaultOn />
        <ToggleSetting label="Auto Data Purge" description="Automatically delete threat metadata after 30 days" defaultOn />
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-secondary" />
          <h2 className="font-display font-semibold text-foreground">Detection Sensitivity</h2>
        </div>
        <ToggleSetting label="Strict Mode" description="Higher sensitivity with potentially more false positives" />
        <ToggleSetting label="Profanity Filter" description="Block mild language in addition to severe content" defaultOn />
        <ToggleSetting label="Image Analysis" description="Scan images and videos for inappropriate content" defaultOn />
      </section>

      <section className="rounded-xl border bg-card p-6 shadow-card space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-secondary" />
          <h2 className="font-display font-semibold text-foreground">Screen Time</h2>
        </div>
        <ToggleSetting label="Screen Time Limits" description="Enforce daily usage limits per child" defaultOn />
        <ToggleSetting label="Bedtime Mode" description="Restrict device usage during sleep hours" defaultOn />
        <ToggleSetting label="App-Specific Limits" description="Set individual time limits per app" />
      </section>
    </div>
  );
}
