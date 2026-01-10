import RoleGuard from "@/components/auth/RoleGuard";
import { IAuthRoles } from "@/store/slices/authSlice";
import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function SuperAdminPaymentsPage() {
  return (
    <RoleGuard allowedRoles={[IAuthRoles.SUPER_ADMIN]}>
      <div className="space-y-6">
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 p-6 relative overflow-hidden shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-cyan-50/80 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payments</h1>
              <p className="text-muted-foreground">Manage all financial transactions</p>
            </div>
          </div>
        </Card>
      </div>
    </RoleGuard>
  );
}
