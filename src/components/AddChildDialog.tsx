import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AddChildDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChildAdded: () => void;
}

export function AddChildDialog({ open, onOpenChange, onChildAdded }: AddChildDialogProps) {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [ageGroup, setAgeGroup] = useState<"6-9" | "10-13" | "14-17">("10-13");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getAgeGroupFromAge = (age: number): "6-9" | "10-13" | "14-17" => {
        if (age >= 6 && age <= 9) return "6-9";
        if (age >= 10 && age <= 13) return "10-13";
        return "14-17";
    };

    const handleAgeChange = (value: string) => {
        setAge(value);
        const ageNum = parseInt(value);
        if (ageNum >= 6 && ageNum <= 17) {
            setAgeGroup(getAgeGroupFromAge(ageNum));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Please enter a name");
            return;
        }

        const ageNum = parseInt(age);
        if (!age || ageNum < 1 || ageNum > 18) {
            setError("Age must be between 1 and 18");
            return;
        }

        setIsLoading(true);
        try {
            const { addChild } = await import("@/lib/childApi");
            const avatar = name.trim()[0].toUpperCase();

            await addChild({
                name: name.trim(),
                age: ageNum,
                avatar,
                age_group: ageGroup
            });

            setName("");
            setAge("");
            setAgeGroup("10-13");
            onChildAdded();
            onOpenChange(false);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to add child";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Child Profile</DialogTitle>
                    <DialogDescription>
                        Create a new child profile to monitor their online safety
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="child-name">Child's Name</Label>
                        <Input
                            id="child-name"
                            placeholder="Emma"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="child-age">Age</Label>
                        <Input
                            id="child-age"
                            type="number"
                            min="1"
                            max="18"
                            placeholder="12"
                            value={age}
                            onChange={(e) => handleAgeChange(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age-group">Age Group</Label>
                        <Select value={ageGroup} onValueChange={(value: "6-9" | "10-13" | "14-17") => setAgeGroup(value)} disabled={isLoading}>
                            <SelectTrigger id="age-group">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6-9">6-9 years</SelectItem>
                                <SelectItem value="10-13">10-13 years</SelectItem>
                                <SelectItem value="14-17">14-17 years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Child"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
