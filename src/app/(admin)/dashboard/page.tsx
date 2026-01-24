import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { SharedDashboard } from "@/components/SharedDashboard";

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <SharedDashboard />
      </div>
    </RoleGuard>
  );
}
