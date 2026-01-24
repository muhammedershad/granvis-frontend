import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function ProjectManagement() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Project Management</h1>
        <p className="text-muted-foreground">
          Manage assigned projects and tasks.
        </p>
        {/* Placeholder for Project Table/List */}
        <div className="mt-8 border rounded-lg p-12 text-center bg-card">
          <p>Project list for managers will be here.</p>
        </div>
      </div>
    </RoleGuard>
  );
}
