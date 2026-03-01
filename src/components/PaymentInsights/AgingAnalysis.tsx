import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { AgingBucket } from "./types";

interface AgingAnalysisProps {
  data: AgingBucket[] | undefined;
  isLoading: boolean;
}

export function AgingAnalysis({ data, isLoading }: AgingAnalysisProps) {
  const totalOutstanding = data?.reduce((s, b) => s + b.amount, 0) ?? 0;
  const totalCount = data?.reduce((s, b) => s + b.count, 0) ?? 0;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Aging / Pending Analysis
      </h2>
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/60 via-transparent to-orange-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Accounts Receivable Aging
              </CardTitle>
              <CardDescription>
                Outstanding receivables by age category
              </CardDescription>
            </div>
            {!isLoading && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Total Outstanding
                </p>
                <p className="text-xl font-semibold text-foreground">
                  {formatIndianCurrency(totalOutstanding)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalCount} payment{totalCount !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !data || data.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              No outstanding payments
            </div>
          ) : totalOutstanding === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p className="text-lg font-medium text-green-600 dark:text-green-400">
                All clear!
              </p>
              <p className="text-sm">
                No outstanding receivables in this period
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {data.map((bucket) => (
                <div key={bucket.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: bucket.color }}
                      />
                      <span className="text-sm font-medium text-foreground">
                        {bucket.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">
                        {formatIndianCurrency(bucket.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({bucket.count} payment{bucket.count !== 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-muted/20 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${bucket.percentage}%`,
                        backgroundColor: bucket.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bucket.percentage}% of total outstanding
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
