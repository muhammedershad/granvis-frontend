import type { ReactNode } from "react";
import {
  AlertTriangle,
  Calculator,
  CheckCircle,
  Clock,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { KpiMetrics } from "./types";

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  lightGradient: string;
  darkGradient: string;
  label: string;
  value: ReactNode;
  subtitle?: string;
  isLoading: boolean;
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
}: StatCardProps) {
  return (
    <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${lightGradient} opacity-100 dark:opacity-0 transition-opacity duration-300`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${darkGradient} opacity-0 dark:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative flex items-center space-x-3">
        <div className={`p-3 rounded-xl border shadow-lg ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground text-sm">{label}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-24 mt-0.5" />
          ) : (
            <p className="text-foreground text-2xl truncate">{value}</p>
          )}
          {!isLoading && subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface StatisticsOverviewProps {
  kpi: KpiMetrics | undefined;
  isLoading: boolean;
}

function getCardConfigs(kpi: KpiMetrics | undefined) {
  const rate = kpi?.collectionRate ?? 0;
  return [
    {
      key: "revenue",
      icon: (
        <IndianRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
      ),
      iconBg:
        "bg-green-500/20 border-green-500/30 shadow-green-200/50 dark:shadow-green-500/20",
      lightGradient: "from-green-100/60 to-emerald-50/40",
      darkGradient: "from-green-500/5 to-emerald-500/5",
      label: "Total Revenue",
      value: formatIndianCurrency(kpi?.totalRevenue ?? 0),
      subtitle: `${kpi?.paymentCount ?? 0} payments`,
    },
    {
      key: "collected",
      icon: (
        <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      ),
      iconBg:
        "bg-blue-500/20 border-blue-500/30 shadow-blue-200/50 dark:shadow-blue-500/20",
      lightGradient: "from-blue-100/60 to-indigo-50/40",
      darkGradient: "from-blue-500/5 to-indigo-500/5",
      label: "Collected",
      value: formatIndianCurrency(kpi?.totalCollected ?? 0),
      subtitle: `${rate.toFixed(1)}% rate`,
    },
    {
      key: "pending",
      icon: <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      iconBg:
        "bg-yellow-500/20 border-yellow-500/30 shadow-yellow-200/50 dark:shadow-yellow-500/20",
      lightGradient: "from-yellow-100/60 to-orange-50/40",
      darkGradient: "from-yellow-500/5 to-orange-500/5",
      label: "Pending",
      value: formatIndianCurrency(kpi?.totalPending ?? 0),
    },
    {
      key: "overdue",
      icon: (
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      ),
      iconBg:
        "bg-red-500/20 border-red-500/30 shadow-red-200/50 dark:shadow-red-500/20",
      lightGradient: "from-red-100/60 to-rose-50/40",
      darkGradient: "from-red-500/5 to-rose-500/5",
      label: "Overdue",
      value: formatIndianCurrency(kpi?.totalOverdue ?? 0),
      subtitle: kpi?.totalCancelled
        ? `${formatIndianCurrency(kpi.totalCancelled)} cancelled`
        : undefined,
    },
    {
      key: "avg",
      icon: (
        <Calculator className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      ),
      iconBg:
        "bg-purple-500/20 border-purple-500/30 shadow-purple-200/50 dark:shadow-purple-500/20",
      lightGradient: "from-purple-100/60 to-violet-50/40",
      darkGradient: "from-purple-500/5 to-violet-500/5",
      label: "Avg Payment",
      value: formatIndianCurrency(kpi?.avgPaymentAmount ?? 0),
    },
    {
      key: "rate",
      icon: <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      iconBg:
        "bg-cyan-500/20 border-cyan-500/30 shadow-cyan-200/50 dark:shadow-cyan-500/20",
      lightGradient: "from-cyan-100/60 to-teal-50/40",
      darkGradient: "from-cyan-500/5 to-teal-500/5",
      label: "Collection Rate",
      value: `${rate.toFixed(1)}%`,
      subtitle: `${kpi?.paymentCount ?? 0} total payments`,
    },
  ];
}

export function StatisticsOverview({
  kpi,
  isLoading,
}: StatisticsOverviewProps) {
  const cards = getCardConfigs(kpi);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Statistics Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            iconBg={card.iconBg}
            lightGradient={card.lightGradient}
            darkGradient={card.darkGradient}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
