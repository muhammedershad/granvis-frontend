import { FileText, TrendingUp, Users } from "lucide-react";
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

interface SummaryCardsProps {
  summary: GlobalInvoiceSummary | undefined;
  isLoading: boolean;
}

export function SummaryCards({ summary, isLoading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Invoices */}
      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-indigo-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Invoices</p>
            {isLoading ? (
              <Skeleton className="h-7 w-12 mt-0.5" />
            ) : (
              <p className="text-foreground text-2xl">
                {summary?.totalInvoices ?? 0}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Paid This Month */}
      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 to-teal-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-200/50 dark:shadow-cyan-500/20">
            <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Paid This Month</p>
            {isLoading ? (
              <Skeleton className="h-7 w-24 mt-0.5" />
            ) : (
              <p className="text-foreground text-2xl">
                {formatCurrency(summary?.paidThisMonth)}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Active Clients */}
      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 to-amber-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/20">
            <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Active Clients</p>
            {isLoading ? (
              <Skeleton className="h-7 w-12 mt-0.5" />
            ) : (
              <p className="text-foreground text-2xl">
                {summary?.uniqueClientCount ?? 0}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
