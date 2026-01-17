"use client";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { EmployeesPage } from "@/components/EmployeesPage";

export default function SuperAdminEmployeesPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <EmployeesPage />
    </RoleGuard>
  );
}
