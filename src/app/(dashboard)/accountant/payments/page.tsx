import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";

export default function PaymentManagement() {
  return (
    <RoleGuard
      allowedRoles={[
        IAuthRoles.ACCOUNTANT,
        IAuthRoles.ADMIN,
        IAuthRoles.SUPER_ADMIN,
      ]}
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Payment Management</h1>
        <p className="text-muted-foreground">
          Manage invoices, payments, and expenses.
        </p>
        {/* Placeholder for Payment Table/List */}
        <div className="mt-8 border rounded-lg p-12 text-center bg-card">
          <p>Payment tracking component will be here.</p>
        </div>
      </div>
    </RoleGuard>
  );
}
