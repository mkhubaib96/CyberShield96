import { useState } from "react";
import { cn } from "@/lib/utils";
import { SafetyScoreRing } from "./SafetyScoreRing";
import { Clock, AlertTriangle, MonitorSmartphone, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteChild, Child } from "@/lib/childApi";
import { useToast } from "@/hooks/use-toast";

interface ChildCardProps {
  child: Child;
  onDelete?: () => void;
}

const statusStyles = {
  safe: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  alert: "bg-destructive/10 text-destructive",
};

const statusLabels = {
  safe: "All Clear",
  warning: "Needs Attention",
  alert: "Action Required",
};

export function ChildCard({ child, onDelete }: ChildCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteChild(child.id);
      setDeleteDialogOpen(false);
      onDelete?.();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete child",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Deterministic "random" data based on child ID
  const seed = child.id * 12345; // Simple seed

  // Safety Score (60-98)
  const safetyScore = 60 + (seed % 39);

  // Screen Time (30m - 6h)
  const hours = (seed % 6);
  const minutes = (seed % 60);
  const screenTime = `${hours}h ${minutes}m`;

  // Recent Alerts (0-5)
  const recentAlerts = seed % 6;

  // Status logic
  let status: "safe" | "warning" | "alert" = "safe";
  let displayPlatforms = ["Instagram", "TikTok", "Roblox"];

  if (safetyScore < 70) {
    status = "alert";
    displayPlatforms = ["Discord", "Snapchat", "Instagram"];
  } else if (safetyScore < 85) {
    status = "warning";
    displayPlatforms = ["YouTube", "Roblox", "Fortnite"];
  } else {
    status = "safe";
    displayPlatforms = ["Minecraft", "Duolingo", "PBS Kids"];
  }

  // Mix up platforms slightly based on ID opacity
  if (child.id % 2 === 0) {
    displayPlatforms = displayPlatforms.reverse();
  }

  return (
    <>
      <div className="group rounded-xl border bg-card p-6 shadow-card transition-all duration-200 hover:shadow-card-hover animate-fade-up relative">
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
          title="Delete child"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary text-lg font-bold text-primary-foreground">
              {child.avatar}
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">{child.name}</h3>
              <p className="text-sm text-muted-foreground">Age {child.age} · {child.age_group}</p>
            </div>
          </div>
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[status])}>
            {statusLabels[status]}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <SafetyScoreRing score={safetyScore} size={90} strokeWidth={8} />
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{screenTime} today</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>{recentAlerts} recent alerts</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MonitorSmartphone className="h-4 w-4" />
              <span>{displayPlatforms.length} platforms</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {displayPlatforms.map((p) => (
            <span key={p} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {p}
            </span>
          ))}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {child.name}'s Profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {child.name}'s profile and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
