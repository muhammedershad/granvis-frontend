import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function EmployeeManagement() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
        <p className="text-muted-foreground">Manage firm employees here.</p>
        {/* Placeholder for Employee Table/List */}
        <div className="mt-8 border rounded-lg p-12 text-center bg-card">
            <p>Employee list component will be here.</p>
        </div>
      </div>
    </RoleGuard>
  );
}
