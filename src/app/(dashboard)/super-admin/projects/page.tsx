'use client';

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProjectsPage } from "@/components/ProjectsPage";
import { useRouter } from "next/navigation";

export default function SuperAdminProjectsPage() {
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    router.push(`/super-admin/projects/${projectId}`);
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <ProjectsPage onProjectSelect={handleProjectSelect} />
    </RoleGuard>
  );
}
