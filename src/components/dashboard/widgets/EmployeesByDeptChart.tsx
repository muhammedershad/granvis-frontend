"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEPT_COLORS: Record<string, string> = {
  architecture: "#3b82f6",
  interior: "#8b5cf6",
  landscape: "#22c55e",
  construction: "#f97316",
  drafting: "#06b6d4",
  accountant: "#eab308",
  admin: "#ec4899",
  marketing: "#14b8a6",
};

interface EmployeesByDeptChartProps {
  data: Record<string, number>;
}

export function EmployeesByDeptChart({ data }: EmployeesByDeptChartProps) {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const chartData = Object.entries(data)
    .map(([dept, count]) => ({
      name: dept.charAt(0).toUpperCase() + dept.slice(1),
      count,
      fill: DEPT_COLORS[dept] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Employees by Department
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(0,0,0,0.8)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
