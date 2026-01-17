"use client";

import {
  Activity,
  AlertCircle,
  Building2,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BudgetChart } from "@/components/BudgetChart";
import { CalendarWidget } from "@/components/CalendarWidget";

export const SuperAdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
        {/* Light theme gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-purple-50/60 to-blue-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

        {/* Neon glow effect - only in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Super Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete system oversight and control
            </p>
          </div>
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ">
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-indigo-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

          {/* Neon glow effect - only in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">1,284</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 dark:text-green-400">+12%</span>{" "}
              from last month
            </p>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

          {/* Neon glow effect - only in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Active Organizations
              </p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">48</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 dark:text-green-400">+3</span> new
              this month
            </p>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/80 via-blue-50/60 to-indigo-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

          {/* Neon glow effect - only in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                System Health
              </p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Uptime this month
            </p>
          </div>
        </Card>

        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-cyan-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

          {/* Neon glow effect - only in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground">$124.5K</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 dark:text-green-400">+18%</span>{" "}
              from last month
            </p>
          </div>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 ">
        <div className="lg:col-span-2">
          <BudgetChart />
        </div>
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          {/* Light theme gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-orange-50/60 to-red-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>

          {/* Neon glow effect - only in dark mode */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-red-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative">
            <div className="flex items-center justify-between ">
              <h3 className="text-foreground">System Alerts</h3>
              <Badge
                variant="secondary"
                className="bg-red-100/80 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30 shadow-lg shadow-red-100/50 dark:shadow-red-500/10"
              >
                3 Active
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20 hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 dark:hover:shadow-black/30 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Database backup pending
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Scheduled for 2:00 AM
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20 hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 dark:hover:shadow-black/30 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      System update available
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Version 2.4.1
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-lg shadow-gray-100/50 dark:shadow-black/20 hover:shadow-xl hover:bg-white/80 dark:hover:bg-white/10 dark:hover:shadow-black/30 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                    <AlertCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      All systems operational
                    </p>
                    <p className="text-xs text-muted-foreground">
                      No issues detected
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-red-100/80 to-orange-100/60 dark:from-red-500/10 dark:to-orange-500/10 border border-red-200/50 dark:border-red-500/20 shadow-lg shadow-red-100/50 dark:shadow-red-500/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Critical Alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Require attention
                  </p>
                </div>
                <div className="text-2xl font-bold text-foreground">0</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <CalendarWidget />
    </div>
  );
};
