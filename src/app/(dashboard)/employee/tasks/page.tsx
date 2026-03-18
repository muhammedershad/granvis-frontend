"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import TasksPage from "@/components/TasksPage";

export default function EmployeeTasksPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.EMPLOYEE]}>
      <TasksPage basePath="/employee/tasks" employeeView />
    </RoleGuard>
  );
}
