"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Eye,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Task } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusSelect";
import {
  formatDueDate,
  isDueSoon,
  isOverdue,
  priorityConfig,
  priorityStripeColors,
  statusProgressMap,
} from "./taskUtils";
import { TaskQuickActions } from "./TaskQuickActions";
import { cn } from "@/components/ui/utils";

interface TaskCardViewProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange?: (taskId: string, status: string) => void;
  employeeView?: boolean;
}

export function TaskCardView({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  employeeView = false,
}: TaskCardViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((task) => {
        const overdue = isOverdue(task.dueDate, task.status);
        const dueSoon = isDueSoon(task.dueDate, task.status);
        const pConfig = priorityConfig[task.priority];
        const progress = statusProgressMap[task.status];

        return (
          <Card
            key={task._id}
            className="relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50 cursor-pointer hover:shadow-2xl hover:scale-[1.01] transition-all duration-200 group"
            onClick={() => onViewTask(task)}
          >
            {/* Priority stripe */}
            <div
              className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                priorityStripeColors[task.priority]
              )}
            />

            <div className="p-4 pl-5">
              {/* Header: Status + Actions */}
              <div className="flex items-start justify-between mb-3">
                <TaskStatusBadge status={task.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewTask(task);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {employeeView ? "Update Status" : "Edit Task"}
                    </DropdownMenuItem>
                    {!employeeView && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteTask(task);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Task
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Title & Description */}
              <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {task.description}
                </p>
              )}

              {/* Project Badge */}
              <div className="mb-3">
                <span className="text-xs font-medium text-muted-foreground bg-white/50 dark:bg-white/10 rounded-md px-2 py-1 border border-white/20 dark:border-white/10">
                  {task.project.name}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Progress
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              {/* Footer: Assignee + Due Date + Priority */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {task.assignedTo.firstName[0]}
                      {task.assignedTo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {task.assignedTo.firstName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {task.estimatedHours && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {task.actualHours || 0}/{task.estimatedHours}h
                    </div>
                  )}

                  {task.dueDate && (
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs",
                        overdue && "text-red-600 dark:text-red-400",
                        dueSoon &&
                          !overdue &&
                          "text-amber-600 dark:text-amber-400",
                        !overdue && !dueSoon && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="h-3 w-3" />
                      {formatDueDate(task.dueDate)}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority badge */}
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                    pConfig.bgColor,
                    pConfig.textColor,
                    pConfig.borderColor
                  )}
                >
                  {pConfig.label}
                </span>

                {/* Employee Quick Actions */}
                {employeeView && onStatusChange && (
                  <TaskQuickActions
                    task={task}
                    onStatusChange={onStatusChange}
                  />
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
