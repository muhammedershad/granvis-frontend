"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProfilePage } from "@/components/ProfilePage";

export default function AdminProfilePage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <ProfilePage />
    </RoleGuard>
  );
}
