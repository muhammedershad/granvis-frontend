import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AccountantDashboard } from "@/components/AccountantDashboard";

export default function AccountantDashboardPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ACCOUNTANT, IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <AccountantDashboard />
      </div>
    </RoleGuard>
  );
}
