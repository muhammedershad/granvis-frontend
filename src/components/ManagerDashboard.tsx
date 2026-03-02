"use client";

import { useCallback, useState } from "react";
import { Building2, Handshake, ListTodo, Users } from "lucide-react";
import { useGetManagerDashboardQuery } from "@/lib/api/dashboardApi";
import { DashboardShell } from "./dashboard/DashboardShell";
import { StatCard, formatINR } from "./dashboard/widgets/StatCard";
import { ProjectsByStatusChart } from "./dashboard/widgets/ProjectsByStatusChart";
import { ProjectsByTypeChart } from "./dashboard/widgets/ProjectsByTypeChart";
import { RecentProjectsList } from "./dashboard/widgets/RecentProjectsList";
import { TeamMembersList } from "./dashboard/widgets/TeamMembersList";
import { TaskSummaryCards } from "./dashboard/widgets/TaskSummaryCards";
import { NotificationSummary } from "./dashboard/widgets/NotificationSummary";
import type { DashboardQueryParams } from "@/types/dashboard";

export const ManagerDashboard = () => {
  const [dateParams, setDateParams] = useState<DashboardQueryParams>({});
  const { data, isLoading, isError, refetch } =
    useGetManagerDashboardQuery(dateParams);

  const handleDateChange = useCallback((params: DashboardQueryParams) => {
    setDateParams(params);
  }, []);

  return (
    <DashboardShell
      title="Manager Dashboard"
      subtitle="Team and project management overview"
      icon={Users}
      iconColor="from-blue-500 to-blue-600"
      lightGradient="from-blue-50/80 via-indigo-50/60 to-purple-50/80"
      darkGradient="from-blue-500/5 via-indigo-500/5 to-purple-500/5"
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
              label="My Projects"
              value={data.projects.total}
              icon={Building2}
              iconColor="from-blue-500 to-blue-600"
              iconShadow="shadow-blue-500/30"
              lightGradient="from-blue-50/80 via-indigo-50/60 to-purple-50/80"
              darkGradient="from-blue-500/5 via-transparent to-purple-500/5"
              subtitle={`${formatINR(data.projects.budget.totalBudget)} budget`}
            />
            <StatCard
              label="Team Members"
              value={data.teamMembers.length}
              icon={Users}
              iconColor="from-purple-500 to-purple-600"
              iconShadow="shadow-purple-500/30"
              lightGradient="from-purple-50/80 via-violet-50/60 to-indigo-50/80"
              darkGradient="from-purple-500/5 via-transparent to-violet-500/5"
              subtitle="across projects"
            />
            <StatCard
              label="Total Tasks"
              value={data.tasks.total}
              icon={ListTodo}
              iconColor="from-cyan-500 to-cyan-600"
              iconShadow="shadow-cyan-500/30"
              lightGradient="from-cyan-50/80 via-blue-50/60 to-indigo-50/80"
              darkGradient="from-cyan-500/5 via-transparent to-blue-500/5"
              subtitle={`${data.tasks.overdue} overdue`}
            />
            <StatCard
              label="My Clients"
              value={data.clients.total}
              icon={Handshake}
              iconColor="from-green-500 to-green-600"
              iconShadow="shadow-green-500/30"
              lightGradient="from-green-50/80 via-emerald-50/60 to-cyan-50/80"
              darkGradient="from-green-500/5 via-transparent to-emerald-500/5"
              subtitle={`${data.clients.active} active`}
            />
          </div>

          {/* Projects & Team */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <RecentProjectsList
                data={data.recentProjects.map((p) => ({
                  id: p.id,
                  name: p.name,
                  status: p.status,
                  type: p.type,
                  progressPercentage: p.progressPercentage,
                  totalBudget: p.totalBudget,
                  client: p.client,
                }))}
              />
            </div>
            <TeamMembersList data={data.teamMembers} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <ProjectsByStatusChart data={data.projects.byStatus} />
            <ProjectsByTypeChart data={data.projects.byType} />
          </div>

          {/* Tasks & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <TaskSummaryCards data={data.tasks} />
            </div>
            <NotificationSummary data={data.notifications} />
          </div>
        </>
      )}
    </DashboardShell>
  );
};
