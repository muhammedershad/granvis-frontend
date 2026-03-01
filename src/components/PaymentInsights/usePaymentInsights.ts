import { useMemo } from "react";
import { useGetPaymentInsightsQuery } from "@/lib/api/paymentsApi";
import { computeInsights } from "./utils";
import type { InsightsData } from "./types";

interface UsePaymentInsightsParams {
  startDate?: string;
  endDate?: string;
}

interface UsePaymentInsightsReturn {
  data: InsightsData | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
}

export function usePaymentInsights({
  startDate,
  endDate,
}: UsePaymentInsightsParams): UsePaymentInsightsReturn {
  const {
    data: payments,
    isLoading,
    isError,
    isFetching,
  } = useGetPaymentInsightsQuery({ startDate, endDate });

  const data = useMemo<InsightsData | null>(() => {
    if (!payments) {
      return null;
    }
    return computeInsights(payments);
  }, [payments]);

  return { data, isLoading, isError, isFetching };
}
