"use client";

import { Card } from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface InvoiceStatusChartProps {
  data: {
    paidCount: number;
    partiallyPaidCount?: number;
    overdueCount: number;
    totalInvoices: number;
  };
}

export function InvoiceStatusChart({ data }: InvoiceStatusChartProps) {
  const sentCount =
    data.totalInvoices -
    data.paidCount -
    (data.partiallyPaidCount || 0) -
    data.overdueCount;

  const chartData = [
    { name: "Paid", value: data.paidCount, fill: "#22c55e" },
    {
      name: "Partially Paid",
      value: data.partiallyPaidCount || 0,
      fill: "#06b6d4",
    },
    { name: "Overdue", value: data.overdueCount, fill: "#ef4444" },
    { name: "Sent", value: Math.max(sentCount, 0), fill: "#eab308" },
  ].filter((item) => item.value > 0);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Invoice Status
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value} invoices`,
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
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
