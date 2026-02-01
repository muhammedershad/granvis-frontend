import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { EmployeeDetailsPage } from "@/components/EmployeeDetailsPage";

export default function AdminEmployeeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <EmployeeDetailsPage employeeId={params.id} />
    </RoleGuard>
  );
}
