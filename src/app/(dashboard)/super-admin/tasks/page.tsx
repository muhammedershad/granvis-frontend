"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import TasksPage from "@/components/TasksPage";

export default function SuperAdminTasksPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <TasksPage basePath="/super-admin/tasks" />
    </RoleGuard>
  );
}
