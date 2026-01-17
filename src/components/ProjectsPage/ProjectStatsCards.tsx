import { Card } from "../ui/card";
import {
  Building2,
  CheckCircle,
  DollarSign,
  Pause,
  TrendingUp,
} from "lucide-react";

interface ProjectStats {
  total: number;
  inProgress: number;
  completed: number;
  onHold: number;
  totalBudget: number;
  avgProgress: number;
}

interface ProjectStatsCardsProps {
  stats: ProjectStats;
}

export function ProjectStatsCards({ stats }: ProjectStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/60 to-blue-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-200/50 dark:shadow-cyan-500/20">
            <DollarSign className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Budget</p>
            <p className="text-foreground text-xl">
              ${(stats.totalBudget / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/60 to-purple-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-lg shadow-indigo-200/50 dark:shadow-indigo-500/20">
            <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Avg Progress</p>
            <p className="text-foreground text-2xl">{stats.avgProgress}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
