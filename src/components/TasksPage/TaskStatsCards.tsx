"use client";

import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  ClipboardList,
  Eye,
  Timer,
} from "lucide-react";
import { TaskStats } from "@/types/task";

interface TaskStatsCardsProps {
  stats: TaskStats;
}

const statItems = [
  {
    key: "total",
    label: "Total Tasks",
    icon: ClipboardList,
    iconBg: "bg-blue-500/20",
    iconBorder: "border-blue-500/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconShadow: "shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20",
    bg: "from-blue-100/60 to-indigo-50/40",
    darkBg: "from-blue-500/5 to-indigo-500/5",
  },
  {
    key: "todo",
    label: "To Do",
    icon: Circle,
    iconBg: "bg-slate-500/20",
    iconBorder: "border-slate-500/30",
    iconColor: "text-slate-600 dark:text-slate-400",
    iconShadow: "shadow-lg shadow-slate-200/50 dark:shadow-slate-500/20",
    bg: "from-slate-100/60 to-gray-50/40",
    darkBg: "from-slate-500/5 to-gray-500/5",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: Timer,
    iconBg: "bg-cyan-500/20",
    iconBorder: "border-cyan-500/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    iconShadow: "shadow-lg shadow-cyan-200/50 dark:shadow-cyan-500/20",
    bg: "from-cyan-100/60 to-blue-50/40",
    darkBg: "from-cyan-500/5 to-blue-500/5",
  },
  {
    key: "review",
    label: "In Review",
    icon: Eye,
    iconBg: "bg-yellow-500/20",
    iconBorder: "border-yellow-500/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconShadow: "shadow-lg shadow-yellow-200/50 dark:shadow-yellow-500/20",
    bg: "from-yellow-100/60 to-amber-50/40",
    darkBg: "from-yellow-500/5 to-amber-500/5",
  },
  {
    key: "done",
    label: "Completed",
    icon: CheckCircle2,
    iconBg: "bg-green-500/20",
    iconBorder: "border-green-500/30",
    iconColor: "text-green-600 dark:text-green-400",
    iconShadow: "shadow-lg shadow-green-200/50 dark:shadow-green-500/20",
    bg: "from-green-100/60 to-emerald-50/40",
    darkBg: "from-green-500/5 to-emerald-500/5",
  },
  {
    key: "overdue",
    label: "Overdue",
    icon: AlertTriangle,
    iconBg: "bg-red-500/20",
    iconBorder: "border-red-500/30",
    iconColor: "text-red-600 dark:text-red-400",
    iconShadow: "shadow-lg shadow-red-200/50 dark:shadow-red-500/20",
    bg: "from-red-100/60 to-rose-50/40",
    darkBg: "from-red-500/5 to-rose-500/5",
  },
];

export function TaskStatsCards({ stats }: TaskStatsCardsProps) {
  const getValue = (key: string) => {
    if (key === "total") {
      return stats.total;
    }
    if (key === "overdue") {
      return stats.overdue;
    }
    return stats.byStatus[key as keyof typeof stats.byStatus] || 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card
          key={item.key}
          className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.bg} opacity-100 dark:opacity-0 transition-opacity duration-300`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.darkBg} opacity-0 dark:opacity-100 transition-opacity duration-300`}
          />
          <div className="relative flex items-center space-x-3">
            <div
              className={`p-3 ${item.iconBg} rounded-xl border ${item.iconBorder} ${item.iconShadow}`}
            >
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{item.label}</p>
              <p className="text-foreground text-2xl">{getValue(item.key)}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
