import { apiSlice } from "./apiSlice";
import { Project } from "@/types/project";

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
  priority?: string;
  projectManager?: string;
  sortBy?:
    | "createdAt"
    | "name"
    | "startDate"
    | "totalBudget"
    | "progressPercentage"
    | "priority"
    | "status";
  sortOrder?: "asc" | "desc";
  startDateFrom?: string;
  startDateTo?: string;
  minBudget?: number;
  maxBudget?: number;
  userId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProjectStatistics {
  totalProjects: number;
  byStatus: Array<{ _id: string; count: number }>;
  byType: Array<{ _id: string; count: number }>;
  budget: {
    totalBudget: number;
    totalSpent: number;
    averageBudget: number;
  };
}

// Extend the main API slice with project endpoints
export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects with pagination, filters, search, and sort
    getProjects: builder.query<PaginatedResponse<Project>, ProjectQueryParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.append(key, String(value));
          }
        });
        return {
          url: `/projects/paginated?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Project" as const,
                id,
              })),
              { type: "Project" as const, id: "LIST" },
            ]
          : [{ type: "Project" as const, id: "LIST" }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Get all projects without pagination
    getAllProjects: builder.query<Project[], Record<string, unknown> | void>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              params.append(key, String(value));
            }
          });
        }
        return {
          url: `/projects${params.toString() ? `?${params.toString()}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              { type: "Project" as const, id: "ALL" },
            ]
          : [{ type: "Project" as const, id: "ALL" }],
      keepUnusedDataFor: 300,
    }),

    // Get a single project by ID
    getProjectById: builder.query<Project, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Project" as const, id }],
      keepUnusedDataFor: 300,
    }),

    // Get projects by client ID
    getProjectsByClient: builder.query<Project[], string>({
      query: (clientId) => ({
        url: `/projects/client/${clientId}`,
        method: "GET",
      }),
      providesTags: (result, error, clientId) => [
        { type: "Project" as const, id: `CLIENT_${clientId}` },
        { type: "Project" as const, id: "CLIENT_LIST" },
      ],
      keepUnusedDataFor: 300,
    }),

    // Get projects by employee ID (as manager or team member)
    getProjectsByEmployee: builder.query<Project[], string>({
      query: (employeeId) => ({
        url: `/projects/employee/${employeeId}`,
        method: "GET",
      }),
      providesTags: (result, error, employeeId) => [
        { type: "Project" as const, id: `EMPLOYEE_${employeeId}` },
        { type: "Project" as const, id: "EMPLOYEE_LIST" },
      ],
      keepUnusedDataFor: 300,
    }),

    // Get project statistics
    getProjectStatistics: builder.query<ProjectStatistics, void>({
      query: () => ({
        url: "/projects/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "Project" as const, id: "STATS" }],
      keepUnusedDataFor: 120, // Cache for 2 minutes
    }),

    // Create a new project
    createProject: builder.mutation<
      Project,
      Omit<Project, "id" | "createdAt" | "updatedAt">
    >({
      query: (project) => ({
        url: "/projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: [
        { type: "Project" as const, id: "LIST" },
        { type: "Project" as const, id: "ALL" },
        { type: "Project" as const, id: "STATS" },
        { type: "Project" as const, id: "EMPLOYEE_LIST" },
        { type: "Project" as const, id: "CLIENT_LIST" },
      ],
    }),

    // Update an existing project
    updateProject: builder.mutation<
      Project,
      { id: string; data: Partial<Project> }
    >({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project" as const, id },
        { type: "Project" as const, id: "LIST" },
        { type: "Project" as const, id: "ALL" },
        { type: "Project" as const, id: "STATS" },
        { type: "Project" as const, id: "EMPLOYEE_LIST" },
        { type: "Project" as const, id: "CLIENT_LIST" },
      ],
    }),

    // Delete a project (soft delete)
    deleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Project" as const, id },
        { type: "Project" as const, id: "LIST" },
        { type: "Project" as const, id: "ALL" },
        { type: "Project" as const, id: "STATS" },
        { type: "Project" as const, id: "EMPLOYEE_LIST" },
        { type: "Project" as const, id: "CLIENT_LIST" },
      ],
    }),

    // Hard delete a project
    hardDeleteProject: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/projects/${id}/hard`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Project" as const, id },
        { type: "Project" as const, id: "LIST" },
        { type: "Project" as const, id: "ALL" },
        { type: "Project" as const, id: "STATS" },
        { type: "Project" as const, id: "EMPLOYEE_LIST" },
        { type: "Project" as const, id: "CLIENT_LIST" },
      ],
    }),

    // Restore a deleted project
    restoreProject: builder.mutation<Project, string>({
      query: (id) => ({
        url: `/projects/${id}/restore`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Project" as const, id },
        { type: "Project" as const, id: "LIST" },
        { type: "Project" as const, id: "ALL" },
        { type: "Project" as const, id: "STATS" },
        { type: "Project" as const, id: "EMPLOYEE_LIST" },
        { type: "Project" as const, id: "CLIENT_LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetProjectsQuery,
  useGetAllProjectsQuery,
  useGetProjectByIdQuery,
  useGetProjectsByClientQuery,
  useGetProjectsByEmployeeQuery,
  useGetProjectStatisticsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useHardDeleteProjectMutation,
  useRestoreProjectMutation,
} = projectsApi;
