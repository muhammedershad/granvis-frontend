"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProjectsPage } from "@/components/ProjectsPage";
import { useRouter } from "next/navigation";

export default function ManagerProjectsPage() {
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    router.push(`/manager/projects/${projectId}`);
  };

  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <ProjectsPage
        onProjectSelect={handleProjectSelect}
        projectsBasePath="/manager/projects"
      />
    </RoleGuard>
  );
}
