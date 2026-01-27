import {
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Client } from "@/types/client";

interface SummaryCardsProps {
  client: Client;
  paymentStats: {
    totalPaid: number;
    totalPending: number;
    totalPayments: number;
    paymentCount: number;
  };
  avgSatisfaction: string;
}

export function SummaryCards({
  client,
  paymentStats,
  avgSatisfaction,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {client.activeProjects} Active
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {client.projectsCount}
            </p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>{client.completedProjects} Completed</span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-200/50 dark:border-emerald-800/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
            >
              {paymentStats.paymentCount} Payments
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              ${paymentStats.totalPayments.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Payment Value</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span>${paymentStats.totalPaid.toLocaleString()} Paid</span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-800/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-12 -mt-12" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            >
              Pending
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              ${paymentStats.totalPending.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Pending Payments</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-amber-500" />
            <span>
              {(
                (paymentStats.totalPending / paymentStats.totalPayments) *
                100
              ).toFixed(0)}
              % of Total
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-12 -mt-12" />
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            >
              Excellent
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">
              {avgSatisfaction}/5.0
            </p>
            <p className="text-sm text-muted-foreground">Avg. Satisfaction</p>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= parseFloat(avgSatisfaction)
                    ? "text-amber-500 fill-current"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
