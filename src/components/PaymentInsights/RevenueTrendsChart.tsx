import {
  Area,
  AreaChart,
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
import type { MonthlyTrend } from "./types";

interface RevenueTrendsChartProps {
  data: MonthlyTrend[] | undefined;
  isLoading: boolean;
}

export function RevenueTrendsChart({
  data,
  isLoading,
}: RevenueTrendsChartProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Revenue Collection Trends
      </h2>
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-transparent to-blue-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative">
          <CardTitle className="text-foreground">
            Monthly Revenue vs Collections
          </CardTitle>
          <CardDescription>
            Revenue, collected, and pending amounts over time
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {isLoading ? (
            <Skeleton className="w-full h-[400px]" />
          ) : !data || data.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              No data available for the selected period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(128,128,128,0.15)"
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
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
                  formatter={(value: number, name: string) => [
                    formatIndianCurrency(value),
                    name === "revenue"
                      ? "Revenue"
                      : name === "collected"
                        ? "Collected"
                        : "Pending",
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  name="Collected"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Pending"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
