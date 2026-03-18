import { apiSlice } from "./apiSlice";
import {
  CreateTaskInput,
  PaginatedTaskResponse,
  Task,
  TaskQueryParams,
  TaskStats,
  UpdateTaskInput,
} from "@/types/task";

// Build query string from params, skipping "all" values
function buildTaskParams(params: TaskQueryParams): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      qs.append(key, String(value));
    }
  });
  return qs.toString();
}

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get paginated tasks with filters
    getTasks: builder.query<PaginatedTaskResponse, TaskQueryParams>({
      query: (params) => ({
        url: `/tasks?${buildTaskParams(params)}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Task" as const,
                id: _id,
              })),
              { type: "Task" as const, id: "LIST" },
            ]
          : [{ type: "Task" as const, id: "LIST" }],
      keepUnusedDataFor: 60,
    }),

    // Get single task by ID
    getTaskById: builder.query<Task, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Task" as const, id }],
      keepUnusedDataFor: 120,
    }),

    // Get task statistics
    getTaskStats: builder.query<
      TaskStats,
      { project?: string; assignedTo?: string } | void
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.project) {
          qs.append("project", params.project);
        }
        if (params?.assignedTo) {
          qs.append("assignedTo", params.assignedTo);
        }
        return {
          url: `/tasks/stats${qs.toString() ? `?${qs.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "Task" as const, id: "STATS" }],
      keepUnusedDataFor: 30,
    }),

    // Create a new task
    createTask: builder.mutation<Task, CreateTaskInput>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Task" as const, id: "LIST" },
        { type: "Task" as const, id: "STATS" },
      ],
    }),

    // Update an existing task
    updateTask: builder.mutation<Task, { id: string; data: UpdateTaskInput }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task" as const, id },
        { type: "Task" as const, id: "LIST" },
        { type: "Task" as const, id: "STATS" },
      ],
    }),

    // Delete a task (soft delete)
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Task" as const, id },
        { type: "Task" as const, id: "LIST" },
        { type: "Task" as const, id: "STATS" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useGetTaskStatsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
