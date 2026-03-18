"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import TasksPage from "@/components/TasksPage";

export default function AdminTasksPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <TasksPage basePath="/admin/tasks" />
    </RoleGuard>
  );
}
