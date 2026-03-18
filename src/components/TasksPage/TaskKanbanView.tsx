"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Task, TaskStatus } from "@/types/task";
import { getStatusConfig } from "./TaskStatusSelect";
import {
  formatDueDate,
  isDueSoon,
  isOverdue,
  priorityConfig,
  priorityStripeColors,
} from "./taskUtils";
import { cn } from "@/components/ui/utils";

const COLUMN_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.REVIEW,
  TaskStatus.DONE,
];

// --- KanbanCard ---

interface KanbanCardProps {
  task: Task;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  employeeView: boolean;
  isDragOverlay?: boolean;
}

function KanbanCard({
  task,
  onViewTask,
  onEditTask,
  onDeleteTask,
  employeeView,
  isDragOverlay = false,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id });

  const style = isDragOverlay
    ? undefined
    : {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      };

  const overdue = isOverdue(task.dueDate, task.status);
  const dueSoon = isDueSoon(task.dueDate, task.status);
  const pConfig = priorityConfig[task.priority];

  return (
    <div
      ref={isDragOverlay ? undefined : setNodeRef}
      style={style}
      {...(isDragOverlay ? {} : attributes)}
      {...(isDragOverlay ? {} : listeners)}
      className={cn(
        "relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-lg p-3 shadow-md cursor-grab active:cursor-grabbing hover:shadow-lg transition-all group",
        isDragging && "opacity-30",
        isDragOverlay && "opacity-95 rotate-2 scale-105 shadow-2xl"
      )}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation();
          onViewTask(task);
        }
      }}
    >
      {/* Priority stripe */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
          priorityStripeColors[task.priority]
        )}
      />

      {/* Top row: Priority badge + Action menu */}
      <div className="flex items-center justify-between mb-2 pl-1.5">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
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

      {/* Title */}
      <h4 className="font-medium text-sm text-foreground line-clamp-1 mb-2 pl-1.5">
        {task.title}
      </h4>

      {/* Bottom row: Avatar + name | Due date */}
      <div className="flex items-center justify-between pl-1.5">
        <div className="flex items-center gap-1.5">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px] bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {task.assignedTo.firstName[0]}
              {task.assignedTo.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-muted-foreground">
            {task.assignedTo.firstName}
          </span>
        </div>

        {task.dueDate && (
          <span
            className={cn(
              "text-[11px] flex items-center gap-1",
              overdue && "text-red-600 dark:text-red-400",
              dueSoon && !overdue && "text-amber-600 dark:text-amber-400",
              !overdue && !dueSoon && "text-muted-foreground"
            )}
          >
            <Calendar className="h-3 w-3" />
            {formatDueDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}

// --- KanbanColumn ---

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  employeeView: boolean;
}

function KanbanColumn({
  status,
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  employeeView,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = getStatusConfig(status);

  return (
    <div className="flex-1 min-w-[280px] flex flex-col gap-3">
      {/* Column Header */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", config.dotColor)} />
            <h3 className="font-semibold text-sm text-foreground">
              {config.label}
            </h3>
          </div>
          <span className="text-xs font-medium bg-white/50 dark:bg-white/10 rounded-full px-2 py-0.5 text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 space-y-2.5 min-h-[200px] p-2 rounded-xl border-2 border-dashed transition-colors duration-200",
          isOver ? "border-purple-500/30 bg-purple-500/5" : "border-transparent"
        )}
      >
        {tasks.map((task) => (
          <KanbanCard
            key={task._id}
            task={task}
            onViewTask={onViewTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            employeeView={employeeView}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-muted-foreground/50">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

// --- TaskKanbanView ---

interface TaskKanbanViewProps {
  tasks: Task[];
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: string) => void;
  employeeView?: boolean;
}

export function TaskKanbanView({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  employeeView = false,
}: TaskKanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor)
  );

  const columns = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.REVIEW]: [],
      [TaskStatus.DONE]: [],
    };
    for (const task of tasks) {
      grouped[task.status]?.push(task);
    }
    return grouped;
  }, [tasks]);

  const activeTask = useMemo(
    () => (activeId ? tasks.find((t) => t._id === activeId) : null),
    [activeId, tasks]
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id as string;
    const targetStatus = over.id as string;
    const task = tasks.find((t) => t._id === taskId);

    if (!task || task.status === targetStatus) {
      return;
    }

    // Ensure the target is a valid column status
    if (COLUMN_ORDER.includes(targetStatus as TaskStatus)) {
      onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMN_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columns[status]}
            onViewTask={onViewTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            employeeView={employeeView}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanCard
            task={activeTask}
            onViewTask={onViewTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            employeeView={employeeView}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
