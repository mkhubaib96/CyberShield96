import { useState, useEffect } from "react";
import { ChildCard } from "@/components/ChildCard";
import { AddChildDialog } from "@/components/AddChildDialog";
import { Plus, Loader2 } from "lucide-react";
import { Child, getChildren } from "@/lib/childApi";
import { useToast } from "@/hooks/use-toast";

export default function Children() {
  const [children, setChildren] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const loadChildren = async () => {
    try {
      setIsLoading(true);
      const response = await getChildren();
      setChildren(response.children || []);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load children",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChildren();
  }, []);

  const handleChildAdded = () => {
    loadChildren();
    toast({
      title: "Success",
      description: "Child added successfully",
    });
  };

  const handleChildDeleted = () => {
    loadChildren();
    toast({
      title: "Success",
      description: "Child removed successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Children</h1>
          <p className="mt-1 text-muted-foreground">Manage profiles and safety settings</p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-card transition-all hover:shadow-elevated"
        >
          <Plus className="h-4 w-4" />
          Add Child
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : children.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No children added yet. Click "Add Child" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} onDelete={handleChildDeleted} />
          ))}
        </div>
      )}

      <AddChildDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onChildAdded={handleChildAdded}
      />
    </div>
  );
}
