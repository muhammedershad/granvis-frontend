"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddProjectForm } from "@/components/AddProjectForm";
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "@/lib/api/projectsApi";
import { toast } from "sonner";
import { Project } from "@/types/project";
import { Card } from "@/components/ui/card";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [updateProject] = useUpdateProjectMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  const handleUpdateProject = async (
    updatedProject: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    setIsSubmitting(true);
    try {
      await updateProject({
        id: projectId,
        data: updatedProject,
      }).unwrap();
      toast.success("Project updated successfully", {
        description: "Redirecting to project details...",
      });
      setTimeout(() => {
        router.push(`/super-admin/projects/${projectId}`);
      }, 1000);
    } catch (err) {
      console.error("Failed to update project:", err);
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err.data as { message?: string })?.message ||
            "Failed to update project"
          : "Failed to update project";
      toast.error("Error updating project", {
        description: Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/super-admin/projects/${projectId}`);
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-3 text-lg text-muted-foreground">
              Loading project...
            </span>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error || !project) {
    return (
      <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
        <div className="container mx-auto py-8">
          <Card className="backdrop-blur-xl bg-red-50/70 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-8">
            <div className="flex items-center justify-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-6 h-6" />
              <p className="text-lg font-medium">
                Failed to load project. Please try again later.
              </p>
            </div>
          </Card>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <div className="container mx-auto py-8">
        <AddProjectForm
          onSubmit={handleUpdateProject}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          initialData={project}
          mode="edit"
        />
      </div>
    </RoleGuard>
  );
}
