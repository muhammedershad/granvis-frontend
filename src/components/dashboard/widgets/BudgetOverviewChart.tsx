"use client";

import { Card } from "@/components/ui/card";
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
import { formatCompact } from "./StatCard";

interface BudgetOverviewChartProps {
  budget: {
    totalBudget: number;
    totalSpent: number;
    averageBudget?: number;
  };
}

export function BudgetOverviewChart({ budget }: BudgetOverviewChartProps) {
  const data = [
    {
      name: "Total Budget",
      Budget: budget.totalBudget,
      Spent: budget.totalSpent,
    },
  ];

  const remaining = budget.totalBudget - budget.totalSpent;
  const utilizationPct =
    budget.totalBudget > 0
      ? Math.round((budget.totalSpent / budget.totalBudget) * 100)
      : 0;

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Budget Overview
        </h3>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barGap={12}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
            />
            <XAxis dataKey="name" tick={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => formatCompact(v)}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                }).format(value)
              }
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
            <Bar
              dataKey="Budget"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
            <Bar
              dataKey="Spent"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10">
            <p className="text-xs text-muted-foreground">Total Budget</p>
            <p className="text-sm font-bold text-foreground">
              {formatCompact(budget.totalBudget)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10">
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="text-sm font-bold text-foreground">
              {formatCompact(remaining > 0 ? remaining : 0)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10">
            <p className="text-xs text-muted-foreground">Utilization</p>
            <p className="text-sm font-bold text-foreground">
              {utilizationPct}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
