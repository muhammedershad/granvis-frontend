import { Card } from "../ui/card";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  UserX,
  Users,
} from "lucide-react";

interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
}

interface EmployeeStatsCardsProps {
  stats: EmployeeStats;
}

export function EmployeeStatsCards({ stats }: EmployeeStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-purple-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Employees</p>
            <p className="text-foreground text-2xl">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 to-emerald-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 shadow-lg shadow-green-200/50 dark:shadow-green-500/20">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Active</p>
            <p className="text-foreground text-2xl">{stats.active}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/60 to-orange-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-500/20">
            <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">On Leave</p>
            <p className="text-foreground text-2xl">{stats.onLeave}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/60 to-slate-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-gray-500/20 rounded-xl border border-gray-500/30 shadow-lg shadow-gray-200/50 dark:shadow-gray-500/20">
            <AlertCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Inactive</p>
            <p className="text-foreground text-2xl">{stats.inactive}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 to-rose-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 shadow-lg shadow-red-200/50 dark:shadow-red-500/20">
            <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Terminated</p>
            <p className="text-foreground text-2xl">{stats.terminated}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
