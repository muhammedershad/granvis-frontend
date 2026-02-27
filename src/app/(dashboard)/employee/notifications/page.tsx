"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { NotificationPage } from "@/components/NotificationPage";

export default function EmployeeNotificationsPage() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.EMPLOYEE,
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <NotificationPage />
    </RoleGuard>
  );
}
