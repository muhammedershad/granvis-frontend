"use client";

import { useCallback, useState } from "react";
import {
  Building2,
  Handshake,
  IndianRupee,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useGetAdminDashboardQuery } from "@/lib/api/dashboardApi";
import { DashboardShell } from "./dashboard/DashboardShell";
import { StatCard, formatINR } from "./dashboard/widgets/StatCard";
import { ProjectsByStatusChart } from "./dashboard/widgets/ProjectsByStatusChart";
import { ProjectsByTypeChart } from "./dashboard/widgets/ProjectsByTypeChart";
import { BudgetOverviewChart } from "./dashboard/widgets/BudgetOverviewChart";
import { EmployeesByDeptChart } from "./dashboard/widgets/EmployeesByDeptChart";
import { ClientsByIndustryChart } from "./dashboard/widgets/ClientsByIndustryChart";
import { RecentProjectsList } from "./dashboard/widgets/RecentProjectsList";
import { TaskSummaryCards } from "./dashboard/widgets/TaskSummaryCards";
import type { DashboardQueryParams } from "@/types/dashboard";

export const AdminDashboard = () => {
  const [dateParams, setDateParams] = useState<DashboardQueryParams>({});
  const { data, isLoading, isError, refetch } =
    useGetAdminDashboardQuery(dateParams);

  const handleDateChange = useCallback((params: DashboardQueryParams) => {
    setDateParams(params);
  }, []);

  return (
    <DashboardShell
      title="Admin Dashboard"
      subtitle="Organization-wide management and oversight"
      icon={ShieldCheck}
      iconColor="from-purple-500 to-purple-600"
      lightGradient="from-purple-50/80 via-indigo-50/60 to-blue-50/80"
      darkGradient="from-purple-500/5 via-indigo-500/5 to-blue-500/5"
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      onDateChange={handleDateChange}
    >
      {data && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              label="Total Employees"
              value={data.employees.total}
              icon={Users}
              iconColor="from-purple-500 to-purple-600"
              iconShadow="shadow-purple-500/30"
              lightGradient="from-purple-50/80 via-blue-50/60 to-indigo-50/80"
              darkGradient="from-purple-500/5 via-transparent to-blue-500/5"
              subtitle={`${data.employees.active} active, ${data.employees.onLeave} on leave`}
            />
            <StatCard
              label="Total Projects"
              value={data.projects.total}
              icon={Building2}
              iconColor="from-blue-500 to-blue-600"
              iconShadow="shadow-blue-500/30"
              lightGradient="from-blue-50/80 via-indigo-50/60 to-purple-50/80"
              darkGradient="from-blue-500/5 via-transparent to-purple-500/5"
              subtitle={`${formatINR(data.projects.budget.totalBudget)} total budget`}
            />
            <StatCard
              label="Total Clients"
              value={data.clients.total}
              icon={Handshake}
              iconColor="from-cyan-500 to-cyan-600"
              iconShadow="shadow-cyan-500/30"
              lightGradient="from-cyan-50/80 via-blue-50/60 to-indigo-50/80"
              darkGradient="from-cyan-500/5 via-transparent to-blue-500/5"
              subtitle={`${data.clients.active} active, ${data.clients.vip} VIP`}
            />
            <StatCard
              label="Revenue Collected"
              value={formatINR(data.invoices.paidAmount)}
              icon={IndianRupee}
              iconColor="from-green-500 to-green-600"
              iconShadow="shadow-green-500/30"
              lightGradient="from-green-50/80 via-emerald-50/60 to-cyan-50/80"
              darkGradient="from-green-500/5 via-transparent to-cyan-500/5"
              subtitle={`${formatINR(data.invoices.pendingAmount)} pending`}
            />
          </div>

          {/* Budget & Project Type */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <BudgetOverviewChart budget={data.projects.budget} />
            </div>
            <ProjectsByTypeChart data={data.projects.byType} />
          </div>

          {/* Status Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <ProjectsByStatusChart data={data.projects.byStatus} />
            <EmployeesByDeptChart data={data.employees.byDepartment} />
          </div>

          {/* Clients & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <ClientsByIndustryChart data={data.clients.byIndustry} />
            <TaskSummaryCards data={data.tasks} />
          </div>

          {/* Recent Projects */}
          <RecentProjectsList data={data.recentProjects} />
        </>
      )}
    </DashboardShell>
  );
};
