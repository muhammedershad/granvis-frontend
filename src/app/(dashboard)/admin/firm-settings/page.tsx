"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { FirmSettingsPage } from "@/components/FirmSettings/FirmSettingsPage";

export default function AdminFirmSettingsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <FirmSettingsPage />
    </RoleGuard>
  );
}
