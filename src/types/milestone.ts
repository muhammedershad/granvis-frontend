// Milestone Enums
export enum MilestoneStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum MilestonePaymentStatus {
  UNPAID = 'unpaid',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
}

export enum RateType {
  PER_SQFT = 'per_sqft',
  FIXED = 'fixed',
}

// Scope of Work Item
export interface ScopeOfWorkItem {
  id: string;
  description: string;
  rateType: RateType;
  rate: number;
  quantity: number;
  amount: number;
}

// Additional Charge
export interface AdditionalCharge {
  id: string;
  description: string;
  ratePerUnit: number;
  quantity: number;
  amount: number;
}

// Main Milestone Interface
export interface Milestone {
  id: string;
  projectId: string;
  stageNumber: number;
  title: string;
  description?: string;

  // Scope of Work
  scopeOfWork: ScopeOfWorkItem[];
  additionalCharges: AdditionalCharge[];

  // Built-up Area Configuration
  useProjectBuiltUpArea: boolean;
  customBuiltUpArea?: number;

  // Calculated Amounts
  scopeAmount: number;
  additionalChargesAmount: number;
  totalAmount: number;

  // Payment Tracking
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: MilestonePaymentStatus;
  lastPaymentDate?: string;

  // Progress & Status
  status: MilestoneStatus;
  progressPercentage: number;

  // Dates
  startDate?: string;
  dueDate?: string;
  completedDate?: string;

  // Order for sorting
  order: number;

  // System fields
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs for API calls
export interface CreateScopeOfWorkItemDto {
  id?: string;
  description: string;
  rateType: RateType;
  rate: number;
  quantity?: number;
  amount?: number;
}

export interface CreateAdditionalChargeDto {
  id?: string;
  description: string;
  ratePerUnit: number;
  quantity?: number;
  amount?: number;
}

export interface CreateMilestoneDto {
  projectId: string;
  stageNumber: number;
  title: string;
  description?: string;
  scopeOfWork?: CreateScopeOfWorkItemDto[];
  additionalCharges?: CreateAdditionalChargeDto[];
  useProjectBuiltUpArea?: boolean;
  customBuiltUpArea?: number;
  progressPercentage?: number;
  startDate?: string;
  dueDate?: string;
  createdBy: string;
  createdById?: string;
}

export interface UpdateMilestoneDto {
  stageNumber?: number;
  title?: string;
  description?: string;
  scopeOfWork?: CreateScopeOfWorkItemDto[];
  additionalCharges?: CreateAdditionalChargeDto[];
  useProjectBuiltUpArea?: boolean;
  customBuiltUpArea?: number;
  progressPercentage?: number;
  status?: MilestoneStatus;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
}

export interface UpdateMilestoneProgressDto {
  progressPercentage: number;
}

export interface UpdateMilestoneStatusDto {
  status: MilestoneStatus;
}

export interface ReorderMilestonesDto {
  milestoneIds: string[];
}

// Project Progress Summary
export interface ProjectProgressSummary {
  projectProgress: number;
  milestoneCount: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}
