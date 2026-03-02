"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, Bell } from "lucide-react";

interface NotificationSummaryProps {
  data: {
    total: number;
    unread: number;
    urgent?: number;
  };
}

export function NotificationSummary({ data }: NotificationSummaryProps) {
  return (
    <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 via-yellow-50/60 to-orange-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-yellow-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300" />
      <div className="relative space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Notifications
            </p>
            <p className="text-2xl font-bold text-foreground">
              {data.unread}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                unread
              </span>
            </p>
          </div>
        </div>

        {(data.urgent ?? 0) > 0 && (
          <div className="p-2.5 rounded-lg bg-red-100/60 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-xs font-medium text-red-700 dark:text-red-300">
                {data.urgent} urgent
              </span>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {data.total} total notifications
        </p>
      </div>
    </Card>
  );
}
