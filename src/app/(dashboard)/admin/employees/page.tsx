import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function EmployeeManagement() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <EmployeeManagement />
    </RoleGuard>
  );
}
