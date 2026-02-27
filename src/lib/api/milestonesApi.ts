import { apiSlice } from "./apiSlice";
import {
  CreateMilestoneDto,
  Milestone,
  ProjectProgressSummary,
  ReorderMilestonesDto,
  UpdateMilestoneDto,
  UpdateMilestoneProgressDto,
  UpdateMilestoneStatusDto,
} from "@/types/milestone";

export const milestonesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get milestones by project
    getMilestonesByProject: builder.query<Milestone[], string>({
      query: (projectId) => `/milestones/project/${projectId}`,
      providesTags: (result, _error, projectId) => [
        { type: "Milestone" as const, id: `PROJECT_${projectId}` },
        ...(result?.map(({ id }) => ({ type: "Milestone" as const, id })) ||
          []),
      ],
    }),

    // Get project progress summary
    getProjectProgressSummary: builder.query<ProjectProgressSummary, string>({
      query: (projectId) => `/milestones/project/${projectId}/summary`,
      providesTags: (_result, _error, projectId) => [
        { type: "Milestone" as const, id: `PROJECT_${projectId}_SUMMARY` },
      ],
    }),

    // Get single milestone
    getMilestoneById: builder.query<Milestone, string>({
      query: (id) => `/milestones/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "Milestone" as const, id },
      ],
    }),

    // Create milestone
    createMilestone: builder.mutation<Milestone, CreateMilestoneDto>({
      query: (data) => ({
        url: "/milestones",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Project" as const, id: result?.projectId },
      ],
    }),

    // Update milestone
    updateMilestone: builder.mutation<
      Milestone,
      { id: string; data: UpdateMilestoneDto }
    >({
      query: ({ id, data }) => ({
        url: `/milestones/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Milestone" as const, id },
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Project" as const, id: result?.projectId },
      ],
    }),

    // Update milestone progress
    updateMilestoneProgress: builder.mutation<
      Milestone,
      { id: string; data: UpdateMilestoneProgressDto }
    >({
      query: ({ id, data }) => ({
        url: `/milestones/${id}/progress`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Milestone" as const, id },
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Project" as const, id: result?.projectId },
      ],
    }),

    // Update milestone status
    updateMilestoneStatus: builder.mutation<
      Milestone,
      { id: string; data: UpdateMilestoneStatusDto }
    >({
      query: ({ id, data }) => ({
        url: `/milestones/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Milestone" as const, id },
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Project" as const, id: result?.projectId },
      ],
    }),

    // Delete milestone
    deleteMilestone: builder.mutation<
      { deleted: boolean; message: string },
      { id: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `/milestones/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Milestone" as const, id: `PROJECT_${projectId}` },
        { type: "Milestone" as const, id: `PROJECT_${projectId}_SUMMARY` },
        { type: "Project" as const, id: projectId },
      ],
    }),

    // Reorder milestones
    reorderMilestones: builder.mutation<
      Milestone[],
      ReorderMilestonesDto & { projectId: string }
    >({
      query: ({ milestoneIds }) => ({
        url: "/milestones/reorder",
        method: "POST",
        body: { milestoneIds },
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Milestone" as const, id: `PROJECT_${projectId}` },
        { type: "Milestone" as const, id: `PROJECT_${projectId}_SUMMARY` },
      ],
    }),
  }),
});

export const {
  useGetMilestonesByProjectQuery,
  useGetProjectProgressSummaryQuery,
  useGetMilestoneByIdQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  useUpdateMilestoneProgressMutation,
  useUpdateMilestoneStatusMutation,
  useDeleteMilestoneMutation,
  useReorderMilestonesMutation,
} = milestonesApi;
