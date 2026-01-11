'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { PaymentPage } from "@/components/PaymentPage";

export default function AdminPaymentsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <PaymentPage />
    </RoleGuard>
  );
}
