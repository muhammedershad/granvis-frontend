'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import ProjectDetailsPage from "@/components/ProjectDetailsPage";
import { useRouter, useParams } from "next/navigation";

export default function SuperAdminProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const handleBack = () => {
    router.push('/super-admin/projects');
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <ProjectDetailsPage projectId={projectId} onBack={handleBack} />
    </RoleGuard>
  );
}
