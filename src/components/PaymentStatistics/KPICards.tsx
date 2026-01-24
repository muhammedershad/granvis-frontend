import {
  AlertCircle,
  BarChart3,
  Clock,
  DollarSign,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { KPIData } from "./types";
import { formatCurrency, formatPercentage, getTrendColor } from "./utils";

interface KPICardsProps {
  data: KPIData;
}

export function KPICards({ data }: KPICardsProps) {
  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="relative bg-gradient-to-br from-white/50 to-green-50/50 dark:from-gray-900/50 dark:to-green-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-green-500/5 dark:shadow-green-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl text-foreground">
                {formatCurrency(data.totalRevenue.current)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <div
            className={`mt-4 flex items-center text-sm ${getTrendColor(data.totalRevenue.trend)}`}
          >
            {getTrendIcon(data.totalRevenue.trend)}
            <span className="ml-1">
              {formatPercentage(data.totalRevenue.change)} vs previous period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative bg-gradient-to-br from-white/50 to-blue-50/50 dark:from-gray-900/50 dark:to-blue-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-blue-500/5 dark:shadow-blue-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Invoice Value</p>
              <p className="text-2xl text-foreground">
                {formatCurrency(data.averageInvoiceValue.current)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
          <div
            className={`mt-4 flex items-center text-sm ${getTrendColor(data.averageInvoiceValue.trend)}`}
          >
            {getTrendIcon(data.averageInvoiceValue.trend)}
            <span className="ml-1">
              {formatPercentage(data.averageInvoiceValue.change)} vs previous
              period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-900/50 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-purple-500/5 dark:shadow-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Payment Cycle Time
              </p>
              <p className="text-2xl text-foreground">
                {data.paymentCycleTime.current} days
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <div
            className={`mt-4 flex items-center text-sm ${getTrendColor(data.paymentCycleTime.trend, false)}`}
          >
            {getTrendIcon(data.paymentCycleTime.trend)}
            <span className="ml-1">
              {formatPercentage(Math.abs(data.paymentCycleTime.change))} vs
              previous period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative bg-gradient-to-br from-white/50 to-cyan-50/50 dark:from-gray-900/50 dark:to-cyan-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-cyan-500/5 dark:shadow-cyan-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl text-foreground">
                {formatPercentage(data.collectionRate.current)}
              </p>
            </div>
            <Target className="w-8 h-8 text-cyan-500" />
          </div>
          <div
            className={`mt-4 flex items-center text-sm ${getTrendColor(data.collectionRate.trend)}`}
          >
            {getTrendIcon(data.collectionRate.trend)}
            <span className="ml-1">
              {formatPercentage(data.collectionRate.change)} vs previous period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative bg-gradient-to-br from-white/50 to-orange-50/50 dark:from-gray-900/50 dark:to-orange-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-orange-500/5 dark:shadow-orange-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overdue Rate</p>
              <p className="text-2xl text-foreground">
                {formatPercentage(data.overdueRate.current)}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
          <div
            className={`mt-4 flex items-center text-sm ${getTrendColor(data.overdueRate.trend, false)}`}
          >
            {getTrendIcon(data.overdueRate.trend)}
            <span className="ml-1">
              {formatPercentage(Math.abs(data.overdueRate.change))} vs previous
              period
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="relative bg-gradient-to-br from-white/50 to-red-50/50 dark:from-gray-900/50 dark:to-red-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-lg shadow-red-500/5 dark:shadow-red-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dispute Rate</p>
              <p className="text-2xl text-foreground">
                {formatPercentage(data.disputeRate.current)}
              </p>
            </div>
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <div
            className={`mt-4 flex items-center text-sm ${getTrendColor(data.disputeRate.trend, false)}`}
          >
            {getTrendIcon(data.disputeRate.trend)}
            <span className="ml-1">
              {formatPercentage(Math.abs(data.disputeRate.change))} vs previous
              period
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
