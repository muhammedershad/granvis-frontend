import { apiSlice } from "./apiSlice";
import {
  CreatePaymentTargetDto,
  PaymentTarget,
  PaymentTargetListResponse,
  PaymentTargetQueryParams,
  UpdatePaymentTargetDto,
} from "@/types/payment-target";

export const paymentTargetsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payment targets with filters
    getPaymentTargets: builder.query<
      PaymentTargetListResponse,
      PaymentTargetQueryParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) {
          searchParams.append("status", params.status);
        }
        if (params?.category) {
          searchParams.append("category", params.category);
        }
        if (params?.page) {
          searchParams.append("page", String(params.page));
        }
        if (params?.limit) {
          searchParams.append("limit", String(params.limit));
        }
        return `/payment-targets?${searchParams.toString()}`;
      },
      providesTags: (result) => [
        { type: "PaymentTarget" as const, id: "LIST" },
        ...(result?.data?.map(({ id }) => ({
          type: "PaymentTarget" as const,
          id,
        })) || []),
      ],
    }),

    // Get single payment target
    getPaymentTargetById: builder.query<PaymentTarget, string>({
      query: (id) => `/payment-targets/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "PaymentTarget" as const, id },
      ],
    }),

    // Create payment target
    createPaymentTarget: builder.mutation<
      PaymentTarget,
      CreatePaymentTargetDto
    >({
      query: (data) => ({
        url: "/payment-targets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PaymentTarget" as const, id: "LIST" }],
    }),

    // Update payment target
    updatePaymentTarget: builder.mutation<
      PaymentTarget,
      { id: string; data: UpdatePaymentTargetDto }
    >({
      query: ({ id, data }) => ({
        url: `/payment-targets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "PaymentTarget" as const, id },
        { type: "PaymentTarget" as const, id: "LIST" },
      ],
    }),

    // Delete payment target
    deletePaymentTarget: builder.mutation<
      { deleted: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/payment-targets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "PaymentTarget" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useGetPaymentTargetsQuery,
  useGetPaymentTargetByIdQuery,
  useCreatePaymentTargetMutation,
  useUpdatePaymentTargetMutation,
  useDeletePaymentTargetMutation,
} = paymentTargetsApi;
