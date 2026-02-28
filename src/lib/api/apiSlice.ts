import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Post",
    "Profile",
    "Notification",
    "Client",
    "Project",
    "Employee",
    "Milestone",
    "Payment",
    "PaymentTarget",
    "FirmSettings",
    "Invoice",
  ],
  // Configure caching behavior
  keepUnusedDataFor: 60, // Keep unused data for 60 seconds
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: true, // Refetch when window regains focus
  refetchOnReconnect: true, // Refetch when network reconnects
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Invalidate user data on successful login
      invalidatesTags: ["User", "Profile"],
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Clear all cached data on logout
      invalidatesTags: ["User", "Post", "Profile", "Notification"],
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),
      providesTags: ["User"],
      // Keep this data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get user profile with caching
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `/user/${userId}/profile`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Profile", id: userId },
      ],
      keepUnusedDataFor: 120, // Cache for 2 minutes
    }),

    // Update user profile
    updateUserProfile: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/user/${userId}/profile`,
        method: "PUT",
        body: data,
      }),
      // Invalidate specific user's profile
      invalidatesTags: (result, error, { userId }) => [
        { type: "Profile", id: userId },
        "User",
      ],
    }),

    // Forgot password - sends OTP to email
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password - verifies OTP and sets new password in one call
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = apiSlice;
