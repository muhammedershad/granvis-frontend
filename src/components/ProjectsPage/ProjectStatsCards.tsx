import { Card } from "../ui/card";
import {
  Building2,
  CheckCircle,
  Clock,
  Pause,
  TrendingUp,
  XCircle,
} from "lucide-react";

interface ProjectStats {
  total: number;
  planning: number;
  inProgress: number;
  completed: number;
  onHold: number;
  cancelled: number;
}

interface ProjectStatsCardsProps {
  stats: ProjectStats;
}

export function ProjectStatsCards({ stats }: ProjectStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Projects</p>
            <p className="text-foreground text-2xl">{stats.total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/60 to-gray-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-gray-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-slate-500/20 rounded-xl border border-slate-500/30 shadow-lg shadow-slate-200/50 dark:shadow-slate-500/20">
            <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Planning</p>
            <p className="text-foreground text-2xl">{stats.planning}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 to-emerald-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 shadow-lg shadow-green-200/50 dark:shadow-green-500/20">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">In Progress</p>
            <p className="text-foreground text-2xl">{stats.inProgress}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/60 to-orange-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-500/20">
            <Pause className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">On Hold</p>
            <p className="text-foreground text-2xl">{stats.onHold}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-pink-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
            <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Completed</p>
            <p className="text-foreground text-2xl">{stats.completed}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 to-rose-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 shadow-lg shadow-red-200/50 dark:shadow-red-500/20">
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Cancelled</p>
            <p className="text-foreground text-2xl">{stats.cancelled}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
