"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WidgetSkeletonProps {
  type: "stat" | "chart" | "list";
  className?: string;
}

export function WidgetSkeleton({ type, className }: WidgetSkeletonProps) {
  return (
    <Card
      className={`backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50 ${className || ""}`}
    >
      {type === "stat" && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-4 w-24 bg-gray-200/60 dark:bg-white/10" />
            <Skeleton className="h-10 w-10 rounded-lg bg-gray-200/60 dark:bg-white/10" />
          </div>
          <Skeleton className="h-8 w-20 mt-2 bg-gray-200/60 dark:bg-white/10" />
          <Skeleton className="h-3 w-32 mt-2 bg-gray-200/60 dark:bg-white/10" />
        </div>
      )}
      {type === "chart" && (
        <div className="relative space-y-4">
          <Skeleton className="h-5 w-40 bg-gray-200/60 dark:bg-white/10" />
          <Skeleton className="h-[220px] w-full rounded-lg bg-gray-200/60 dark:bg-white/10" />
        </div>
      )}
      {type === "list" && (
        <div className="relative space-y-4">
          <Skeleton className="h-5 w-40 bg-gray-200/60 dark:bg-white/10" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-gray-200/60 dark:bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-gray-200/60 dark:bg-white/10" />
                <Skeleton className="h-3 w-1/2 bg-gray-200/60 dark:bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
