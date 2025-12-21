import { apiSlice } from './apiSlice';
import { Client } from '@/types/client';

// Extend the main API slice with client endpoints
export const clientsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all clients with optional filters and pagination
    getClients: builder.query<{
      data: Client[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }, {
      status?: string;
      priority?: string;
      industry?: string;
      search?: string;
      companyType?: string;
      source?: string;
      page?: number;
      limit?: number;
    }>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
        return {
          url: `/clients?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client' as const, id: 'LIST' },
            ]
          : [{ type: 'Client' as const, id: 'LIST' }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Get a single client by ID
    getClientById: builder.query<Client, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Client' as const, id }],
      keepUnusedDataFor: 300,
    }),

    // Get client statistics
    getClientStatistics: builder.query<{
      totalClients: number;
      activeClients: number;
      inactiveClients: number;
      potentialClients: number;
      formerClients: number;
      vipClients: number;
      totalValue: number;
      avgValue: number;
      totalProjects: number;
      activeProjects: number;
      completedProjects: number;
      byIndustry: Record<string, number>;
      byStatus: Record<string, number>;
      byPriority: Record<string, number>;
    }, void>({
      query: () => ({
        url: '/clients/statistics',
        method: 'GET',
      }),
      providesTags: [{ type: 'Client' as const, id: 'STATS' }],
      keepUnusedDataFor: 120, // Cache for 2 minutes
    }),

    // Search clients
    searchClients: builder.query<Client[], string>({
      query: (query) => ({
        url: `/clients/search/${query}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Client' as const, id: 'SEARCH' }],
      keepUnusedDataFor: 180, // Cache for 3 minutes
    }),

    // Create a new client
    createClient: builder.mutation<Client, Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (client) => ({
        url: '/clients',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: [
        { type: 'Client' as const, id: 'LIST' },
        { type: 'Client' as const, id: 'STATS' },
      ],
    }),

    // Update an existing client
    updateClient: builder.mutation<Client, { id: string; data: Partial<Client> }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Client' as const, id },
        { type: 'Client' as const, id: 'LIST' },
        { type: 'Client' as const, id: 'STATS' },
      ],
    }),

    // Delete a client
    deleteClient: builder.mutation<{ deleted: boolean; message: string }, string>({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Client' as const, id },
        { type: 'Client' as const, id: 'LIST' },
        { type: 'Client' as const, id: 'STATS' },
      ],
    }),

    // Bulk delete clients
    bulkDeleteClients: builder.mutation<{ deletedCount: number }, string[]>({
      query: (ids) => ({
        url: '/clients/bulk-delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: [
        { type: 'Client' as const, id: 'LIST' },
        { type: 'Client' as const, id: 'STATS' },
      ],
    }),

    // Update project counts for a client
    updateClientProjectCounts: builder.mutation<
      Client,
      {
        id: string;
        projectCounts: {
          totalProjects?: number;
          activeProjects?: number;
          completedProjects?: number;
          projectsCount?: number;
          totalProjectValue?: number;
        };
      }
    >({
      query: ({ id, projectCounts }) => ({
        url: `/clients/${id}/projects`,
        method: 'PATCH',
        body: projectCounts,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Client' as const, id },
        { type: 'Client' as const, id: 'LIST' },
        { type: 'Client' as const, id: 'STATS' },
      ],
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useGetClientStatisticsQuery,
  useSearchClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useBulkDeleteClientsMutation,
  useUpdateClientProjectCountsMutation,
} = clientsApi;
