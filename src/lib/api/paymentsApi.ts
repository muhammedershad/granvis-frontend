import { apiSlice } from "./apiSlice";
import {
  CreateInvoicePaymentDto,
  CreatePaymentDto,
  MarkPaymentPaidDto,
  Payment,
  PaymentListResponse,
  PaymentQueryParams,
  PdfGenerationResponse,
  ProjectPaymentSummary,
  UpdatePaymentDto,
} from "@/types/payment";

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payments with filters
    getPayments: builder.query<PaymentListResponse, PaymentQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.projectId) {
          searchParams.append("projectId", params.projectId);
        }
        if (params.milestoneId) {
          searchParams.append("milestoneId", params.milestoneId);
        }
        if (params.clientId) {
          searchParams.append("clientId", params.clientId);
        }
        if (params.status) {
          searchParams.append("status", params.status);
        }
        if (params.page) {
          searchParams.append("page", String(params.page));
        }
        if (params.limit) {
          searchParams.append("limit", String(params.limit));
        }

        return `/payments?${searchParams.toString()}`;
      },
      providesTags: (result) => [
        { type: "Payment" as const, id: "LIST" },
        ...(result?.data?.map(({ id }) => ({ type: "Payment" as const, id })) ||
          []),
      ],
    }),

    // Get payments by project
    getPaymentsByProject: builder.query<Payment[], string>({
      query: (projectId) => `/payments/project/${projectId}`,
      providesTags: (result, _error, projectId) => [
        { type: "Payment" as const, id: `PROJECT_${projectId}` },
        ...(result?.map(({ id }) => ({ type: "Payment" as const, id })) || []),
      ],
    }),

    // Get payments by milestone
    getPaymentsByMilestone: builder.query<Payment[], string>({
      query: (milestoneId) => `/payments/milestone/${milestoneId}`,
      providesTags: (result, _error, milestoneId) => [
        { type: "Payment" as const, id: `MILESTONE_${milestoneId}` },
        ...(result?.map(({ id }) => ({ type: "Payment" as const, id })) || []),
      ],
    }),

    // Get payments by invoice
    getPaymentsByInvoice: builder.query<Payment[], string>({
      query: (invoiceId) => `/payments/invoice/${invoiceId}`,
      providesTags: (result, _error, invoiceId) => [
        { type: "Payment" as const, id: `INVOICE_${invoiceId}` },
        ...(result?.map(({ id }) => ({ type: "Payment" as const, id })) || []),
      ],
    }),

    // Get project payment summary
    getProjectPaymentSummary: builder.query<ProjectPaymentSummary, string>({
      query: (projectId) => `/payments/project/${projectId}/summary`,
      providesTags: (_result, _error, projectId) => [
        { type: "Payment" as const, id: `PROJECT_${projectId}_SUMMARY` },
      ],
    }),

    // Get single payment
    getPaymentById: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Payment" as const, id }],
    }),

    // Create payment
    createPayment: builder.mutation<Payment, CreatePaymentDto>({
      query: (data) => ({
        url: "/payments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: "Payment" as const, id: "LIST" },
        { type: "Payment" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Payment" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Payment" as const, id: `MILESTONE_${result?.milestoneId}` },
        { type: "Milestone" as const, id: result?.milestoneId },
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Project" as const, id: result?.projectId },
      ],
    }),

    // Create payment against an invoice
    createInvoicePayment: builder.mutation<Payment, CreateInvoicePaymentDto>({
      query: (data) => ({
        url: "/payments/invoice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result) => [
        { type: "Payment" as const, id: "LIST" },
        { type: "Payment" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Payment" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Payment" as const, id: `INVOICE_${result?.invoiceId}` },
        { type: "Invoice" as const, id: result?.invoiceId },
        { type: "Invoice" as const, id: "LIST" },
        { type: "Invoice" as const, id: `PROJECT_${result?.projectId}` },
        { type: "Invoice" as const, id: `SUMMARY_${result?.projectId}` },
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Project" as const, id: result?.projectId },
      ],
    }),

    // Update payment
    updatePayment: builder.mutation<
      Payment,
      { id: string; data: UpdatePaymentDto }
    >({
      query: ({ id, data }) => ({
        url: `/payments/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Payment" as const, id },
        { type: "Payment" as const, id: "LIST" },
        { type: "Payment" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Payment" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Payment" as const, id: `MILESTONE_${result?.milestoneId}` },
        { type: "Milestone" as const, id: result?.milestoneId },
      ],
    }),

    // Mark payment as paid
    markPaymentPaid: builder.mutation<
      Payment,
      { id: string; data: MarkPaymentPaidDto }
    >({
      query: ({ id, data }) => ({
        url: `/payments/${id}/mark-paid`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Payment" as const, id },
        { type: "Payment" as const, id: "LIST" },
        { type: "Payment" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Payment" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
        { type: "Payment" as const, id: `MILESTONE_${result?.milestoneId}` },
        { type: "Milestone" as const, id: result?.milestoneId },
        { type: "Milestone" as const, id: `PROJECT_${result?.projectId}` },
        {
          type: "Milestone" as const,
          id: `PROJECT_${result?.projectId}_SUMMARY`,
        },
      ],
    }),

    // Delete payment
    deletePayment: builder.mutation<
      { deleted: boolean; message: string },
      { id: string; projectId: string; milestoneId: string }
    >({
      query: ({ id }) => ({
        url: `/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { projectId, milestoneId }) => [
        { type: "Payment" as const, id: "LIST" },
        { type: "Payment" as const, id: `PROJECT_${projectId}` },
        { type: "Payment" as const, id: `PROJECT_${projectId}_SUMMARY` },
        { type: "Payment" as const, id: `MILESTONE_${milestoneId}` },
        { type: "Milestone" as const, id: milestoneId },
        { type: "Milestone" as const, id: `PROJECT_${projectId}` },
        { type: "Milestone" as const, id: `PROJECT_${projectId}_SUMMARY` },
      ],
    }),

    // Generate payment PDF
    generatePaymentPdf: builder.mutation<PdfGenerationResponse, string>({
      query: (paymentId) => ({
        url: `/pdf/payment/${paymentId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Payment" as const, id },
      ],
    }),

    // Generate project PDF
    generateProjectPdf: builder.mutation<PdfGenerationResponse, string>({
      query: (projectId) => ({
        url: `/pdf/project/${projectId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentsByProjectQuery,
  useGetPaymentsByMilestoneQuery,
  useGetPaymentsByInvoiceQuery,
  useGetProjectPaymentSummaryQuery,
  useGetPaymentByIdQuery,
  useCreatePaymentMutation,
  useCreateInvoicePaymentMutation,
  useUpdatePaymentMutation,
  useMarkPaymentPaidMutation,
  useDeletePaymentMutation,
  useGeneratePaymentPdfMutation,
  useGenerateProjectPdfMutation,
} = paymentsApi;
