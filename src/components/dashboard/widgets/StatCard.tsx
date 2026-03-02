"use client";

import { Card } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string; // e.g. "from-purple-500 to-purple-600"
  iconShadow: string; // e.g. "shadow-purple-500/30"
  lightGradient: string; // e.g. "from-purple-50/80 via-blue-50/60 to-indigo-50/80"
  darkGradient: string; // e.g. "from-purple-500/5 via-transparent to-blue-500/5"
  subtitle?: string;
  trend?: { value: string; positive: boolean };
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconShadow,
  lightGradient,
  darkGradient,
  subtitle,
  trend,
}: StatCardProps) {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${lightGradient} opacity-100 dark:opacity-0 transition-opacity duration-300`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${darkGradient} opacity-0 dark:opacity-100 transition-opacity duration-300`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div
            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg ${iconShadow}`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {(subtitle || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span
                className={
                  trend.positive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {trend.value}
              </span>
            )}
            {trend && subtitle && " "}
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}

// ─── Currency formatter ─────────────────────────────────────────────

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompact(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
