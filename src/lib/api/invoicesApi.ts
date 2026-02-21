import { apiSlice } from "./apiSlice";

// Invoice Status Enum
export enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

// Invoice Milestone Item Interface
export interface InvoiceMilestoneItem {
  milestoneId: string;
  milestoneTitle: string;
  milestoneStageNumber: number;
  rateType: "per_sqft" | "per_visit" | "fixed";
  rate: number;
  quantity: number;
  calculatedAmount: number;
  editableAmount: number;
}

// Invoice Interface
export interface Invoice {
  id: string;
  projectId: string;
  clientId: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  milestoneItems: InvoiceMilestoneItem[];
  subtotal: number;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountAmount: number;
  netTotal: number;
  paidAmount: number;
  balance: number;
  currency: string;
  status: InvoiceStatus;
  notes?: string;
  defaultNotes: string[];
  pdfKey?: string;
  pdfUrl?: string;
  pdfGeneratedAt?: string;
  firmSettingsId?: string;
  createdBy: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  // Populated fields
  project?: {
    id: string;
    name: string;
    location?: {
      city: string;
      state: string;
    };
    builtUpArea?: number;
    client: string;
  };
  client?: {
    id: string;
    name: string;
    companyName?: string;
    phone?: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  firmSettings?: {
    id: string;
    name: string;
    logo?: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    defaultNotes: string[];
  };
}

// Create Invoice DTO
export interface CreateInvoiceDto {
  projectId: string;
  clientId: string;
  invoiceDate: string;
  dueDate?: string;
  milestoneItems: InvoiceMilestoneItem[];
  subtotal: number;
  discountType?: "percentage" | "flat";
  discountValue?: number;
  discountAmount?: number;
  netTotal: number;
  paidAmount?: number;
  notes?: string;
  defaultNotes?: string[];
  status?: "draft" | "sent";
  firmSettingsId?: string;
  createdBy: string;
  createdById?: string;
}

// Update Invoice DTO
export interface UpdateInvoiceDto {
  invoiceDate?: string;
  dueDate?: string;
  milestoneItems?: InvoiceMilestoneItem[];
  subtotal?: number;
  discountType?: "percentage" | "flat";
  discountValue?: number;
  discountAmount?: number;
  netTotal?: number;
  paidAmount?: number;
  notes?: string;
  defaultNotes?: string[];
  status?: InvoiceStatus;
  firmSettingsId?: string;
}

// Mark Invoice Paid DTO
export interface MarkInvoicePaidDto {
  paidAmount: number;
  paidDate?: string;
  transactionReference?: string;
  paymentMethod?:
    | "cash"
    | "bank_transfer"
    | "cheque"
    | "upi"
    | "neft"
    | "rtgs"
    | "other";
}

// Invoice Query DTO
export interface InvoiceQueryDto {
  projectId?: string;
  clientId?: string;
  status?: InvoiceStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Invoice Summary Interface
export interface InvoiceSummary {
  totalInvoices: number;
  draftCount: number;
  sentCount: number;
  paidCount: number;
  partiallyPaidCount: number;
  overdueCount: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  percentageCompleted: number;
}

// Paginated Response Interface
export interface PaginatedInvoicesResponse {
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const invoicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all invoices with filters and pagination
    getInvoices: builder.query<PaginatedInvoicesResponse, InvoiceQueryDto>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
          }
        });
        return {
          url: `/invoices?${searchParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({
                type: "Invoice" as const,
                id,
              })),
              { type: "Invoice" as const, id: "LIST" },
            ]
          : [{ type: "Invoice" as const, id: "LIST" }],
    }),

    // Get invoices by project
    getInvoicesByProject: builder.query<Invoice[], string>({
      query: (projectId) => ({
        url: `/invoices/project/${projectId}`,
        method: "GET",
      }),
      providesTags: (result, _error, projectId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Invoice" as const, id })),
              { type: "Invoice" as const, id: `PROJECT_${projectId}` },
            ]
          : [{ type: "Invoice" as const, id: `PROJECT_${projectId}` }],
    }),

    // Get invoice by ID
    getInvoiceById: builder.query<Invoice, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Invoice" as const, id }],
    }),

    // Get project invoice summary
    getInvoiceSummary: builder.query<InvoiceSummary, string>({
      query: (projectId) => ({
        url: `/invoices/project/${projectId}/summary`,
        method: "GET",
      }),
      providesTags: (_result, _error, projectId) => [
        { type: "Invoice" as const, id: `SUMMARY_${projectId}` },
      ],
    }),

    // Generate invoice number
    generateInvoiceNumber: builder.query<
      { invoiceNumber: string },
      string | undefined
    >({
      query: (firmSettingsId) => ({
        url: `/invoices/generate-number${firmSettingsId ? `?firmSettingsId=${firmSettingsId}` : ""}`,
        method: "GET",
      }),
    }),

    // Create invoice
    createInvoice: builder.mutation<Invoice, CreateInvoiceDto>({
      query: (data) => ({
        url: "/invoices",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { projectId }) => [
        { type: "Invoice" as const, id: "LIST" },
        { type: "Invoice" as const, id: `PROJECT_${projectId}` },
        { type: "Invoice" as const, id: `SUMMARY_${projectId}` },
      ],
    }),

    // Update invoice
    updateInvoice: builder.mutation<
      Invoice,
      { id: string; data: UpdateInvoiceDto }
    >({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Invoice" as const, id },
        { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `PROJECT_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `SUMMARY_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
      ],
    }),

    // Mark invoice as sent
    markInvoiceAsSent: builder.mutation<Invoice, string>({
      query: (id) => ({
        url: `/invoices/${id}/send`,
        method: "PATCH",
      }),
      invalidatesTags: (result, _error, id) => [
        { type: "Invoice" as const, id },
        { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `PROJECT_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `SUMMARY_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
      ],
    }),

    // Record payment on invoice
    recordInvoicePayment: builder.mutation<
      Invoice,
      { id: string; data: MarkInvoicePaidDto }
    >({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/record-payment`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, _error, { id }) => [
        { type: "Invoice" as const, id },
        { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `PROJECT_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `SUMMARY_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
        { type: "Milestone" as const, id: "LIST" },
      ],
    }),

    // Cancel invoice
    cancelInvoice: builder.mutation<Invoice, string>({
      query: (id) => ({
        url: `/invoices/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (result, _error, id) => [
        { type: "Invoice" as const, id },
        { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `PROJECT_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
        result
          ? { type: "Invoice" as const, id: `SUMMARY_${result.projectId}` }
          : { type: "Invoice" as const, id: "LIST" },
      ],
    }),

    // Delete invoice
    deleteInvoice: builder.mutation<
      { deleted: boolean; message: string },
      { id: string; projectId: string }
    >({
      query: ({ id }) => ({
        url: `/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id, projectId }) => [
        { type: "Invoice" as const, id },
        { type: "Invoice" as const, id: "LIST" },
        { type: "Invoice" as const, id: `PROJECT_${projectId}` },
        { type: "Invoice" as const, id: `SUMMARY_${projectId}` },
      ],
    }),

    // Generate invoice PDF
    generateInvoicePdf: builder.mutation<
      { pdfKey: string; pdfUrl: string; pdfBase64: string },
      string
    >({
      query: (invoiceId) => ({
        url: `/pdf/invoice/${invoiceId}`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInvoicesQuery,
  useGetInvoicesByProjectQuery,
  useGetInvoiceByIdQuery,
  useGetInvoiceSummaryQuery,
  useGenerateInvoiceNumberQuery,
  useLazyGenerateInvoiceNumberQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useMarkInvoiceAsSentMutation,
  useRecordInvoicePaymentMutation,
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
  useGenerateInvoicePdfMutation,
} = invoicesApi;
