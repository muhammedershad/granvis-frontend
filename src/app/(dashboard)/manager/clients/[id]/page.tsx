import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ClientDetailsPage } from "@/components/clients";

export default async function ManagerClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RoleGuard allowedRoles={[IAuthRoles.MANAGER, IAuthRoles.SUPER_ADMIN]}>
      <ClientDetailsPage clientId={id} />
    </RoleGuard>
  );
}
