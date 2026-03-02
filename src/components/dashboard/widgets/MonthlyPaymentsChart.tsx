"use client";

import { Card } from "@/components/ui/card";
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
import { formatCompact } from "./StatCard";

interface MonthlyPaymentsChartProps {
  data: Array<{
    month: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    count: number;
  }>;
}

export function MonthlyPaymentsChart({ data }: MonthlyPaymentsChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    ...item,
    name: item.month,
  }));

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-blue-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Monthly Payment Trend
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatCompact(v)}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(value),
                name,
              ]}
              contentStyle={{
                background: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="totalAmount"
              name="Total"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="paidAmount"
              name="Paid"
              stroke="#22c55e"
              fillOpacity={1}
              fill="url(#colorPaid)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="pendingAmount"
              name="Pending"
              stroke="#f97316"
              fillOpacity={1}
              fill="url(#colorPending)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
