import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function AdminDashboard() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Projects In Progress</h3>
            <p className="text-2xl font-bold mt-2">18</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Pending Approvals</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
             <h3 className="font-semibold text-lg">Team Performance</h3>
             <p className="text-2xl font-bold mt-2">94%</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
