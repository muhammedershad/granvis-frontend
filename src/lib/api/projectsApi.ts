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
      ],
      keepUnusedDataFor: 300,
    }),

    // Get project statistics
    getProjectStatistics: builder.query<Record<string, unknown>, void>({
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
  useGetProjectStatisticsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useHardDeleteProjectMutation,
  useRestoreProjectMutation,
} = projectsApi;
