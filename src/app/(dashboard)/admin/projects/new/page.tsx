"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AddProjectForm } from "@/components/AddProjectForm";
import { useCreateProjectMutation } from "@/lib/api/projectsApi";
import { useGetClientByIdQuery } from "@/lib/api/clientsApi";
import { toast } from "sonner";
import { Project } from "@/types/project";

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const [createProject] = useCreateProjectMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: preSelectedClient } = useGetClientByIdQuery(clientId ?? "", {
    skip: !clientId,
  });

  const handleCreateProject = async (
    newProject: Omit<Project, "id" | "createdAt" | "updatedAt">
  ) => {
    setIsSubmitting(true);
    try {
      await createProject(newProject).unwrap();
      toast.success("Project created successfully", {
        description: "Redirecting to projects list...",
      });
      // Small delay to let user see the success message
      setTimeout(() => {
        router.push("/admin/projects");
      }, 1000);
    } catch (err) {
      console.error("Failed to create project:", err);
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err.data as { message?: string })?.message ||
            "Failed to create project"
          : "Failed to create project";
      toast.error("Error creating project", {
        description: Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/projects");
  };

  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="container mx-auto py-8">
        <AddProjectForm
          onSubmit={handleCreateProject}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          preSelectedClient={preSelectedClient}
        />
      </div>
    </RoleGuard>
  );
}
