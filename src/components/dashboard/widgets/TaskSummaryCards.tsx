"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, ListTodo, RotateCw } from "lucide-react";

interface TaskSummaryCardsProps {
  data: {
    total: number;
    byStatus: Record<string, number>;
    overdue: number;
    upcoming?: number;
  };
}

export function TaskSummaryCards({ data }: TaskSummaryCardsProps) {
  const items = [
    {
      label: "Total Tasks",
      value: data.total,
      icon: ListTodo,
      color: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/30",
      bg: "from-blue-50/80 via-indigo-50/60 to-blue-50/80",
      darkBg: "from-blue-500/5 via-transparent to-indigo-500/5",
    },
    {
      label: "In Progress",
      value: data.byStatus?.in_progress || 0,
      icon: RotateCw,
      color: "from-cyan-500 to-cyan-600",
      shadow: "shadow-cyan-500/30",
      bg: "from-cyan-50/80 via-blue-50/60 to-cyan-50/80",
      darkBg: "from-cyan-500/5 via-transparent to-blue-500/5",
    },
    {
      label: "Completed",
      value: data.byStatus?.done || 0,
      icon: CheckCircle2,
      color: "from-green-500 to-green-600",
      shadow: "shadow-green-500/30",
      bg: "from-green-50/80 via-emerald-50/60 to-green-50/80",
      darkBg: "from-green-500/5 via-transparent to-emerald-500/5",
    },
    {
      label: "Overdue",
      value: data.overdue,
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      shadow: "shadow-red-500/30",
      bg: "from-red-50/80 via-orange-50/60 to-red-50/80",
      darkBg: "from-red-500/5 via-transparent to-orange-500/5",
    },
  ];

  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-slate-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-gray-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Task Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg ${item.shadow}`}
                >
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
