"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { CreateInvoicePage } from "@/components/ProjectDetailsPage/CreateInvoicePage";
import { useParams } from "next/navigation";

export default function EmployeeCreateInvoicePage() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <RoleGuard allowedRoles={[IAuthRoles.EMPLOYEE]}>
      <CreateInvoicePage projectId={projectId} basePath="/employee/projects" />
    </RoleGuard>
  );
}
