"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { CreateInvoicePage } from "@/components/ProjectDetailsPage/CreateInvoicePage";
import { useParams } from "next/navigation";

export default function SuperAdminCreateInvoicePage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <CreateInvoicePage
        projectId={projectId}
        basePath="/super-admin/projects"
      />
    </RoleGuard>
  );
}
