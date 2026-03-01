import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { formatIndianCurrency } from "@/lib/utils/currency";
import type { MethodBreakdown } from "./types";

const METHOD_COLORS: Record<string, string> = {
  "Bank Transfer": "#8b5cf6",
  UPI: "#06b6d4",
  Cash: "#10b981",
  Cheque: "#f59e0b",
  NEFT: "#3b82f6",
  RTGS: "#ec4899",
  Other: "#6b7280",
};

interface PaymentMethodsBreakdownProps {
  data: MethodBreakdown[] | undefined;
  isLoading: boolean;
}

export function PaymentMethodsBreakdown({
  data,
  isLoading,
}: PaymentMethodsBreakdownProps) {
  const pieData = data?.map((m) => ({
    name: m.method,
    value: m.percentage,
    amount: m.amount,
    count: m.count,
    color: METHOD_COLORS[m.method] || "#6b7280",
  }));

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">Payment Methods</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-transparent to-pink-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-foreground">Distribution</CardTitle>
            <CardDescription>Payment method usage breakdown</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isLoading && <Skeleton className="w-full h-[300px]" />}
            {!isLoading && (!pieData || pieData.length === 0) && (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No payment method data
              </div>
            )}
            {!isLoading && pieData && pieData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0,0,0,0.85)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                      fontSize: "13px",
                    }}
                    formatter={(value: number, _name: string, props) => [
                      `${value}% (${formatIndianCurrency(props.payload.amount)})`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Amount List */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-transparent to-pink-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-pink-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
          <CardHeader className="relative">
            <CardTitle className="text-foreground">By Amount</CardTitle>
            <CardDescription>
              Revenue breakdown by payment method
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            )}
            {!isLoading && (!data || data.length === 0) && (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available
              </div>
            )}
            {!isLoading && data && data.length > 0 && (
              <div className="space-y-4">
                {data.map((method) => {
                  const color = METHOD_COLORS[method.method] || "#6b7280";
                  return (
                    <div key={method.method} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-sm text-foreground">
                            {method.method}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {formatIndianCurrency(method.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method.count} payments &middot; {method.percentage}
                            %
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${method.percentage}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
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
