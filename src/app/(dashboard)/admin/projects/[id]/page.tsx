"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import ProjectDetailsPage from "@/components/ProjectDetailsPage";
import { useParams, useRouter } from "next/navigation";

export default function AdminProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const handleBack = () => {
    router.push("/admin/projects");
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <ProjectDetailsPage projectId={projectId} onBack={handleBack} />
    </RoleGuard>
  );
}
