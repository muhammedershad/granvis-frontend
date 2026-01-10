import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function ManagerDashboard() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.MANAGER, IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">My Projects</h3>
            <p className="text-2xl font-bold mt-2">8</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Team Tasks</h3>
            <p className="text-2xl font-bold mt-2">14/20 Done</p>
          </div>
           <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Upcoming Deadlines</h3>
            <p className="text-2xl font-bold mt-2">3</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
