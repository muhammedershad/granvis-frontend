import { TaskPriority, TaskStatus } from "@/types/task";

export const priorityConfig: Record<
  TaskPriority,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  [TaskPriority.LOW]: {
    label: "Low",
    bgColor: "bg-slate-100 dark:bg-slate-500/20",
    textColor: "text-slate-700 dark:text-slate-300",
    borderColor: "border-slate-200 dark:border-slate-500/30",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-500/30",
  },
  [TaskPriority.HIGH]: {
    label: "High",
    bgColor: "bg-orange-100 dark:bg-orange-500/20",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-500/30",
  },
  [TaskPriority.URGENT]: {
    label: "Urgent",
    bgColor: "bg-red-100 dark:bg-red-500/20",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-200 dark:border-red-500/30",
  },
};

export const priorityStripeColors: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "bg-slate-400",
  [TaskPriority.MEDIUM]: "bg-blue-500",
  [TaskPriority.HIGH]: "bg-orange-500",
  [TaskPriority.URGENT]: "bg-red-500",
};

export const statusProgressMap: Record<TaskStatus, number> = {
  [TaskStatus.TODO]: 0,
  [TaskStatus.IN_PROGRESS]: 40,
  [TaskStatus.REVIEW]: 75,
  [TaskStatus.DONE]: 100,
};

export function isOverdue(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === TaskStatus.DONE) {
    return false;
  }
  return new Date(dueDate) < new Date();
}

export function isDueSoon(dueDate?: string, status?: TaskStatus): boolean {
  if (!dueDate || status === TaskStatus.DONE) {
    return false;
  }
  const diff =
    (new Date(dueDate).getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24);
  return diff > 0 && diff <= 2;
}

export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)}d overdue`;
  }
  if (diffDays === 0) {
    return "Due today";
  }
  if (diffDays === 1) {
    return "Due tomorrow";
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays}d`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
