import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { CategoryAnalysisData } from "./types";

function getCollectionRateColor(rate: number): string {
  if (rate >= 90) {
    return "text-green-600 dark:text-green-400";
  }
  if (rate >= 70) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  return "text-red-600 dark:text-red-400";
}

interface PerformanceComparisonProps {
  data: CategoryAnalysisData[] | undefined;
  isLoading: boolean;
}

export function PerformanceComparison({
  data,
  isLoading,
}: PerformanceComparisonProps) {
  const chartData = data?.map((cat) => ({
    type: cat.type,
    revenue: cat.totalAmount,
    collected: cat.paidAmount,
    pending: cat.totalAmount - cat.paidAmount,
    count: cat.count,
    collectionRate:
      cat.totalAmount > 0
        ? parseFloat(((cat.paidAmount / cat.totalAmount) * 100).toFixed(1))
        : 0,
  }));

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Performance Comparison
      </h2>
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 via-transparent to-cyan-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative">
          <CardTitle className="text-foreground">
            Project Type Performance
          </CardTitle>
          <CardDescription>Revenue comparison by project type</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {isLoading && <Skeleton className="w-full h-[350px]" />}
          {!isLoading && (!chartData || chartData.length === 0) && (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              No project type data available
            </div>
          )}
          {!isLoading && chartData && chartData.length > 0 && (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.15)"
                />
                <XAxis dataKey="type" stroke="#64748b" fontSize={12} />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => formatIndianCurrency(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.85)",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "13px",
                  }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      revenue: "Revenue",
                      collected: "Collected",
                      pending: "Pending",
                    };
                    return [
                      name === "collectionRate"
                        ? `${value}%`
                        : formatIndianCurrency(value),
                      labels[name] || name,
                    ];
                  }}
                />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#8b5cf6"
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="collected"
                  fill="#10b981"
                  name="Collected"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  fill="#f59e0b"
                  name="Pending"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Summary cards per type */}
      {!isLoading && chartData && chartData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chartData.map((item) => (
            <Card
              key={item.type}
              className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-lg"
            >
              <h4 className="text-sm font-medium text-foreground">
                {item.type}
              </h4>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="text-foreground font-medium">
                    {formatIndianCurrency(item.revenue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payments</span>
                  <span className="text-foreground">{item.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Collection</span>
                  <span className={getCollectionRateColor(item.collectionRate)}>
                    {item.collectionRate}%
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
