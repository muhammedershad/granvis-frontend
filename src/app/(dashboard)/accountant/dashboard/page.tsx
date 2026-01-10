import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function AccountantDashboard() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.ACCOUNTANT, IAuthRoles.ADMIN, IAuthRoles.SUPER_ADMIN]}>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Accountant Dashboard</h1>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Pending Invoices</h3>
            <p className="text-2xl font-bold mt-2">12</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">This Month Revenue</h3>
            <p className="text-2xl font-bold mt-2">₹12,50,000</p>
          </div>
           <div className="p-6 bg-card rounded-lg shadow border">
            <h3 className="font-semibold text-lg">Expenses</h3>
            <p className="text-2xl font-bold mt-2">₹3,20,000</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
