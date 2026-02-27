import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  DollarSign,
  Flag,
  MapPin,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import type { Project } from "@/types/project";
import { useGetMilestonesByProjectQuery } from "@/lib/api/milestonesApi";
import {
  Milestone,
  MilestonePaymentStatus,
  MilestoneStatus,
} from "@/types/milestone";

interface ScheduleTabProps {
  project: Project;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "N/A";
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getDaysUntil = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

const getPaymentStatusColor = (status: MilestonePaymentStatus) => {
  switch (status) {
    case MilestonePaymentStatus.PAID:
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400";
    case MilestonePaymentStatus.PARTIALLY_PAID:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
    case MilestonePaymentStatus.UNPAID:
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
  }
};

const getStatusColor = (status: MilestoneStatus) => {
  switch (status) {
    case MilestoneStatus.COMPLETED:
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
    case MilestoneStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
    case MilestoneStatus.NOT_STARTED:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export function ScheduleTab({ project }: ScheduleTabProps) {
  const { data: milestones = [] } = useGetMilestonesByProjectQuery(project.id);

  const upcomingMilestones = milestones
    .filter((m: Milestone) => m.status !== MilestoneStatus.COMPLETED)
    .sort((a: Milestone, b: Milestone) => {
      if (!a.dueDate) {
        return 1;
      }
      if (!b.dueDate) {
        return -1;
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const completedMilestones = milestones.filter(
    (m: Milestone) => m.status === MilestoneStatus.COMPLETED
  );

  return (
    <div className="space-y-6">
      {/* Project Timeline Overview */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">Project Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <Flag className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Project Started</p>
                <p className="text-foreground font-medium">
                  {formatDate(project.startDate)}
                </p>
              </div>
            </div>

            {/* End Date */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <Target className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Target Completion
                </p>
                <p className="text-foreground font-medium">
                  {formatDate(project.endDate)}
                </p>
                {project.endDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {getDaysUntil(project.endDate) > 0 &&
                      `${getDaysUntil(project.endDate)} days remaining`}
                    {getDaysUntil(project.endDate) === 0 && "Due today"}
                    {getDaysUntil(project.endDate) < 0 &&
                      `${Math.abs(getDaysUntil(project.endDate))} days overdue`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Project Location
                </p>
                <p className="text-foreground font-medium">
                  {project.location.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.location.city}, {project.location.state}
                  {project.location.country && `, ${project.location.country}`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Milestones */}
      <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-cyan-500/[0.02] dark:from-blue-400/[0.05] dark:to-cyan-400/[0.05]"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-foreground">
                Upcoming Milestones ({upcomingMilestones.length})
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {upcomingMilestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">All milestones completed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMilestones.map((milestone: Milestone) => {
                const daysUntil = milestone.dueDate
                  ? getDaysUntil(milestone.dueDate)
                  : null;
                const isOverdue = daysUntil !== null && daysUntil < 0;
                return (
                  <Card
                    key={milestone.id}
                    className="border-border/50 bg-card/30"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <div
                              className={`p-1.5 rounded border flex-shrink-0 ${
                                isOverdue
                                  ? "bg-red-500/10 border-red-500/20"
                                  : "bg-blue-500/10 border-blue-500/20"
                              }`}
                            >
                              <Target
                                className={`h-4 w-4 ${
                                  isOverdue ? "text-red-600" : "text-blue-600"
                                }`}
                              />
                            </div>
                            <h4 className="text-foreground font-medium truncate">
                              {milestone.title}
                            </h4>
                            <Badge
                              variant="outline"
                              className={getStatusColor(milestone.status)}
                            >
                              {milestone.status === MilestoneStatus.IN_PROGRESS
                                ? "In Progress"
                                : "Not Started"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getPaymentStatusColor(
                                milestone.paymentStatus
                              )}
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              {milestone.paymentStatus ===
                                MilestonePaymentStatus.PAID && "Paid"}
                              {milestone.paymentStatus ===
                                MilestonePaymentStatus.PARTIALLY_PAID &&
                                "Partially Paid"}
                              {milestone.paymentStatus ===
                                MilestonePaymentStatus.UNPAID && "Unpaid"}
                            </Badge>
                          </div>

                          {milestone.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {milestone.description}
                            </p>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp className="h-4 w-4" />
                                <span>Progress</span>
                              </div>
                              <span className="font-semibold">
                                {milestone.progressPercentage}%
                              </span>
                            </div>
                            <Progress
                              value={milestone.progressPercentage}
                              className="h-1.5"
                            />
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 flex-wrap">
                            {milestone.dueDate && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Due: {formatDate(milestone.dueDate)}
                                  {daysUntil !== null &&
                                    isOverdue &&
                                    ` (${Math.abs(daysUntil)} days overdue)`}
                                  {daysUntil !== null &&
                                    !isOverdue &&
                                    daysUntil === 0 &&
                                    " (Due today)"}
                                  {daysUntil !== null &&
                                    !isOverdue &&
                                    daysUntil !== 0 &&
                                    ` (${daysUntil} days left)`}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              <span>
                                Amount: {formatCurrency(milestone.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Milestones */}
      {completedMilestones.length > 0 && (
        <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-green-500/[0.02] dark:from-emerald-400/[0.05] dark:to-green-400/[0.05]"></div>
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-foreground">
                Completed Milestones ({completedMilestones.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-4">
              {completedMilestones.map((milestone: Milestone) => (
                <Card
                  key={milestone.id}
                  className="border-border/50 bg-card/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-emerald-500/10 rounded border border-emerald-500/20 flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-foreground font-medium">
                            {milestone.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getPaymentStatusColor(
                              milestone.paymentStatus
                            )}
                          >
                            <DollarSign className="h-3 w-3 mr-1" />
                            {milestone.paymentStatus ===
                              MilestonePaymentStatus.PAID && "Paid"}
                            {milestone.paymentStatus ===
                              MilestonePaymentStatus.PARTIALLY_PAID &&
                              "Partially Paid"}
                            {milestone.paymentStatus ===
                              MilestonePaymentStatus.UNPAID && "Unpaid"}
                          </Badge>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {milestone.description}
                          </p>
                        )}
                        {milestone.completedDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Completed on {formatDate(milestone.completedDate)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Amount: {formatCurrency(milestone.totalAmount)} •
                          Paid: {formatCurrency(milestone.paidAmount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
