import { useState } from "react";
import { ChevronDown, ChevronRight, Layers } from "lucide-react";
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
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { CategoryAnalysisData } from "./types";

interface CategoryAnalysisProps {
  data: CategoryAnalysisData[] | undefined;
  isLoading: boolean;
}

const CATEGORY_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export function CategoryAnalysis({ data, isLoading }: CategoryAnalysisProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null);

  const chartData = data?.map((cat) => ({
    type: cat.type,
    total: cat.totalAmount,
    paid: cat.paidAmount,
    pending: cat.totalAmount - cat.paidAmount,
  }));

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">
        Category & Subcategory Analysis
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-transparent to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-foreground">
              Category Comparison
            </CardTitle>
            <CardDescription>
              Revenue by project type (category)
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isLoading && <Skeleton className="w-full h-[350px]" />}
            {!isLoading && (!chartData || chartData.length === 0) && (
              <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                No category data available
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
                    formatter={(value: number) => formatIndianCurrency(value)}
                  />
                  <Legend />
                  <Bar
                    dataKey="paid"
                    stackId="a"
                    fill="#10b981"
                    name="Paid"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill="#f59e0b"
                    name="Pending"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Drill-down List */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-transparent to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Category Drill-down
            </CardTitle>
            <CardDescription>
              Click a category to see subcategories
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <div className="flex items-center justify-center h-40 text-muted-foreground">
                No category data
              </div>
            )}
            {!isLoading && data && data.length > 0 && (
              <div className="space-y-1">
                {data.map((cat, catIndex) => {
                  const isExpanded = expandedType === cat.type;
                  const collectionRate =
                    cat.totalAmount > 0
                      ? ((cat.paidAmount / cat.totalAmount) * 100).toFixed(1)
                      : "0.0";

                  return (
                    <div key={cat.type}>
                      <button
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/10 transition-colors text-left"
                        onClick={() =>
                          setExpandedType(isExpanded ? null : cat.type)
                        }
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                CATEGORY_COLORS[
                                  catIndex % CATEGORY_COLORS.length
                                ],
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {cat.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cat.count} payments &middot; {collectionRate}%
                              collected
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-sm font-medium text-foreground">
                            {formatIndianCurrency(cat.totalAmount)}
                          </p>
                        </div>
                      </button>

                      {/* Subcategories */}
                      {isExpanded && (
                        <div className="ml-10 mb-2 space-y-1">
                          {cat.subcategories.map((sub) => {
                            const subRate =
                              sub.totalAmount > 0
                                ? (
                                    (sub.paidAmount / sub.totalAmount) *
                                    100
                                  ).toFixed(1)
                                : "0.0";

                            return (
                              <div
                                key={sub.category}
                                className="flex items-center justify-between p-2.5 rounded-md bg-muted/5 border border-white/5"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm text-foreground">
                                    {sub.category}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {sub.count} payments
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {subRate}% collected
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right shrink-0 ml-2">
                                  <p className="text-sm text-foreground">
                                    {formatIndianCurrency(sub.totalAmount)}
                                  </p>
                                  <p className="text-xs text-green-600 dark:text-green-400">
                                    {formatIndianCurrency(sub.paidAmount)} paid
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
