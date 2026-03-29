import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { EmployeeDetailsPage } from "@/components/EmployeeDetailsPage";

export default async function SuperAdminEmployeeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <EmployeeDetailsPage employeeId={id} />
    </RoleGuard>
  );
}
