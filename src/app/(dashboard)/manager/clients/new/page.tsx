"use client";

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddClientForm } from "@/components/clients";

export default function NewClientPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/manager/clients");
  };

  const handleCancel = () => {
    router.push("/manager/clients");
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.MANAGER]}>
      <div className="container mx-auto py-8">
        <AddClientForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </RoleGuard>
  );
}
