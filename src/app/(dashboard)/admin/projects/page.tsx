"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProjectsPage } from "@/components/ProjectsPage";
import { useRouter } from "next/navigation";

export default function AdminProjectsPage() {
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    router.push(`/admin/projects/${projectId}`);
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <ProjectsPage
        onProjectSelect={handleProjectSelect}
        projectsBasePath="/admin/projects"
      />
    </RoleGuard>
  );
}
