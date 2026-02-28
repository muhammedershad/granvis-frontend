import type { ReactNode } from "react";
import { Clock, IndianRupee, Target, XCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import type { GlobalInvoiceSummary } from "@/lib/api/invoicesApi";

const formatCurrency = (amount: number | undefined) => {
  if (!amount && amount !== 0) {
    return "\u20B90";
  }
  if (amount >= 10000000) {
    return `\u20B9${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `\u20B9${(amount / 100000).toFixed(2)}L`;
  }
  return `\u20B9${amount.toLocaleString("en-IN")}`;
};

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  lightGradient: string;
  darkGradient: string;
  label: string;
  value: ReactNode;
  subtitle?: string;
  isLoading: boolean;
  skeletonWidth?: string;
}

function StatCard({
  icon,
  iconBg,
  lightGradient,
  darkGradient,
  label,
  value,
  subtitle,
  isLoading,
  skeletonWidth = "w-24",
}: StatCardProps) {
  return (
    <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${lightGradient} opacity-100 dark:opacity-0 transition-opacity duration-300`}
      ></div>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${darkGradient} opacity-0 dark:opacity-100 transition-opacity duration-300`}
      ></div>
      <div className="relative flex items-center space-x-3">
        <div className={`p-3 rounded-xl border shadow-lg ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          {isLoading ? (
            <Skeleton className={`h-7 ${skeletonWidth} mt-0.5`} />
          ) : (
            <p className="text-foreground text-2xl">{value}</p>
          )}
          {!isLoading && subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface KpiStatsCardsProps {
  summary: GlobalInvoiceSummary | undefined;
  isLoading: boolean;
}

export function KpiStatsCards({ summary, isLoading }: KpiStatsCardsProps) {
  const paidCount = summary?.paidCount ?? 0;
  const totalInvoices = summary?.totalInvoices ?? 0;
  const pendingInvoiceCount =
    (summary?.sentCount ?? 0) + (summary?.partiallyPaidCount ?? 0);
  const overdueCount = summary?.overdueCount ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={
          <IndianRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
        }
        iconBg="bg-green-500/20 border-green-500/30 shadow-green-200/50 dark:shadow-green-500/20"
        lightGradient="from-green-100/60 to-emerald-50/40"
        darkGradient="from-green-500/5 to-emerald-500/5"
        label="Total Invoiced"
        value={formatCurrency(summary?.totalAmount)}
        subtitle={`${paidCount} paid of ${totalInvoices}`}
        isLoading={isLoading}
      />

      <StatCard
        icon={
          <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        }
        iconBg="bg-yellow-500/20 border-yellow-500/30 shadow-yellow-200/50 dark:shadow-yellow-500/20"
        lightGradient="from-yellow-100/60 to-orange-50/40"
        darkGradient="from-yellow-500/5 to-orange-500/5"
        label="Pending Amount"
        value={formatCurrency(summary?.pendingAmount)}
        subtitle={`${pendingInvoiceCount} pending invoices`}
        isLoading={isLoading}
      />

      <StatCard
        icon={<XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />}
        iconBg="bg-red-500/20 border-red-500/30 shadow-red-200/50 dark:shadow-red-500/20"
        lightGradient="from-red-100/60 to-rose-50/40"
        darkGradient="from-red-500/5 to-rose-500/5"
        label="Overdue Amount"
        value={formatCurrency(summary?.overdueAmount)}
        subtitle={`${overdueCount} overdue invoice${overdueCount !== 1 ? "s" : ""}`}
        isLoading={isLoading}
      />

      <StatCard
        icon={<Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-500/20 border-blue-500/30 shadow-blue-200/50 dark:shadow-blue-500/20"
        lightGradient="from-blue-100/60 to-purple-50/40"
        darkGradient="from-blue-500/5 to-purple-500/5"
        label="Collection Rate"
        value={`${summary?.percentageCompleted ?? 0}%`}
        subtitle={`${formatCurrency(summary?.paidAmount)} collected`}
        isLoading={isLoading}
        skeletonWidth="w-16"
      />
    </div>
  );
}
