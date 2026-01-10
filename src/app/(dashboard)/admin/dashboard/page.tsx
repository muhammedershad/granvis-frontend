import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminDashboardPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
        <AdminDashboard />
    </RoleGuard>
  );
}
