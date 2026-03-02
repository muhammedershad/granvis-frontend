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

const STATUS_COLORS: Record<string, string> = {
  Planning: "#eab308",
  "In Progress": "#3b82f6",
  "On Hold": "#f97316",
  Completed: "#22c55e",
  Cancelled: "#ef4444",
};

interface ProjectsByStatusChartProps {
  data: Array<{ _id: string; count: number }>;
}

export function ProjectsByStatusChart({ data }: ProjectsByStatusChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    name: item._id,
    value: item.count,
    fill: STATUS_COLORS[item._id] || "#6b7280",
  }));

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Projects by Status
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
