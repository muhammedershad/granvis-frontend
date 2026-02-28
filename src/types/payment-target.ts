export enum TargetCategory {
  QUARTERLY = "quarterly",
  MONTHLY = "monthly",
  ANNUAL = "annual",
  RECEIVABLES = "receivables",
}

export enum TargetStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  EXPIRED = "expired",
}

export interface PaymentTarget {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  deadline: string;
  category: TargetCategory;
  status: TargetStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentTargetDto {
  title: string;
  targetAmount: number;
  startDate: string;
  deadline: string;
  category: TargetCategory;
  createdBy: string;
  createdById?: string;
}

export interface UpdatePaymentTargetDto {
  title?: string;
  targetAmount?: number;
  startDate?: string;
  deadline?: string;
  category?: TargetCategory;
  status?: TargetStatus;
}

export interface PaymentTargetListResponse {
  data: PaymentTarget[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentTargetQueryParams {
  status?: TargetStatus;
  category?: TargetCategory;
  page?: number;
  limit?: number;
}
