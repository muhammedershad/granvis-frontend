import { useState } from "react";
import { format, subMonths } from "date-fns";
import { Loader2 } from "lucide-react";
import { usePaymentInsights } from "./usePaymentInsights";
import { InsightsDateFilter } from "./InsightsDateFilter";
import { StatisticsOverview } from "./StatisticsOverview";
import { RevenueTrendsChart } from "./RevenueTrendsChart";
import { PerformanceComparison } from "./PerformanceComparison";
import { PaymentMethodsBreakdown } from "./PaymentMethodsBreakdown";
import { TopClientsSection } from "./TopClientsSection";
import { ProjectPayments } from "./ProjectPayments";
import { CategoryAnalysis } from "./CategoryAnalysis";
import { AgingAnalysis } from "./AgingAnalysis";

export function PaymentInsightsMain() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    subMonths(new Date(), 12)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const { data, isLoading, isError, isFetching } = usePaymentInsights({
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  });

  return (
    <div className="space-y-8">
      {/* Date Filter */}
      <div className="relative">
        <InsightsDateFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        {isFetching && !isLoading && (
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isError && (
        <div className="text-center py-8 text-red-500 dark:text-red-400">
          Failed to load insights data. Please try again.
        </div>
      )}

      {/* Statistics Overview */}
      <StatisticsOverview kpi={data?.kpi} isLoading={isLoading} />

      {/* Revenue Collection Trends */}
      <RevenueTrendsChart data={data?.monthlyTrends} isLoading={isLoading} />

      {/* Performance Comparison by Project Type */}
      <PerformanceComparison
        data={data?.categoryAnalysis}
        isLoading={isLoading}
      />

      {/* Payment Methods */}
      <PaymentMethodsBreakdown
        data={data?.methodBreakdown}
        isLoading={isLoading}
      />

      {/* Client Analysis */}
      <TopClientsSection data={data?.clientAnalysis} isLoading={isLoading} />

      {/* Project-wise Payments */}
      <ProjectPayments data={data?.projectAnalysis} isLoading={isLoading} />

      {/* Category & Subcategory Analysis */}
      <CategoryAnalysis data={data?.categoryAnalysis} isLoading={isLoading} />

      {/* Aging Analysis */}
      <AgingAnalysis data={data?.agingBuckets} isLoading={isLoading} />
    </div>
  );
}
