"use client";

import { useCallback, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Columns3,
  Grid3X3,
  List,
  Loader2,
  Plus,
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
import { TaskStatsCards } from "./TaskStatsCards";
import { TaskFiltersCard } from "./TaskFiltersCard";
import { TaskTableView } from "./TaskTableView";
import { TaskCardView } from "./TaskCardView";
import { TaskKanbanView } from "./TaskKanbanView";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { EditTaskDialog } from "./EditTaskDialog";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { TaskDetailSheet } from "./TaskDetailSheet";
import { TaskPagination } from "./TaskPagination";
import { toast } from "sonner";

function getEmptyMessage(
  filters: TaskQueryParams,
  employeeView: boolean
): string {
  const hasFilters =
    filters.search ||
    (filters.status && filters.status !== "all") ||
    (filters.priority && filters.priority !== "all");
  if (hasFilters) {
    return "Try adjusting your filters or search query.";
  }
  if (employeeView) {
    return "You have no tasks assigned. Check back later!";
  }
  return "Get started by creating your first task.";
}

interface TasksPageProps {
  basePath?: string;
  projectId?: string;
  employeeView?: boolean;
  currentUserId?: string;
}

// eslint-disable-next-line complexity -- page orchestrator with many UI branches
export default function TasksPage({
  projectId,
  employeeView = false,
  currentUserId,
}: TasksPageProps) {
  // View state
  const [viewType, setViewType] = useState<"cards" | "table" | "kanban">(
    "table"
  );
  const [filters, setFilters] = useState<TaskQueryParams>({
    search: "",
    status: "all",
    priority: "all",
    assignedTo: employeeView && currentUserId ? currentUserId : "all",
    project: projectId || "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // RTK Query hooks
  const { data: tasksResponse, isLoading } = useGetTasksQuery(filters);
  const { data: stats } = useGetTaskStatsQuery(
    (() => {
      if (projectId) {
        return { project: projectId };
      }
      if (employeeView && currentUserId) {
        return { assignedTo: currentUserId };
      }
      return undefined;
    })()
  );
  const { data: projectsResponse } = useGetProjectsQuery(
    { limit: 100 },
    { skip: !!projectId }
  );
  const { data: employeesResponse } = useGetEmployeesQuery({ limit: 100 });

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Derived data
  const tasks = tasksResponse?.data || [];
  const pagination = tasksResponse?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

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

  const defaultStats = useMemo(
    () => ({
      total: stats?.total || 0,
      byStatus: stats?.byStatus || {
        todo: 0,
        in_progress: 0,
        review: 0,
        done: 0,
      },
      overdue: stats?.overdue || 0,
      upcoming: stats?.upcoming || 0,
    }),
    [stats]
  );

  // Handlers
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
        toast.success("Task updated successfully");
      } catch {
        toast.error("Failed to update task");
      }
    },
    [updateTask]
  );

  const handleStatusChange = useCallback(
    async (taskId: string, status: string) => {
      try {
        const updated = await updateTask({
          id: taskId,
          data: { status: status as TaskStatus },
        }).unwrap();
        setSelectedTask((prev) => (prev?._id === taskId ? updated : prev));
        toast.success(`Task status updated to ${status.replace("_", " ")}`);
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
        toast.success("Task deleted successfully");
      } catch {
        toast.error("Failed to delete task");
      }
    },
    [deleteTask]
  );

  const handleAddComment = useCallback(
    (_taskId: string, _text: string, _attachments?: TaskAttachment[]) => {
      // Comments are not yet supported by the backend
      toast.info("Comments feature coming soon");
    },
    []
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <CheckSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-foreground">
              {employeeView ? "My Tasks" : "Task Management"}
            </h1>
            <p className="text-muted-foreground">
              {employeeView
                ? "Track and update your assigned tasks"
                : "Assign, track, and manage team tasks across projects"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white/20 dark:bg-white/5 rounded-lg p-1 border border-white/30 dark:border-white/10 shadow-lg shadow-gray-200/50 dark:shadow-black/20">
            <Button
              variant={viewType === "cards" ? "default" : "ghost"}
              size="sm"
              className={
                viewType === "cards"
                  ? "px-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "px-3 text-muted-foreground hover:text-foreground"
              }
              onClick={() => setViewType("cards")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "kanban" ? "default" : "ghost"}
              size="sm"
              className={
                viewType === "kanban"
                  ? "px-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "px-3 text-muted-foreground hover:text-foreground"
              }
              onClick={() => setViewType("kanban")}
            >
              <Columns3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewType === "table" ? "default" : "ghost"}
              size="sm"
              className={
                viewType === "table"
                  ? "px-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                  : "px-3 text-muted-foreground hover:text-foreground"
              }
              onClick={() => setViewType("table")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Task Button (manager/admin only) */}
          {!employeeView && (
            <Button
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/25"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <TaskStatsCards stats={defaultStats} />

      {/* Filters */}
      <TaskFiltersCard
        filters={filters}
        onFiltersChange={setFilters}
        projects={projectId ? [] : projects}
        teamMembers={teamMembers}
        showProjectFilter={!projectId}
      />

      {/* Pagination Summary */}
      {total > 0 && (
        <div className="flex justify-between items-center px-2">
          <p className="text-sm text-muted-foreground">
            Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to{" "}
            {Math.min((filters.page || 1) * (filters.limit || 10), total)} of{" "}
            {total} tasks
          </p>
          <p className="text-sm text-muted-foreground">
            Page {filters.page || 1} of {totalPages}
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-16 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        </Card>
      )}

      {/* Task List */}
      {!isLoading && tasks.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-16 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-purple-500/10 rounded-full">
              <CheckSquare className="w-12 h-12 text-purple-500/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              No tasks found
            </h3>
            <p className="text-muted-foreground text-center max-w-md">
              {getEmptyMessage(filters, employeeView)}
            </p>
            {!employeeView && !filters.search && filters.status === "all" && (
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg"
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Task
              </Button>
            )}
          </div>
        </Card>
      )}

      {!isLoading && tasks.length > 0 && viewType === "table" && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-0 shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden">
          <TaskTableView
            tasks={tasks}
            filters={filters}
            onFiltersChange={setFilters}
            onViewTask={handleViewTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            showProjectColumn={!projectId}
            employeeView={employeeView}
          />
        </Card>
      )}

      {!isLoading && tasks.length > 0 && viewType === "cards" && (
        <TaskCardView
          tasks={tasks}
          onViewTask={handleViewTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          employeeView={employeeView}
        />
      )}

      {!isLoading && tasks.length > 0 && viewType === "kanban" && (
        <TaskKanbanView
          tasks={tasks}
          onViewTask={handleViewTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          employeeView={employeeView}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <TaskPagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
        />
      )}

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
        employeeView={employeeView}
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
        employeeView={employeeView}
      />
    </div>
  );
}
