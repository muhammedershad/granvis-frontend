"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/types/task";
import { cn } from "@/components/ui/utils";

interface TaskStatusSelectProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  compact?: boolean;
  disabled?: boolean;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
  [TaskStatus.TODO]: {
    label: "To Do",
    dotColor: "bg-slate-500",
    bgColor:
      "bg-slate-100 dark:bg-slate-500/20 border-slate-200 dark:border-slate-500/30",
    textColor: "text-slate-700 dark:text-slate-300",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    dotColor: "bg-cyan-500",
    bgColor:
      "bg-cyan-100 dark:bg-cyan-500/20 border-cyan-200 dark:border-cyan-500/30",
    textColor: "text-cyan-700 dark:text-cyan-300",
  },
  [TaskStatus.REVIEW]: {
    label: "In Review",
    dotColor: "bg-yellow-500",
    bgColor:
      "bg-yellow-100 dark:bg-yellow-500/20 border-yellow-200 dark:border-yellow-500/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  [TaskStatus.DONE]: {
    label: "Completed",
    dotColor: "bg-green-500",
    bgColor:
      "bg-green-100 dark:bg-green-500/20 border-green-200 dark:border-green-500/30",
    textColor: "text-green-700 dark:text-green-300",
  },
};

export function getStatusConfig(status: TaskStatus) {
  return statusConfig[status];
}

export function TaskStatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor)} />
      {config.label}
    </span>
  );
}

export function TaskStatusSelect({
  value,
  onChange,
  compact = false,
  disabled = false,
}: TaskStatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as TaskStatus)}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          "border-white/20 dark:border-white/10",
          compact ? "h-8 text-xs w-[140px]" : "h-9 w-[160px]"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([status, config]) => (
          <SelectItem key={status} value={status}>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", config.dotColor)} />
              <span>{config.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
