import { differenceInDays, format } from "date-fns";
import { Payment, PaymentStatus } from "@/types/payment";
import type {
  AgingBucket,
  CategoryAnalysisData,
  ClientAnalysis,
  InsightsData,
  KpiMetrics,
  MethodBreakdown,
  MonthlyTrend,
  ProjectAnalysis,
} from "./types";

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  upi: "UPI",
  neft: "NEFT",
  rtgs: "RTGS",
  other: "Other",
};

export function computeInsights(payments: Payment[]): InsightsData {
  return {
    kpi: computeKpi(payments),
    monthlyTrends: computeMonthlyTrends(payments),
    methodBreakdown: computeMethodBreakdown(payments),
    clientAnalysis: computeClientAnalysis(payments),
    projectAnalysis: computeProjectAnalysis(payments),
    categoryAnalysis: computeCategoryAnalysis(payments),
    agingBuckets: computeAgingBuckets(payments),
  };
}

function computeKpi(payments: Payment[]): KpiMetrics {
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const paid = payments.filter((p) => p.status === PaymentStatus.PAID);
  const pending = payments.filter((p) => p.status === PaymentStatus.PENDING);
  const overdue = payments.filter((p) => p.status === PaymentStatus.OVERDUE);
  const cancelled = payments.filter(
    (p) => p.status === PaymentStatus.CANCELLED
  );

  const totalCollected = paid.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = overdue.reduce((sum, p) => sum + p.amount, 0);
  const totalCancelled = cancelled.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalRevenue,
    totalCollected,
    totalPending,
    totalOverdue,
    totalCancelled,
    avgPaymentAmount: payments.length > 0 ? totalRevenue / payments.length : 0,
    collectionRate:
      totalRevenue > 0 ? (totalCollected / totalRevenue) * 100 : 0,
    paymentCount: payments.length,
  };
}

function computeMonthlyTrends(payments: Payment[]): MonthlyTrend[] {
  const monthMap = new Map<
    string,
    { revenue: number; collected: number; pending: number; count: number }
  >();

  for (const p of payments) {
    const monthKey = format(new Date(p.invoiceDate), "MMM yyyy");
    const existing = monthMap.get(monthKey) || {
      revenue: 0,
      collected: 0,
      pending: 0,
      count: 0,
    };

    existing.revenue += p.amount;
    existing.count += 1;
    if (p.status === PaymentStatus.PAID) {
      existing.collected += p.amount;
    } else if (
      p.status === PaymentStatus.PENDING ||
      p.status === PaymentStatus.OVERDUE
    ) {
      existing.pending += p.amount;
    }

    monthMap.set(monthKey, existing);
  }

  // Sort by date
  const sortedEntries = [...monthMap.entries()].sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );

  return sortedEntries.map(([month, data]) => ({
    month,
    ...data,
  }));
}

