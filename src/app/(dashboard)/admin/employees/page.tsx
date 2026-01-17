"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { EmployeesPage } from "@/components/EmployeesPage";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function EmployeeManagement() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <EmployeesPage />
    </RoleGuard>
  );
}
