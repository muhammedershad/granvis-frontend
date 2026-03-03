import { apiSlice } from "./apiSlice";

export interface UserProfile {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  phone?: string;
  avatar?: string;
  avatarKey?: string;
  profileImage?: string;
  gender?: string;
  dateOfBirth?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string;
  employeeId?: string;
  employeeNumber?: number;
  position?: string;
  department?: string;
  hireDate?: string;
  joinDate?: string;
  employmentStatus?: string;
  employmentType?: string;
  salary?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills?: string[];
  experience?: number;
  education?: {
    degree: string;
    university: string;
    dateOfPassing: string;
  };
  certifications?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  avatarKey?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's full profile
    getMyProfile: builder.query<{ user: UserProfile }, void>({
      query: () => "/users/me",
      providesTags: [{ type: "Profile" as const, id: "ME" }],
      keepUnusedDataFor: 300,
    }),

    // Update current user's profile
    updateMyProfile: builder.mutation<
      { message: string; user: UserProfile },
      UpdateProfileDto
    >({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Profile" as const, id: "ME" }, "User"],
    }),

    // Change current user's password
    changeMyPassword: builder.mutation<{ message: string }, ChangePasswordDto>({
      query: (data) => ({
        url: "/users/me/password",
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useChangeMyPasswordMutation,
} = profileApi;
