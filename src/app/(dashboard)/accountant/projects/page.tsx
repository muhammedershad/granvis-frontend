"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProjectsPage } from "@/components/ProjectsPage";
import { useRouter } from "next/navigation";

export default function AccountantProjectsPage() {
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    router.push(`/accountant/projects/${projectId}`);
  };

  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.ACCOUNTANT,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <ProjectsPage
        onProjectSelect={handleProjectSelect}
        projectsBasePath="/accountant/projects"
      />
    </RoleGuard>
  );
}
