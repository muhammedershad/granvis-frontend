import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { ClientDetailsPage } from "@/components/ClientDetailsPage";

export default function SuperAdminClientDetailsPage({ params }: { params: { id: string } }) {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <ClientDetailsPage clientId={params.id} />
    </RoleGuard>
  );
}
