"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { InvoicePreviewPage } from "@/components/ProjectDetailsPage/InvoicePreviewPage";
import { useParams } from "next/navigation";

export default function SuperAdminInvoicePreviewPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <InvoicePreviewPage
        projectId={projectId}
        basePath="/super-admin/projects"
      />
    </RoleGuard>
  );
}
