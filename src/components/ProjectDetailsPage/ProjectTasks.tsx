"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Plus,
  Timer,
} from "lucide-react";
import {
  Task,
  TaskAttachment,
  TaskPriority,
  TaskProjectRef,
  TaskQueryParams,
  TaskStatus,
  TaskUserRef,
} from "@/types/task";
import {
  CreateTaskFormValues,
  UpdateTaskFormValues,
} from "@/lib/validations/task";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskStatsQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "@/lib/api/tasksApi";
import { useGetProjectsQuery } from "@/lib/api/projectsApi";
import { useGetEmployeesQuery } from "@/lib/api/employeesApi";
import { TaskTableView } from "@/components/TasksPage/TaskTableView";
import { CreateTaskDialog } from "@/components/TasksPage/CreateTaskDialog";
import { EditTaskDialog } from "@/components/TasksPage/EditTaskDialog";
import { DeleteTaskDialog } from "@/components/TasksPage/DeleteTaskDialog";
import { TaskDetailSheet } from "@/components/TasksPage/TaskDetailSheet";
import { toast } from "sonner";

interface ProjectTasksProps {
  projectId: string;
}

export function ProjectTasks({ projectId }: ProjectTasksProps) {
  const [filters, setFilters] = useState<TaskQueryParams>({
    project: projectId,
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 5,
  });

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // RTK Query hooks
  const { data: tasksResponse, isLoading } = useGetTasksQuery(filters);
  const { data: stats } = useGetTaskStatsQuery({ project: projectId });
  const { data: projectsResponse } = useGetProjectsQuery({ limit: 100 });
  const { data: employeesResponse } = useGetEmployeesQuery({ limit: 100 });

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks = tasksResponse?.data || [];

  const projects: TaskProjectRef[] = useMemo(
    () =>
      (projectsResponse?.data || []).map((p) => ({
        _id: p.id,
        name: p.name,
      })),
    [projectsResponse]
  );

  const teamMembers: TaskUserRef[] = useMemo(
    () =>
      (employeesResponse?.data || []).map((e) => ({
        _id: e.id,
        firstName: e.firstName,
        lastName: e.lastName,
        avatar: e.avatar,
      })),
    [employeesResponse]
  );

  const handleViewTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setDetailSheetOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setEditDialogOpen(true);
  }, []);

  const handleDeleteTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  }, []);

  const handleCreateSubmit = useCallback(
    async (data: CreateTaskFormValues, _attachments: TaskAttachment[]) => {
      try {
        await createTask({
          title: data.title,
          description: data.description,
          assignedTo: data.assignedTo,
          project: data.project,
          milestone: data.milestone,
          priority: (data.priority as TaskPriority) || undefined,
          dueDate: data.dueDate,
          estimatedHours:
            typeof data.estimatedHours === "number"
              ? data.estimatedHours
              : undefined,
        }).unwrap();
        toast.success("Task created successfully");
      } catch {
        toast.error("Failed to create task");
      }
    },
    [createTask]
  );

  const handleEditSubmit = useCallback(
    async (
      taskId: string,
      data: UpdateTaskFormValues,
      _newAttachments: TaskAttachment[]
    ) => {
      try {
        const updated = await updateTask({
          id: taskId,
          data: {
            title: data.title,
            description: data.description,
            assignedTo: data.assignedTo,
            project: data.project,
            milestone: data.milestone,
            priority: (data.priority as TaskPriority) || undefined,
            dueDate: data.dueDate,
            estimatedHours:
              typeof data.estimatedHours === "number"
                ? data.estimatedHours
                : undefined,
            actualHours:
              typeof data.actualHours === "number"
                ? data.actualHours
                : undefined,
          },
        }).unwrap();
        setSelectedTask((prev) => (prev?._id === taskId ? updated : prev));
        toast.success("Task updated");
      } catch {
        toast.error("Failed to update task");
      }
    },
    [updateTask]
  );

  const handleStatusChange = useCallback(
    async (taskId: string, status: TaskStatus) => {
      try {
        const updated = await updateTask({
          id: taskId,
          data: { status },
        }).unwrap();
        setSelectedTask((prev) => (prev?._id === taskId ? updated : prev));
        toast.success("Task status updated");
      } catch {
        toast.error("Failed to update status");
      }
    },
    [updateTask]
  );

  const handleDeleteConfirm = useCallback(
    async (taskId: string) => {
      try {
        await deleteTask(taskId).unwrap();
        setDetailSheetOpen(false);
        toast.success("Task deleted");
      } catch {
        toast.error("Failed to delete task");
      }
    },
    [deleteTask]
  );

  const handleAddComment = useCallback(
    (_taskId: string, _text: string, _attachments?: TaskAttachment[]) => {
      toast.info("Comments feature coming soon");
    },
    []
  );

  const statItems = [
    {
      label: "Total",
      value: stats?.total || 0,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-500/20",
    },
    {
      label: "In Progress",
      value: stats?.byStatus?.in_progress || 0,
      icon: Timer,
      color: "text-cyan-600",
      bg: "bg-cyan-100 dark:bg-cyan-500/20",
    },
    {
      label: "Completed",
      value: stats?.byStatus?.done || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-500/20",
    },
    {
      label: "Overdue",
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-100 dark:bg-red-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-4 gap-3">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10"
          >
            <div className={`p-1.5 rounded-md ${item.bg}`}>
              <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-sm font-bold text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Task Table */}
      {(() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          );
        }
        if (tasks.length === 0) {
          return (
            <div className="text-center py-8">
              <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No tasks for this project yet.
              </p>
            </div>
          );
        }
        return (
          <TaskTableView
            tasks={tasks}
            filters={filters}
            onFiltersChange={setFilters}
            onViewTask={handleViewTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            showProjectColumn={false}
          />
        );
      })()}

      {/* Dialogs */}
      <CreateTaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateSubmit}
        fixedProjectId={projectId}
        projects={projects}
        teamMembers={teamMembers}
      />
      <EditTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        task={selectedTask}
        onSubmit={handleEditSubmit}
        projects={projects}
        teamMembers={teamMembers}
      />
      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        task={selectedTask}
        onConfirm={handleDeleteConfirm}
      />
      <TaskDetailSheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        task={selectedTask}
        onStatusChange={handleStatusChange}
        onAddComment={handleAddComment}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
