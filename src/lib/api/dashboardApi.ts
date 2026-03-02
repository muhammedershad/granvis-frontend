import { apiSlice } from "./apiSlice";
import type {
  AccountantDashboardData,
  AdminDashboardData,
  DashboardQueryParams,
  EmployeeDashboardData,
  ManagerDashboardData,
} from "@/types/dashboard";

const buildQueryString = (params?: DashboardQueryParams | void): string => {
  if (!params) {
    return "";
  }
  const searchParams = new URLSearchParams();
  if (params.startDate) {
    searchParams.append("startDate", params.startDate);
  }
  if (params.endDate) {
    searchParams.append("endDate", params.endDate);
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminDashboard: builder.query<
      AdminDashboardData,
      DashboardQueryParams | void
    >({
      query: (params) => `/dashboard/super-admin${buildQueryString(params)}`,
      providesTags: [
        { type: "Project" as const, id: "STATS" },
        { type: "Client" as const, id: "STATS" },
        { type: "Employee" as const, id: "STATS" },
        { type: "Invoice" as const, id: "GLOBAL_SUMMARY" },
        { type: "Payment" as const, id: "INSIGHTS" },
        { type: "Notification" as const, id: "STATS" },
      ],
      keepUnusedDataFor: 120,
    }),

    getAdminDashboard: builder.query<
      AdminDashboardData,
      DashboardQueryParams | void
    >({
      query: (params) => `/dashboard/admin${buildQueryString(params)}`,
      providesTags: [
        { type: "Project" as const, id: "STATS" },
        { type: "Client" as const, id: "STATS" },
        { type: "Employee" as const, id: "STATS" },
        { type: "Invoice" as const, id: "GLOBAL_SUMMARY" },
        { type: "Payment" as const, id: "INSIGHTS" },
        { type: "Notification" as const, id: "STATS" },
      ],
      keepUnusedDataFor: 120,
    }),

    getManagerDashboard: builder.query<
      ManagerDashboardData,
      DashboardQueryParams | void
    >({
      query: (params) => `/dashboard/manager${buildQueryString(params)}`,
      providesTags: [
        { type: "Project" as const, id: "STATS" },
        { type: "Notification" as const, id: "STATS" },
      ],
      keepUnusedDataFor: 120,
    }),

    getAccountantDashboard: builder.query<
      AccountantDashboardData,
      DashboardQueryParams | void
    >({
      query: (params) => `/dashboard/accountant${buildQueryString(params)}`,
      providesTags: [
        { type: "Invoice" as const, id: "GLOBAL_SUMMARY" },
        { type: "Payment" as const, id: "INSIGHTS" },
        { type: "Project" as const, id: "STATS" },
      ],
      keepUnusedDataFor: 120,
    }),

    getEmployeeDashboard: builder.query<
      EmployeeDashboardData,
      DashboardQueryParams | void
    >({
      query: (params) => `/dashboard/employee${buildQueryString(params)}`,
      providesTags: [
        { type: "Project" as const, id: "STATS" },
        { type: "Notification" as const, id: "STATS" },
      ],
      keepUnusedDataFor: 120,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSuperAdminDashboardQuery,
  useGetAdminDashboardQuery,
  useGetManagerDashboardQuery,
  useGetAccountantDashboardQuery,
  useGetEmployeeDashboardQuery,
} = dashboardApi;
