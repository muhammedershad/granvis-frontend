"use client";

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddEmployeeForm } from "@/components/AddEmployeeForm";

export default function NewEmployeePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/super-admin/employees");
  };

  const handleCancel = () => {
    router.push("/super-admin/employees");
  };

  return (
    <RoleGuard
      allowedRoles={[IAuthRoles.SUPER_ADMIN]}
    >
      <div className="container mx-auto py-8">
        <AddEmployeeForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </RoleGuard>
  );
}
