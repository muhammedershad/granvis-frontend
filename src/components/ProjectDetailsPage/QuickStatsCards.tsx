import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import type { Project } from "@/types/project";

interface QuickStatsCardsProps {
  project: Project;
}

const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function QuickStatsCards({ project }: QuickStatsCardsProps) {
  const endDate = project.endDate ? new Date(project.endDate) : null;
  const daysLeft = endDate
    ? Math.ceil(
        (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
        <CardContent className="relative p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-xl text-foreground">
                {project.progressPercentage ?? 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
        <CardContent className="relative p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget Spent</p>
              <p className="text-xl text-foreground">
                {project.spentAmount
                  ? formatCurrency(project.spentAmount)
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
        <CardContent className="relative p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days Left</p>
              <p className="text-xl text-foreground">
                {daysLeft !== null
                  ? daysLeft > 0
                    ? daysLeft
                    : "Overdue"
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-orange-500/[0.02] dark:from-amber-400/[0.05] dark:to-orange-400/[0.05]"></div>
        <CardContent className="relative p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Size</p>
              <p className="text-xl text-foreground">
                {project.teamMembers.length + 1}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
