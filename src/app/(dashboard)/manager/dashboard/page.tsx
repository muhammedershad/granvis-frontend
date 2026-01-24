import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ManagerDashboard } from "@/components/ManagerDashboard";

export default function ManagerDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.MANAGER,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <ManagerDashboard />
    </RoleGuard>
  );
}
