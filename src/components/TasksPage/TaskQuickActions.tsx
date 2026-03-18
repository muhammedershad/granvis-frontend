"use client";

import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/types/task";
import { ArrowRight, CheckCircle2, Play, RotateCcw } from "lucide-react";

interface TaskQuickActionsProps {
  task: Task;
  onStatusChange: (taskId: string, status: string) => void;
}

const nextActions: Record<
  TaskStatus,
  { label: string; nextStatus: TaskStatus; icon: React.ElementType } | null
> = {
  [TaskStatus.TODO]: {
    label: "Start",
    nextStatus: TaskStatus.IN_PROGRESS,
    icon: Play,
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "Review",
    nextStatus: TaskStatus.REVIEW,
    icon: ArrowRight,
  },
  [TaskStatus.REVIEW]: {
    label: "Complete",
    nextStatus: TaskStatus.DONE,
    icon: CheckCircle2,
  },
  [TaskStatus.DONE]: {
    label: "Reopen",
    nextStatus: TaskStatus.TODO,
    icon: RotateCcw,
  },
};

export function TaskQuickActions({
  task,
  onStatusChange,
}: TaskQuickActionsProps) {
  const action = nextActions[task.status];
  if (!action) {
    return null;
  }

  const Icon = action.icon;

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-6 text-[10px] px-2 gap-1 bg-white/50 dark:bg-white/10 border-white/30 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20"
      onClick={(e) => {
        e.stopPropagation();
        onStatusChange(task._id, action.nextStatus);
      }}
    >
      <Icon className="h-3 w-3" />
      {action.label}
    </Button>
  );
}
