"use client";

import { useCallback, useState } from "react";
import { AlertTriangle, Calculator, Clock, IndianRupee } from "lucide-react";
import { useGetAccountantDashboardQuery } from "@/lib/api/dashboardApi";
import { DashboardShell } from "./dashboard/DashboardShell";
import { StatCard, formatINR } from "./dashboard/widgets/StatCard";
import { BudgetOverviewChart } from "./dashboard/widgets/BudgetOverviewChart";
import { MonthlyPaymentsChart } from "./dashboard/widgets/MonthlyPaymentsChart";
import { PaymentMethodChart } from "./dashboard/widgets/PaymentMethodChart";
import { InvoiceStatusChart } from "./dashboard/widgets/InvoiceStatusChart";
import { RecentPaymentsList } from "./dashboard/widgets/RecentPaymentsList";
import type { DashboardQueryParams } from "@/types/dashboard";

export const AccountantDashboard = () => {
  const [dateParams, setDateParams] = useState<DashboardQueryParams>({});
  const { data, isLoading, isError, refetch } =
    useGetAccountantDashboardQuery(dateParams);

  const handleDateChange = useCallback((params: DashboardQueryParams) => {
    setDateParams(params);
  }, []);

  return (
    <DashboardShell
      title="Accountant Dashboard"
      subtitle="Financial overview and payment tracking"
      icon={Calculator}
      iconColor="from-emerald-500 to-emerald-600"
      lightGradient="from-emerald-50/80 via-green-50/60 to-cyan-50/80"
      darkGradient="from-emerald-500/5 via-green-500/5 to-cyan-500/5"
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      onDateChange={handleDateChange}
    >
      {data && (
        <>
          {/* Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              label="Total Invoiced"
              value={formatINR(data.invoices.totalAmount)}
              icon={IndianRupee}
              iconColor="from-purple-500 to-purple-600"
              iconShadow="shadow-purple-500/30"
              lightGradient="from-purple-50/80 via-indigo-50/60 to-blue-50/80"
              darkGradient="from-purple-500/5 via-transparent to-indigo-500/5"
              subtitle={`${data.invoices.totalInvoices} invoices`}
            />
            <StatCard
              label="Total Collected"
              value={formatINR(data.invoices.paidAmount)}
              icon={IndianRupee}
              iconColor="from-green-500 to-green-600"
              iconShadow="shadow-green-500/30"
              lightGradient="from-green-50/80 via-emerald-50/60 to-cyan-50/80"
              darkGradient="from-green-500/5 via-transparent to-emerald-500/5"
              subtitle={`${data.invoices.paidCount} paid, ${data.invoices.paidThisMonth} this month`}
            />
            <StatCard
              label="Pending Amount"
              value={formatINR(data.invoices.pendingAmount)}
              icon={Clock}
              iconColor="from-amber-500 to-amber-600"
              iconShadow="shadow-amber-500/30"
              lightGradient="from-amber-50/80 via-yellow-50/60 to-orange-50/80"
              darkGradient="from-amber-500/5 via-transparent to-yellow-500/5"
              subtitle={`${data.invoices.percentageCompleted}% collected`}
            />
            <StatCard
              label="Overdue Amount"
              value={formatINR(data.invoices.overdueAmount)}
              icon={AlertTriangle}
              iconColor="from-red-500 to-red-600"
              iconShadow="shadow-red-500/30"
              lightGradient="from-red-50/80 via-orange-50/60 to-red-50/80"
              darkGradient="from-red-500/5 via-transparent to-orange-500/5"
              subtitle={`${data.invoices.overdueCount} overdue invoices`}
            />
          </div>

          {/* Monthly Trend & Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <MonthlyPaymentsChart data={data.monthlyPayments} />
            </div>
            <PaymentMethodChart data={data.paymentMethodDistribution} />
          </div>

          {/* Invoice Status & Budget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <InvoiceStatusChart data={data.invoices} />
            <BudgetOverviewChart budget={data.projects.budget} />
          </div>

          {/* Recent Payments */}
          <RecentPaymentsList data={data.recentPayments} />
        </>
      )}
    </DashboardShell>
  );
};
