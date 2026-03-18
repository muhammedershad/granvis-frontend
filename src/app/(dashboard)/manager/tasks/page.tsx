"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import TasksPage from "@/components/TasksPage";

export default function ManagerTasksPage() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <TasksPage basePath="/manager/tasks" />
    </RoleGuard>
  );
}
