import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  IndianRupee,
  Send,
  XCircle,
} from "lucide-react";
import type { GlobalInvoiceSummary } from "@/lib/api/invoicesApi";

interface InvoiceStatsCardsProps {
  summary: GlobalInvoiceSummary | undefined;
  isLoading: boolean;
}

const formatCurrency = (amount: number | undefined) => {
  if (!amount && amount !== 0) {
    return "₹0";
  }
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function InvoiceStatsCards({
  summary,
  isLoading,
}: InvoiceStatsCardsProps) {
  const stats = [
    {
      label: "Total Invoices",
      value: summary?.totalInvoices ?? 0,
      icon: FileText,
      isCurrency: false,
      lightGradient: "from-blue-100/60 to-purple-50/40",
      darkGradient: "from-blue-500/5 to-purple-500/5",
      iconBg:
        "bg-blue-500/20 border-blue-500/30 shadow-blue-200/50 dark:shadow-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Sent",
      value: summary?.sentCount ?? 0,
      icon: Send,
      isCurrency: false,
      lightGradient: "from-cyan-100/60 to-teal-50/40",
      darkGradient: "from-cyan-500/5 to-teal-500/5",
      iconBg:
        "bg-cyan-500/20 border-cyan-500/30 shadow-cyan-200/50 dark:shadow-cyan-500/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      label: "Paid",
      value: summary?.paidCount ?? 0,
      icon: CheckCircle,
      isCurrency: false,
      lightGradient: "from-green-100/60 to-emerald-50/40",
      darkGradient: "from-green-500/5 to-emerald-500/5",
      iconBg:
        "bg-green-500/20 border-green-500/30 shadow-green-200/50 dark:shadow-green-500/20",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Partially Paid",
      value: summary?.partiallyPaidCount ?? 0,
      icon: Clock,
      isCurrency: false,
      lightGradient: "from-yellow-100/60 to-orange-50/40",
      darkGradient: "from-yellow-500/5 to-orange-500/5",
      iconBg:
        "bg-yellow-500/20 border-yellow-500/30 shadow-yellow-200/50 dark:shadow-yellow-500/20",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Overdue",
      value: summary?.overdueCount ?? 0,
      icon: AlertCircle,
      isCurrency: false,
      lightGradient: "from-red-100/60 to-rose-50/40",
      darkGradient: "from-red-500/5 to-rose-500/5",
      iconBg:
        "bg-red-500/20 border-red-500/30 shadow-red-200/50 dark:shadow-red-500/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "Total Amount",
      value: summary?.totalAmount ?? 0,
      icon: IndianRupee,
      isCurrency: true,
      lightGradient: "from-purple-100/60 to-indigo-50/40",
      darkGradient: "from-purple-500/5 to-indigo-500/5",
      iconBg:
        "bg-purple-500/20 border-purple-500/30 shadow-purple-200/50 dark:shadow-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Paid Amount",
      value: summary?.paidAmount ?? 0,
      icon: CheckCircle,
      isCurrency: true,
      lightGradient: "from-emerald-100/60 to-green-50/40",
      darkGradient: "from-emerald-500/5 to-green-500/5",
      iconBg:
        "bg-emerald-500/20 border-emerald-500/30 shadow-emerald-200/50 dark:shadow-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending Amount",
      value: summary?.pendingAmount ?? 0,
      icon: XCircle,
      isCurrency: true,
      lightGradient: "from-orange-100/60 to-amber-50/40",
      darkGradient: "from-orange-500/5 to-amber-500/5",
      iconBg:
        "bg-orange-500/20 border-orange-500/30 shadow-orange-200/50 dark:shadow-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.lightGradient} opacity-100 dark:opacity-0 transition-opacity duration-300`}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.darkGradient} opacity-0 dark:opacity-100 transition-opacity duration-300`}
            />
            <div className="relative flex items-center space-x-3">
              <div className={`p-3 rounded-xl border shadow-lg ${stat.iconBg}`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-0.5" />
                ) : (
                  <p className="text-foreground text-2xl">
                    {stat.isCurrency ? formatCurrency(stat.value) : stat.value}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
