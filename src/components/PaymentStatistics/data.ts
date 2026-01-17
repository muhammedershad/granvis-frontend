import {
  ClientSegment,
  CollectionEfficiency,
  KPIData,
  MonthlyTrend,
  PaymentTiming,
  ProjectTypePerformance,
  SeasonalTrend,
} from "./types";

export const kpiData: KPIData = {
  totalRevenue: {
    current: 8500000,
    previous: 7200000,
    change: 18.1,
    trend: "up",
  },
  averageInvoiceValue: {
    current: 85000,
    previous: 78000,
    change: 9.0,
    trend: "up",
  },
  paymentCycleTime: {
    current: 24,
    previous: 28,
    change: -14.3,
    trend: "down",
  },
  collectionRate: {
    current: 94.5,
    previous: 91.2,
    change: 3.6,
    trend: "up",
  },
  overdueRate: {
    current: 5.5,
    previous: 8.8,
    change: -37.5,
    trend: "down",
  },
  disputeRate: {
    current: 2.1,
    previous: 3.4,
    change: -38.2,
    trend: "down",
  },
};

export const monthlyTrendsData: MonthlyTrend[] = [
  {
    month: "Jan",
    revenue: 650000,
    invoices: 24,
    avgValue: 27083,
    cycleTime: 32,
    collectionRate: 89,
  },
  {
    month: "Feb",
    revenue: 720000,
    invoices: 28,
    avgValue: 25714,
    cycleTime: 30,
    collectionRate: 91,
  },
  {
    month: "Mar",
    revenue: 680000,
    invoices: 22,
    avgValue: 30909,
    cycleTime: 28,
    collectionRate: 93,
  },
  {
    month: "Apr",
    revenue: 890000,
    invoices: 31,
    avgValue: 28710,
    cycleTime: 26,
    collectionRate: 94,
  },
  {
    month: "May",
    revenue: 750000,
    invoices: 25,
    avgValue: 30000,
    cycleTime: 25,
    collectionRate: 95,
  },
  {
    month: "Jun",
    revenue: 920000,
    invoices: 34,
    avgValue: 27059,
    cycleTime: 24,
    collectionRate: 96,
  },
  {
    month: "Jul",
    revenue: 850000,
    invoices: 29,
    avgValue: 29310,
    cycleTime: 23,
    collectionRate: 94,
  },
  {
    month: "Aug",
    revenue: 780000,
    invoices: 26,
    avgValue: 30000,
    cycleTime: 22,
    collectionRate: 95,
  },
  {
    month: "Sep",
    revenue: 940000,
    invoices: 32,
    avgValue: 29375,
    cycleTime: 21,
    collectionRate: 96,
  },
  {
    month: "Oct",
    revenue: 1050000,
    invoices: 38,
    avgValue: 27632,
    cycleTime: 20,
    collectionRate: 97,
  },
  {
    month: "Nov",
    revenue: 980000,
    invoices: 35,
    avgValue: 28000,
    cycleTime: 19,
    collectionRate: 95,
  },
  {
    month: "Dec",
    revenue: 820000,
    invoices: 30,
    avgValue: 27333,
    cycleTime: 18,
    collectionRate: 94,
  },
];

export const projectTypePerformanceData: ProjectTypePerformance[] = [
  {
    type: "Residential",
    revenue: 3200000,
    invoices: 89,
    avgCycle: 22,
    collectionRate: 96,
  },
  {
    type: "Commercial",
    revenue: 2800000,
    invoices: 67,
    avgCycle: 28,
    collectionRate: 92,
  },
  {
    type: "Mixed-Use",
    revenue: 1900000,
    invoices: 45,
    avgCycle: 25,
    collectionRate: 94,
  },
  {
    type: "Hospitality",
    revenue: 600000,
    invoices: 18,
    avgCycle: 30,
    collectionRate: 88,
  },
];

export const paymentTimingData: PaymentTiming[] = [
  { period: "On Time", count: 245, percentage: 78.5, color: "#10b981" },
  { period: "1-7 Days Late", count: 42, percentage: 13.5, color: "#f59e0b" },
  { period: "8-30 Days Late", count: 18, percentage: 5.8, color: "#ef4444" },
  { period: "30+ Days Late", count: 7, percentage: 2.2, color: "#7c2d12" },
];

export const clientSegmentData: ClientSegment[] = [
  {
    segment: "Enterprise",
    revenue: 4200000,
    avgInvoice: 125000,
    count: 34,
    cycleTime: 18,
  },
  {
    segment: "Mid-Market",
    revenue: 2800000,
    avgInvoice: 75000,
    count: 37,
    cycleTime: 22,
  },
  {
    segment: "Small Business",
    revenue: 1500000,
    avgInvoice: 35000,
    count: 43,
    cycleTime: 28,
  },
];

export const seasonalTrendsData: SeasonalTrend[] = [
  {
    quarter: "Q1",
    revenue: 2050000,
    invoices: 74,
    disputes: 8,
    satisfaction: 4.2,
  },
  {
    quarter: "Q2",
    revenue: 2560000,
    invoices: 90,
    disputes: 5,
    satisfaction: 4.5,
  },
  {
    quarter: "Q3",
    revenue: 2570000,
    invoices: 87,
    disputes: 4,
    satisfaction: 4.6,
  },
  {
    quarter: "Q4",
    revenue: 2850000,
    invoices: 98,
    disputes: 3,
    satisfaction: 4.7,
  },
];

export const collectionEfficiencyData: CollectionEfficiency[] = [
  { name: "Collected", value: 94.5, color: "#10b981" },
  { name: "Outstanding", value: 5.5, color: "#ef4444" },
];
