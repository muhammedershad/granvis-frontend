import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";

export default function SuperAdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <SuperAdminDashboard />
    </RoleGuard>
  );
}
