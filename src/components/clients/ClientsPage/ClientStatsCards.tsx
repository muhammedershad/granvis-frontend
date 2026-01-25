import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  Star,
  Users,
} from "lucide-react";

interface ClientStats {
  total: number;
  active: number;
  potential: number;
  vip: number;
  low: number;
  medium: number;
  high: number;
}

interface ClientStatsCardsProps {
  stats: ClientStats;
}

export function ClientStatsCards({ stats }: ClientStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-purple-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-200/50 dark:shadow-blue-500/20">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Clients</p>
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
            <p className="text-muted-foreground text-sm">Active Clients</p>
            <p className="text-foreground text-2xl">{stats.active}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 to-pink-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-lg shadow-purple-200/50 dark:shadow-purple-500/20">
            <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">VIP Clients</p>
            <p className="text-foreground text-2xl">{stats.vip}</p>
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
            <p className="text-muted-foreground text-sm">Potential</p>
            <p className="text-foreground text-2xl">{stats.potential}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/60 to-green-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/20">
            <ArrowDown className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Low Priority</p>
            <p className="text-foreground text-2xl">{stats.low}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/60 to-amber-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30 shadow-lg shadow-orange-200/50 dark:shadow-orange-500/20">
            <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Medium Priority</p>
            <p className="text-foreground text-2xl">{stats.medium}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 to-rose-50/40 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-rose-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center space-x-3">
          <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 shadow-lg shadow-red-200/50 dark:shadow-red-500/20">
            <ArrowUp className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">High Priority</p>
            <p className="text-foreground text-2xl">{stats.high}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
