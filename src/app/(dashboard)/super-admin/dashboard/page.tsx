import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function SuperAdminDashboard() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Total Revenue</h3>
            <p className="text-2xl font-bold mt-2">₹45,231,895</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Active Projects</h3>
            <p className="text-2xl font-bold mt-2">24</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Clients</h3>
            <p className="text-2xl font-bold mt-2">126</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Employees</h3>
            <p className="text-2xl font-bold mt-2">45</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
