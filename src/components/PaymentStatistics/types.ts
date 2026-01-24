export interface KPIData {
  totalRevenue: MetricData;
  averageInvoiceValue: MetricData;
  paymentCycleTime: MetricData;
  collectionRate: MetricData;
  overdueRate: MetricData;
  disputeRate: MetricData;
}

export interface MetricData {
  current: number;
  previous: number;
  change: number;
  trend: "up" | "down";
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  invoices: number;
  avgValue: number;
  cycleTime: number;
  collectionRate: number;
}

export interface ProjectTypePerformance {
  type: string;
  revenue: number;
  invoices: number;
  avgCycle: number;
  collectionRate: number;
}

export interface PaymentTiming {
  period: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ClientSegment {
  segment: string;
  revenue: number;
  avgInvoice: number;
  count: number;
  cycleTime: number;
}

export interface SeasonalTrend {
  quarter: string;
  revenue: number;
  invoices: number;
  disputes: number;
  satisfaction: number;
}

export interface CollectionEfficiency {
  name: string;
  value: number;
  color: string;
}
