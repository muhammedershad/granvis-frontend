"use client";

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddClientForm } from "@/components/AddClientForm";

export default function NewClientPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/clients");
  };

  const handleCancel = () => {
    router.push("/admin/clients");
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="container mx-auto py-8">
        <AddClientForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </RoleGuard>
  );
}
