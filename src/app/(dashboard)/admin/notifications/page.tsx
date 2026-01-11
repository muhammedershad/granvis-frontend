'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { NotificationPage } from "@/components/NotificationPage";

export default function AdminNotificationsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <NotificationPage />
    </RoleGuard>
  );
}
