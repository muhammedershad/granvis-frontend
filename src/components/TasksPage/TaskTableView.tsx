"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowUpDown,
  Calendar,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Task, TaskQueryParams } from "@/types/task";
import { TaskStatusBadge } from "./TaskStatusSelect";
import {
  formatDueDate,
  isDueSoon,
  isOverdue,
  priorityConfig,
} from "./taskUtils";
import { cn } from "@/components/ui/utils";

interface TaskTableViewProps {
  tasks: Task[];
  filters: TaskQueryParams;
  onFiltersChange: (filters: TaskQueryParams) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  showProjectColumn?: boolean;
  employeeView?: boolean;
}

export function TaskTableView({
  tasks,
  filters,
  onFiltersChange,
  onViewTask,
  onEditTask,
  onDeleteTask,
  showProjectColumn = true,
  employeeView = false,
}: TaskTableViewProps) {
  const handleSort = (column: string) => {
    const isCurrentSort = filters.sortBy === column;
    onFiltersChange({
      ...filters,
      sortBy: column as TaskQueryParams["sortBy"],
      sortOrder: isCurrentSort && filters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  const SortableHeader = ({
    column,
    children,
  }: {
    column: string;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-medium"
        onClick={() => handleSort(column)}
      >
        {children}
        <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    </TableHead>
  );

  return (
    <div className="rounded-lg border border-white/20 dark:border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/30 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/5">
            <SortableHeader column="title">Title</SortableHeader>
            {showProjectColumn && <TableHead>Project</TableHead>}
            <TableHead>Assignee</TableHead>
            <SortableHeader column="status">Status</SortableHeader>
            <SortableHeader column="priority">Priority</SortableHeader>
            <SortableHeader column="dueDate">Due Date</SortableHeader>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            const dueSoon = isDueSoon(task.dueDate, task.status);
            const pConfig = priorityConfig[task.priority];
            return (
              <TableRow
                key={task._id}
                className="cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                onClick={() => onViewTask(task)}
              >
                {/* Title */}
                <TableCell className="max-w-[300px]">
                  <div>
                    <p className="font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Project */}
                {showProjectColumn && (
                  <TableCell>
                    <span className="text-xs font-medium text-muted-foreground bg-white/50 dark:bg-white/10 rounded-md px-2 py-1 border border-white/20 dark:border-white/10">
                      {task.project.name}
                    </span>
                  </TableCell>
                )}

                {/* Assignee */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {task.assignedTo.firstName[0]}
                        {task.assignedTo.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <TaskStatusBadge status={task.status} />
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                      pConfig.bgColor,
                      pConfig.textColor,
                      pConfig.borderColor
                    )}
                  >
                    {pConfig.label}
                  </span>
                </TableCell>

                {/* Due Date */}
                <TableCell>
                  {task.dueDate ? (
                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-sm",
                        overdue && "text-red-600 dark:text-red-400",
                        dueSoon &&
                          !overdue &&
                          "text-amber-600 dark:text-amber-400",
                        !overdue && !dueSoon && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDueDate(task.dueDate)}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">--</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
