import { apiSlice } from "./apiSlice";
import { Notification, NotificationStats } from "@/types/notification";

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  priority?: string;
  read?: string;
  search?: string;
}

export interface PaginatedNotificationsResponse {
  data: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      PaginatedNotificationsResponse,
      NotificationQueryParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (
              value !== undefined &&
              value !== null &&
              value !== "" &&
              value !== "all"
            ) {
              searchParams.append(key, String(value));
            }
          });
        }
        return `/notifications?${searchParams.toString()}`;
      },
      providesTags: (result) => [
        { type: "Notification" as const, id: "LIST" },
        ...(result?.data?.map(({ id }) => ({
          type: "Notification" as const,
          id,
        })) || []),
      ],
    }),

    getNotificationStats: builder.query<NotificationStats, void>({
      query: () => "/notifications/stats",
      providesTags: [{ type: "Notification" as const, id: "STATS" }],
    }),

    markNotificationRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification" as const, id },
        { type: "Notification" as const, id: "LIST" },
        { type: "Notification" as const, id: "STATS" },
      ],
    }),

    markAllNotificationsRead: builder.mutation<
      { modifiedCount: number },
      void
    >({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification" as const, id: "LIST" },
        { type: "Notification" as const, id: "STATS" },
      ],
    }),

    deleteNotification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Notification" as const, id: "LIST" },
        { type: "Notification" as const, id: "STATS" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNotificationsQuery,
  useGetNotificationStatsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
