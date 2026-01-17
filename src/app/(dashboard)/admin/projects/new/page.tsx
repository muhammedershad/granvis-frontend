'use client';

import { useRouter } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddProjectForm } from "@/components/AddProjectForm";
import { useCreateProjectMutation } from "@/lib/api/projectsApi";
import { toast } from "sonner";
import { Project } from "@/types/project";

export default function NewProjectPage() {
  const router = useRouter();
  const [createProject] = useCreateProjectMutation();

  const handleCreateProject = async (newProject: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createProject(newProject).unwrap();
      toast.success("Project created successfully");
      router.push('/admin/projects');
    } catch (err) {
      console.error("Failed to create project:", err);
      const errorMessage = err && typeof err === 'object' && 'data' in err
        ? (err.data as { message?: string })?.message || "Failed to create project"
        : "Failed to create project";
      toast.error("Error creating project", {
        description: Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
      });
    }
  };

  const handleCancel = () => {
    router.push('/admin/projects');
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="container mx-auto py-8">
        <AddProjectForm 
          onSubmit={handleCreateProject} 
          onCancel={handleCancel} 
        />
      </div>
    </RoleGuard>
  );
}
