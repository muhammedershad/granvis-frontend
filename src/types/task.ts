// Task Status
export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  REVIEW = "review",
  DONE = "done",
}

// Task Priority
export enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Task Attachment (file/image)
export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string; // MIME type
  size: number; // bytes
  uploadedBy: string;
  uploadedAt: string;
}

// Task History Action
export type TaskHistoryAction =
  | "created"
  | "status_changed"
  | "edited"
  | "comment_added"
  | "attachment_added"
  | "assignee_changed"
  | "priority_changed"
  | "due_date_changed";

// Task History Entry
export interface TaskHistoryEntry {
  _id?: string;
  action: TaskHistoryAction;
  userId: string;
  userName: string;
  timestamp: string;
  details?: {
    from?: string;
    to?: string;
    field?: string;
  };
}

// Task Comment
export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  attachments?: TaskAttachment[];
  createdAt: string;
}

// Populated user reference
export interface TaskUserRef {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

// Populated project reference
export interface TaskProjectRef {
  _id: string;
  name: string;
}

// Populated milestone reference
export interface TaskMilestoneRef {
  _id: string;
  title: string;
}

// Main Task interface (matches backend Mongoose response)
export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo: TaskUserRef;
  assignedBy: TaskUserRef;
  project: TaskProjectRef;
  milestone?: TaskMilestoneRef;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  history: TaskHistoryEntry[];
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Create Task Input
export interface CreateTaskInput {
  title: string;
  description?: string;
  assignedTo: string;
  project: string;
  milestone?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
}

// Update Task Input
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  assignedTo?: string;
  project?: string;
  milestone?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
}

// Update Task Status Input
export interface UpdateTaskStatusInput {
  status: TaskStatus;
}

// Query Params
export interface TaskQueryParams {
  page?: number;
  limit?: number;
  project?: string;
  assignedTo?: string;
  assignedBy?: string;
  status?: TaskStatus | "all";
  priority?: TaskPriority | "all";
  milestone?: string;
  search?: string;
  sortBy?: "dueDate" | "priority" | "createdAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
  overdue?: boolean;
}

// Paginated Response
export interface PaginatedTaskResponse {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Task Statistics
export interface TaskStats {
  total: number;
  byStatus: Record<string, number>;
  overdue: number;
  upcoming: number;
}