function computeMethodBreakdown(payments: Payment[]): MethodBreakdown[] {
  const methodMap = new Map<string, { count: number; amount: number }>();

  for (const p of payments) {
    const method = p.method || "other";
    const existing = methodMap.get(method) || { count: 0, amount: 0 };
    existing.count += 1;
    existing.amount += p.amount;
    methodMap.set(method, existing);
  }

  const total = payments.length || 1;
  return [...methodMap.entries()]
    .map(([method, data]) => ({
      method: METHOD_LABELS[method] || method,
      count: data.count,
      amount: data.amount,
      percentage: parseFloat(((data.count / total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.amount - a.amount);
}

function computeClientAnalysis(payments: Payment[]): ClientAnalysis[] {
  const clientMap = new Map<
    string,
    {
      clientName: string;
      companyName?: string;
      totalAmount: number;
      paidAmount: number;
      paymentCount: number;
    }
  >();

  for (const p of payments) {
    const { clientId } = p;
    const existing = clientMap.get(clientId) || {
      clientName: p.client?.name || "Unknown",
      companyName: p.client?.companyName,
      totalAmount: 0,
      paidAmount: 0,
      paymentCount: 0,
    };

    existing.totalAmount += p.amount;
    existing.paymentCount += 1;
    if (p.status === PaymentStatus.PAID) {
      existing.paidAmount += p.amount;
    }

    clientMap.set(clientId, existing);
  }

  return [...clientMap.entries()]
    .map(([clientId, data]) => ({
      clientId,
      clientName: data.clientName,
      companyName: data.companyName,
      totalAmount: data.totalAmount,
      paidAmount: data.paidAmount,
      paymentCount: data.paymentCount,
      avgTicketSize:
        data.paymentCount > 0 ? data.totalAmount / data.paymentCount : 0,
      outstanding: data.totalAmount - data.paidAmount,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

function computeProjectAnalysis(payments: Payment[]): ProjectAnalysis[] {
  const projectMap = new Map<
    string,
    {
      projectName: string;
      type?: string;
      category?: string;
      totalAmount: number;
      paidAmount: number;
      pendingAmount: number;
      paymentCount: number;
    }
  >();

  for (const p of payments) {
    const { projectId } = p;
    const existing = projectMap.get(projectId) || {
      projectName: p.project?.name || "Unknown",
      type: p.project?.type,
      category: p.project?.category,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      paymentCount: 0,
    };

    existing.totalAmount += p.amount;
    existing.paymentCount += 1;
    if (p.status === PaymentStatus.PAID) {
      existing.paidAmount += p.amount;
    } else if (
      p.status === PaymentStatus.PENDING ||
      p.status === PaymentStatus.OVERDUE
    ) {
      existing.pendingAmount += p.amount;
    }

    projectMap.set(projectId, existing);
  }

  return [...projectMap.entries()]
    .map(([projectId, data]) => ({
      projectId,
      ...data,
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

function computeCategoryAnalysis(payments: Payment[]): CategoryAnalysisData[] {
  const typeMap = new Map<
    string,
    Map<string, { totalAmount: number; paidAmount: number; count: number }>
  >();

  for (const p of payments) {
    const type = p.project?.type || "Uncategorized";
    const category = p.project?.category || "General";

    let subcatMap = typeMap.get(type);
    if (!subcatMap) {
      subcatMap = new Map();
      typeMap.set(type, subcatMap);
    }

    const existing = subcatMap.get(category) || {
      totalAmount: 0,
      paidAmount: 0,
      count: 0,
    };
    existing.totalAmount += p.amount;
    existing.count += 1;
    if (p.status === PaymentStatus.PAID) {
      existing.paidAmount += p.amount;
    }
    subcatMap.set(category, existing);
  }

  return [...typeMap.entries()]
    .map(([type, subcatMap]) => {
      const subcategories = [...subcatMap.entries()]
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.totalAmount - a.totalAmount);

      return {
        type,
        subcategories,
        totalAmount: subcategories.reduce((s, c) => s + c.totalAmount, 0),
        paidAmount: subcategories.reduce((s, c) => s + c.paidAmount, 0),
        count: subcategories.reduce((s, c) => s + c.count, 0),
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

function computeAgingBuckets(payments: Payment[]): AgingBucket[] {
  const now = new Date();
  const buckets = [
    { label: "Current (0-30 days)", min: 0, max: 30, color: "#10b981" },
    { label: "31-60 days", min: 31, max: 60, color: "#f59e0b" },
    { label: "61-90 days", min: 61, max: 90, color: "#f97316" },
    { label: "90+ days (Critical)", min: 91, max: Infinity, color: "#ef4444" },
  ];

  const bucketData = buckets.map((b) => ({
    ...b,
    amount: 0,
    count: 0,
    percentage: 0,
  }));

  const outstanding = payments.filter(
    (p) =>
      p.status === PaymentStatus.PENDING || p.status === PaymentStatus.OVERDUE
  );

  for (const p of outstanding) {
    const referenceDate = p.dueDate
      ? new Date(p.dueDate)
      : new Date(p.invoiceDate);
    const daysOld = Math.max(0, differenceInDays(now, referenceDate));

    for (const bucket of bucketData) {
      if (daysOld >= bucket.min && daysOld <= bucket.max) {
        bucket.amount += p.amount;
        bucket.count += 1;
        break;
      }
    }
  }

  const totalOutstanding = bucketData.reduce((s, b) => s + b.amount, 0) || 1;
  for (const bucket of bucketData) {
    bucket.percentage = parseFloat(
      ((bucket.amount / totalOutstanding) * 100).toFixed(1)
    );
  }

  return bucketData;
}
