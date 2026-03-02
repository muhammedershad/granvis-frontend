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

const METHOD_COLORS: Record<string, string> = {
  cash: "#22c55e",
  bank_transfer: "#3b82f6",
  cheque: "#8b5cf6",
  upi: "#06b6d4",
  neft: "#f97316",
  rtgs: "#eab308",
  other: "#6b7280",
};

const METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  upi: "UPI",
  neft: "NEFT",
  rtgs: "RTGS",
  other: "Other",
};

interface PaymentMethodChartProps {
  data: Array<{
    method: string;
    count: number;
    totalAmount: number;
  }>;
}

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    name: METHOD_LABELS[item.method] || item.method,
    value: item.count,
    amount: item.totalAmount,
    fill: METHOD_COLORS[item.method] || "#6b7280",
  }));

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-cyan-50/60 to-blue-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Payment Methods
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
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
                `${value} payments`,
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
