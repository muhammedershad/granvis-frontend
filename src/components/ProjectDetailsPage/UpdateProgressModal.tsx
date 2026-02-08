"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";
import { Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Milestone, MilestoneStatus } from "@/types/milestone";
import { useUpdateMilestoneProgressMutation } from "@/lib/api/milestonesApi";

interface UpdateProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: Milestone | null;
}

export function UpdateProgressModal({
  open,
  onOpenChange,
  milestone,
}: UpdateProgressModalProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [updateProgress, { isLoading }] = useUpdateMilestoneProgressMutation();

  useEffect(() => {
    if (open && milestone) {
      setProgressPercentage(milestone.progressPercentage);
    }
  }, [open, milestone]);

  const handleSave = async () => {
    if (!milestone) {
      return;
    }

    try {
      await updateProgress({
        id: milestone.id,
        data: { progressPercentage },
      }).unwrap();

      toast.success("Progress updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      const message = error?.data?.message || "Failed to update progress";
      toast.error(message);
      console.error("Update progress error:", error);
    }
  };

  const getStatusFromProgress = (progress: number): string => {
    if (progress === 0) {
      return "Not Started";
    }
    if (progress === 100) {
      return "Completed";
    }
    return "In Progress";
  };

  if (!milestone) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Update Progress
          </DialogTitle>
          <DialogDescription>
            Update the progress percentage for{" "}
            <span className="font-semibold">{milestone.title}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Current Progress</span>
              <span className="font-semibold">
                {milestone.progressPercentage}%
              </span>
            </div>
            <Progress value={milestone.progressPercentage} className="h-2" />
          </div>

          {/* New Progress Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>New Progress</Label>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {progressPercentage}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[progressPercentage]}
              onValueChange={(value) => setProgressPercentage(value[0])}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Preview</Label>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status will be:</span>
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {getStatusFromProgress(progressPercentage)}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            </div>
          </div>

          {/* Status Change Info */}
          {progressPercentage !== milestone.progressPercentage && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-sm">
              <p className="text-blue-900 dark:text-blue-200">
                {progressPercentage === 100 &&
                  milestone.status !== MilestoneStatus.COMPLETED &&
                  "The milestone status will be automatically set to Completed."}
                {progressPercentage > 0 &&
                  progressPercentage < 100 &&
                  milestone.status === MilestoneStatus.NOT_STARTED &&
                  "The milestone status will be automatically set to In Progress."}
                {progressPercentage === 0 &&
                  milestone.status !== MilestoneStatus.NOT_STARTED &&
                  "The milestone status will remain unchanged."}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isLoading || progressPercentage === milestone.progressPercentage
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Progress"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
