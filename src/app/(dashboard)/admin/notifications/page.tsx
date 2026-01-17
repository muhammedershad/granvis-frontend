"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { NotificationPage } from "@/components/NotificationPage";

export default function AdminNotificationsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <NotificationPage />
    </RoleGuard>
  );
}
