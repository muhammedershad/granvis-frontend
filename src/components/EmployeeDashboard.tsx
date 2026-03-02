"use client";

import { useCallback, useState } from "react";
import { Bell, Building2, ListTodo, User } from "lucide-react";
import { useGetEmployeeDashboardQuery } from "@/lib/api/dashboardApi";
import { DashboardShell } from "./dashboard/DashboardShell";
import { StatCard } from "./dashboard/widgets/StatCard";
import { ProjectsByStatusChart } from "./dashboard/widgets/ProjectsByStatusChart";
import { MyProjectsList } from "./dashboard/widgets/MyProjectsList";
import { TaskSummaryCards } from "./dashboard/widgets/TaskSummaryCards";
import type { DashboardQueryParams } from "@/types/dashboard";

export const EmployeeDashboard = () => {
  const [dateParams, setDateParams] = useState<DashboardQueryParams>({});
  const { data, isLoading, isError, refetch } =
    useGetEmployeeDashboardQuery(dateParams);

  const handleDateChange = useCallback((params: DashboardQueryParams) => {
    setDateParams(params);
  }, []);

  // Derive "active" count from byStatus
  const activeCount =
    data?.projectSummary.byStatus.find((s) => s._id === "In Progress")?.count ||
    0;

  return (
    <DashboardShell
      title="My Dashboard"
      subtitle="Your personal workspace overview"
      icon={User}
      iconColor="from-indigo-500 to-indigo-600"
      lightGradient="from-indigo-50/80 via-blue-50/60 to-purple-50/80"
      darkGradient="from-indigo-500/5 via-blue-500/5 to-purple-500/5"
      isLoading={isLoading}
      isError={isError}
      refetch={refetch}
      onDateChange={handleDateChange}
    >
      {data && (
        <>
          {/* Personal Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              label="My Projects"
              value={data.projectSummary.total}
              icon={Building2}
              iconColor="from-blue-500 to-blue-600"
              iconShadow="shadow-blue-500/30"
              lightGradient="from-blue-50/80 via-indigo-50/60 to-purple-50/80"
              darkGradient="from-blue-500/5 via-transparent to-purple-500/5"
              subtitle={`${activeCount} in progress`}
            />
            <StatCard
              label="My Tasks"
              value={data.tasks.total}
              icon={ListTodo}
              iconColor="from-cyan-500 to-cyan-600"
              iconShadow="shadow-cyan-500/30"
              lightGradient="from-cyan-50/80 via-blue-50/60 to-indigo-50/80"
              darkGradient="from-cyan-500/5 via-transparent to-blue-500/5"
              subtitle={`${data.tasks.overdue} overdue, ${data.tasks.upcoming} upcoming`}
            />
            <StatCard
              label="Completed Tasks"
              value={data.tasks.byStatus?.done || 0}
              icon={ListTodo}
              iconColor="from-green-500 to-green-600"
              iconShadow="shadow-green-500/30"
              lightGradient="from-green-50/80 via-emerald-50/60 to-cyan-50/80"
              darkGradient="from-green-500/5 via-transparent to-emerald-500/5"
              subtitle="tasks done"
            />
            <StatCard
              label="Notifications"
              value={data.notifications.unread}
              icon={Bell}
              iconColor="from-amber-500 to-amber-600"
              iconShadow="shadow-amber-500/30"
              lightGradient="from-amber-50/80 via-yellow-50/60 to-orange-50/80"
              darkGradient="from-amber-500/5 via-transparent to-yellow-500/5"
              subtitle={
                data.notifications.urgent
                  ? `${data.notifications.urgent} urgent`
                  : "unread"
              }
            />
          </div>

          {/* Task Overview */}
          <TaskSummaryCards data={data.tasks} />

          {/* My Projects */}
          <MyProjectsList data={data.myProjects} />

          {/* Projects by Status */}
          {data.projectSummary.byStatus.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <ProjectsByStatusChart data={data.projectSummary.byStatus} />
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
};
