"use client";

import { type ReactNode } from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "./DateRangeFilter";
import { WidgetSkeleton } from "./WidgetSkeleton";
import type { DashboardQueryParams } from "@/types/dashboard";

interface DashboardShellProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  lightGradient: string;
  darkGradient: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  onDateChange: (params: DashboardQueryParams) => void;
  children: ReactNode;
}

export function DashboardShell({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  lightGradient,
  darkGradient,
  isLoading,
  isError,
  refetch,
  onDateChange,
  children,
}: DashboardShellProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${lightGradient} opacity-100 dark:opacity-0 transition-opacity duration-300`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${darkGradient} opacity-0 dark:opacity-100 transition-opacity duration-300`}
        />
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <DateRangeFilter onChange={onDateChange} />
            <div
              className={`w-16 h-16 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </Card>

      {/* Error State */}
      {isError && (
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-red-200/50 dark:border-red-500/20 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-orange-50/60 to-red-50/80 opacity-100 dark:opacity-0" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 dark:opacity-100" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                Failed to load dashboard
              </h3>
              <p className="text-sm text-muted-foreground">
                There was an error fetching dashboard data. Please try again.
              </p>
            </div>
            <Button variant="outline" onClick={refetch}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Loading Skeletons */}
      {isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <WidgetSkeleton key={i} type="stat" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <WidgetSkeleton type="chart" />
            <WidgetSkeleton type="chart" />
          </div>
          <WidgetSkeleton type="list" />
        </>
      )}

      {/* Content */}
      {!isLoading && !isError && children}
    </div>
  );
}
