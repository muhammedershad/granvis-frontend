import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { EmployeeDashboard } from "@/components/EmployeeDashboard";

export default function EmployeeDashboardPage() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.EMPLOYEE,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
        IAuthRoles.MANAGER,
      ]}
    >
      <EmployeeDashboard />
    </RoleGuard>
  );
}
