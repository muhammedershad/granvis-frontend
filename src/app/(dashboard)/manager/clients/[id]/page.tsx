import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ClientDetailsPage } from "@/components/ClientDetailsPage";

export default function ManagerClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.MANAGER, IAuthRoles.SUPER_ADMIN]}>
      <ClientDetailsPage clientId={params.id} />
    </RoleGuard>
  );
}
