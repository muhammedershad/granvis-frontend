export interface KpiMetrics {
  totalRevenue: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  totalCancelled: number;
  avgPaymentAmount: number;
  collectionRate: number;
  paymentCount: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  collected: number;
  pending: number;
  count: number;
}

export interface MethodBreakdown {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface ClientAnalysis {
  clientId: string;
  clientName: string;
  companyName?: string;
  totalAmount: number;
  paidAmount: number;
  paymentCount: number;
  avgTicketSize: number;
  outstanding: number;
}

export interface ProjectAnalysis {
  projectId: string;
  projectName: string;
  type?: string;
  category?: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentCount: number;
}

export interface SubcategoryData {
  category: string;
  totalAmount: number;
  paidAmount: number;
  count: number;
}

export interface CategoryAnalysisData {
  type: string;
  subcategories: SubcategoryData[];
  totalAmount: number;
  paidAmount: number;
  count: number;
}

export interface AgingBucket {
  label: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export interface InsightsData {
  kpi: KpiMetrics;
  monthlyTrends: MonthlyTrend[];
  methodBreakdown: MethodBreakdown[];
  clientAnalysis: ClientAnalysis[];
  projectAnalysis: ProjectAnalysis[];
  categoryAnalysis: CategoryAnalysisData[];
  agingBuckets: AgingBucket[];
}
