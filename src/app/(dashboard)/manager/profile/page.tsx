"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProfilePage } from "@/components/ProfilePage";

export default function ManagerProfilePage() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <ProfilePage />
    </RoleGuard>
  );
}
