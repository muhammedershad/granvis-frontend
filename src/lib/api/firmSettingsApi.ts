import { apiSlice } from "./apiSlice";
import {
  CreateFirmSettingsDto,
  FirmSettings,
  UpdateFirmSettingsDto,
} from "@/types/firm-settings";

export const firmSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all firm settings
    getFirmSettings: builder.query<FirmSettings[], void>({
      query: () => "/firm-settings",
      providesTags: (result) => [
        { type: "FirmSettings" as const, id: "LIST" },
        ...(result?.map(({ id }) => ({ type: "FirmSettings" as const, id })) ||
          []),
      ],
    }),

    // Get default firm settings
    getDefaultFirmSettings: builder.query<FirmSettings | null, void>({
      query: () => "/firm-settings/default",
      providesTags: [{ type: "FirmSettings" as const, id: "DEFAULT" }],
    }),

    // Get single firm settings
    getFirmSettingsById: builder.query<FirmSettings, string>({
      query: (id) => `/firm-settings/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "FirmSettings" as const, id },
      ],
    }),

    // Create firm settings
    createFirmSettings: builder.mutation<FirmSettings, CreateFirmSettingsDto>({
      query: (data) => ({
        url: "/firm-settings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "FirmSettings" as const, id: "LIST" },
        { type: "FirmSettings" as const, id: "DEFAULT" },
      ],
    }),

    // Update firm settings
    updateFirmSettings: builder.mutation<
      FirmSettings,
      { id: string; data: UpdateFirmSettingsDto }
    >({
      query: ({ id, data }) => ({
        url: `/firm-settings/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "FirmSettings" as const, id },
        { type: "FirmSettings" as const, id: "LIST" },
        { type: "FirmSettings" as const, id: "DEFAULT" },
      ],
    }),

    // Set as default
    setFirmSettingsAsDefault: builder.mutation<FirmSettings, string>({
      query: (id) => ({
        url: `/firm-settings/${id}/set-default`,
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "FirmSettings" as const, id: "LIST" },
        { type: "FirmSettings" as const, id: "DEFAULT" },
      ],
    }),

    // Delete firm settings
    deleteFirmSettings: builder.mutation<
      { deleted: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/firm-settings/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "FirmSettings" as const, id: "LIST" },
        { type: "FirmSettings" as const, id: "DEFAULT" },
      ],
    }),
  }),
});

export const {
  useGetFirmSettingsQuery,
  useGetDefaultFirmSettingsQuery,
  useGetFirmSettingsByIdQuery,
  useCreateFirmSettingsMutation,
  useUpdateFirmSettingsMutation,
  useSetFirmSettingsAsDefaultMutation,
  useDeleteFirmSettingsMutation,
} = firmSettingsApi;
