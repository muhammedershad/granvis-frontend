import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function EmployeeDashboard() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.EMPLOYEE, IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN, IAuthRoles.MANAGER]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Assigned Tasks</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Completed Tasks</h3>
            <p className="text-2xl font-bold mt-2">24</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
