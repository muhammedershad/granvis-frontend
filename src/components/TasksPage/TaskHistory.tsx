"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Paperclip,
  PlusCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";
import { TaskHistoryAction, TaskHistoryEntry } from "@/types/task";
import { cn } from "@/components/ui/utils";
import { formatRelativeDate } from "./taskUtils";

interface TaskHistoryProps {
  history: TaskHistoryEntry[];
}

const actionConfig: Record<
  TaskHistoryAction,
  {
    icon: React.ElementType;
    color: string;
    bg: string;
    label: string;
  }
> = {
  created: {
    icon: PlusCircle,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-500/20",
    label: "created this task",
  },
  status_changed: {
    icon: RefreshCw,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-500/20",
    label: "changed status",
  },
  edited: {
    icon: FileText,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-500/20",
    label: "edited the task",
  },
  comment_added: {
    icon: MessageSquare,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-500/20",
    label: "added a comment",
  },
  attachment_added: {
    icon: Paperclip,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-500/20",
    label: "added attachments",
  },
  assignee_changed: {
    icon: UserCheck,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-100 dark:bg-cyan-500/20",
    label: "assigned the task",
  },
  priority_changed: {
    icon: Calendar,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-500/20",
    label: "changed priority",
  },
  due_date_changed: {
    icon: Clock,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-500/20",
    label: "changed due date",
  },
};

function FromToArrow({ from, to }: { from: string; to: string }) {
  return (
    <>
      <span className="font-medium text-foreground">{from}</span>
      <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" />
      <span className="font-medium text-foreground">{to}</span>
    </>
  );
}

const actionPrefixes: Partial<Record<TaskHistoryAction, string>> = {
  status_changed: "changed status from ",
  priority_changed: "changed priority from ",
  due_date_changed: "changed due date from ",
};

function getDescription(entry: TaskHistoryEntry): React.ReactNode {
  const config = actionConfig[entry.action];
  const { details } = entry;

  // Actions with from → to pattern
  const prefix = actionPrefixes[entry.action];
  if (prefix && details?.from && details?.to) {
    return (
      <span>
        {prefix}
        <FromToArrow from={details.from} to={details.to} />
      </span>
    );
  }

  if (entry.action === "assignee_changed" && details?.to) {
    return (
      <span>
        assigned to{" "}
        <span className="font-medium text-foreground">{details.to}</span>
      </span>
    );
  }

  if (entry.action === "edited" && details?.field) {
    return (
      <span>
        updated{" "}
        <span className="font-medium text-foreground">{details.field}</span>
        {details.from && details.to && (
          <>
            {" from "}
            <FromToArrow from={details.from} to={details.to} />
          </>
        )}
      </span>
    );
  }

  return config.label;
}

export function TaskHistory({ history }: TaskHistoryProps) {
  // Sort newest first
  const sorted = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative">
      {sorted.map((entry, idx) => {
        const config = actionConfig[entry.action];
        const Icon = config.icon;
        const isLast = idx === sorted.length - 1;

        return (
          <div key={entry._id || idx} className="flex gap-3 relative">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-gray-200 dark:bg-white/10" />
            )}

            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex-shrink-0 w-[30px] h-[30px] rounded-full flex items-center justify-center",
                config.bg
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", config.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex items-start gap-2">
                <Avatar className="h-5 w-5 flex-shrink-0 mt-0.5">
                  <AvatarFallback className="text-[8px] bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {entry.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {entry.userName}
                    </span>{" "}
                    {getDescription(entry)}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                    {formatRelativeDate(entry.timestamp)}
                    <span className="mx-1.5">·</span>
                    {new Date(entry.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                    {", "}
                    {new Date(entry.timestamp).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
