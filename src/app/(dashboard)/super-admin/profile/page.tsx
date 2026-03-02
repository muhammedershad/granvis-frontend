"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProfilePage } from "@/components/ProfilePage";

export default function SuperAdminProfilePage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <ProfilePage />
    </RoleGuard>
  );
}
