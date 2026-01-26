"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ProjectsPage } from "@/components/ProjectsPage";
import { useRouter } from "next/navigation";

export default function EmployeeProjectsPage() {
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    router.push(`/employee/projects/${projectId}`);
  };

  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.EMPLOYEE,
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <ProjectsPage
        onProjectSelect={handleProjectSelect}
        projectsBasePath="/employee/projects"
      />
    </RoleGuard>
  );
}
