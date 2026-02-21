// Payment Enums
export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CHEQUE = "cheque",
  UPI = "upi",
  NEFT = "neft",
  RTGS = "rtgs",
  OTHER = "other",
}

// Main Payment Interface
export interface Payment {
  id: string;
  projectId: string;
  milestoneId?: string;
  invoiceId?: string;
  clientId: string;

  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;

  // Dates
  invoiceDate: string;
  dueDate?: string;
  paidDate?: string;

  // Invoice Details
  invoiceNumber?: string;
  description?: string;
  notes?: string;
  transactionReference?: string;

  // PDF Generation
  pdfKey?: string;
  pdfUrl?: string;
  pdfGeneratedAt?: string;

  // Firm settings used
  firmSettingsId?: string;

  // Populated relations (when fetched with relations)
  project?: {
    id: string;
    name: string;
    client?: string;
    location?: {
      city: string;
      state: string;
    };
    builtUpArea?: number;
  };
  milestone?: {
    id: string;
    title: string;
    stageNumber: number;
    totalAmount?: number;
    paidAmount?: number;
  };
  client?: {
    id: string;
    name: string;
    companyName?: string;
    email?: string;
    phone?: string;
  };

  // System fields
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API calls
export interface CreateInvoicePaymentDto {
  invoiceId: string;
  amount: number;
  paymentDate: string;
  method?: PaymentMethod;
  transactionReference?: string;
  notes?: string;
  createdBy: string;
  createdById?: string;
}

export interface CreatePaymentDto {
  projectId: string;
  milestoneId?: string;
  invoiceId?: string;
  clientId: string;
  amount: number;
  currency?: string;
  status?: PaymentStatus;
  method?: PaymentMethod;
  invoiceDate: string;
  dueDate?: string;
  paidDate?: string;
  description?: string;
  notes?: string;
  transactionReference?: string;
  firmSettingsId?: string;
  createdBy: string;
  createdById?: string;
}

export interface UpdatePaymentDto {
  amount?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  invoiceDate?: string;
  dueDate?: string;
  paidDate?: string;
  description?: string;
  notes?: string;
  transactionReference?: string;
}

export interface MarkPaymentPaidDto {
  paidDate: string;
  method?: PaymentMethod;
  transactionReference?: string;
}

// Payment List Response
export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Payment Query Parameters
export interface PaymentQueryParams {
  projectId?: string;
  milestoneId?: string;
  clientId?: string;
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}

// Project Payment Summary
export interface ProjectPaymentSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentCount: number;
  paidCount: number;
  pendingCount: number;
}

// PDF Generation Response
export interface PdfGenerationResponse {
  pdfKey: string;
  pdfUrl: string;
}
