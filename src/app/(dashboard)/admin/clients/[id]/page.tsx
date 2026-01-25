import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ClientDetailsPage } from "@/components/clients";

export default function AdminClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <ClientDetailsPage clientId={params.id} />
    </RoleGuard>
  );
}
