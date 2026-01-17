'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { PaymentPage } from "@/components/PaymentPage";

export default function SuperAdminPaymentsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <PaymentPage />
    </RoleGuard>
  );
}
