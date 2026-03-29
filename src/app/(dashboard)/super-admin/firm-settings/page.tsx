"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { FirmSettingsPage } from "@/components/FirmSettings/FirmSettingsPage";

export default function SuperAdminFirmSettingsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <FirmSettingsPage />
    </RoleGuard>
  );
}
