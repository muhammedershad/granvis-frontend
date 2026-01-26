"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import ProjectDetailsPage from "@/components/ProjectDetailsPage";
import { useParams, useRouter } from "next/navigation";

export default function ManagerProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const handleBack = () => {
    router.push("/manager/projects");
  };

  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <ProjectDetailsPage projectId={projectId} onBack={handleBack} />
    </RoleGuard>
  );
}
