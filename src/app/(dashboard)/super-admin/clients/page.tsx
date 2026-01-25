"use client";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ClientsPage } from "@/components/clients";

export default function SuperAdminClientsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <ClientsPage />
    </RoleGuard>
  );
}
