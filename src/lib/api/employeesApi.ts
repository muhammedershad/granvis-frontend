import { apiSlice } from "./apiSlice";
import { Employee } from "@/types/employee";

// Extend the main API slice with employee endpoints
export const employeesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees with optional filters
    getEmployees: builder.query<
      Employee[],
      {
        department?: string;
        status?: string;
        type?: string;
        role?: string;
        search?: string;
      }
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
          }
        });
        return {
          url: `/employees?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Employee" as const, id })),
              { type: "Employee" as const, id: "LIST" },
            ]
          : [{ type: "Employee" as const, id: "LIST" }],
      keepUnusedDataFor: 300, // Cache for 5 minutes
    }),

    // Check if email is available
    checkEmailAvailability: builder.query<
      { available: boolean; message?: string },
      string
    >({
      query: (email) => ({
        url: `/employees/check-email?email=${encodeURIComponent(email)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Don't cache email checks
    }),

    // Check if phone is available
    checkPhoneAvailability: builder.query<
      { available: boolean; message?: string },
      string
    >({
      query: (phone) => ({
        url: `/employees/check-phone?phone=${encodeURIComponent(phone)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0, // Don't cache phone checks
    }),

    // Get potential managers (employees with manager or admin role)
    getManagers: builder.query<Employee[], void>({
      query: () => ({
        url: "/employees/managers",
        method: "GET",
      }),
      providesTags: [{ type: "Employee" as const, id: "MANAGERS" }],
      keepUnusedDataFor: 300,
    }),

    // Get a single employee by ID
    getEmployeeById: builder.query<Employee, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Employee" as const, id }],
      keepUnusedDataFor: 300,
    }),

    // Get employees by manager ID
    getEmployeesByManager: builder.query<Employee[], string>({
      query: (managerId) => ({
        url: `/employees/manager/${managerId}`,
        method: "GET",
      }),
      providesTags: (result, error, managerId) => [
        { type: "Employee" as const, id: `MANAGER_${managerId}` },
      ],
      keepUnusedDataFor: 300,
    }),

    // Create a new employee
    createEmployee: builder.mutation<
      Employee,
      Omit<Employee, "id" | "createdAt" | "updatedAt">
    >({
      query: (employee) => ({
        url: "/employees",
        method: "POST",
        body: employee,
      }),
      invalidatesTags: [
        { type: "Employee" as const, id: "LIST" },
        { type: "Employee" as const, id: "MANAGERS" },
      ],
    }),

    // Update an employee
    updateEmployee: builder.mutation<
      Employee,
      { id: string; data: Partial<Employee> }
    >({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employee" as const, id },
        { type: "Employee" as const, id: "LIST" },
        { type: "Employee" as const, id: "MANAGERS" },
      ],
    }),

    // Delete an employee
    deleteEmployee: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Employee" as const, id: "LIST" },
        { type: "Employee" as const, id: "MANAGERS" },
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetEmployeesQuery,
  useCheckEmailAvailabilityQuery,
  useCheckPhoneAvailabilityQuery,
  useGetManagersQuery,
  useGetEmployeeByIdQuery,
  useGetEmployeesByManagerQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
