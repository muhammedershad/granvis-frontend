"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { InvoicePreviewPage } from "@/components/ProjectDetailsPage/InvoicePreviewPage";
import { useParams } from "next/navigation";

export default function AdminInvoicePreviewPage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN]}>
      <InvoicePreviewPage projectId={projectId} basePath="/admin/projects" />
    </RoleGuard>
  );
}
