import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Flag,
  MapPin,
  Plus,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { Project } from "@/types/project";

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

export function ScheduleTab({ project }: ScheduleTabProps) {
  const milestones = project.milestones || [];
  const upcomingMilestones = milestones
    .filter((m) => !m.completed)
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

  const completedMilestones = milestones.filter((m) => m.completed);

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
                    {getDaysUntil(project.endDate) > 0
                      ? `${getDaysUntil(project.endDate)} days remaining`
                      : getDaysUntil(project.endDate) === 0
                        ? "Due today"
                        : `${Math.abs(getDaysUntil(project.endDate))} days overdue`}
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
                Upcoming Milestones
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-background/50 hover:bg-muted/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          {upcomingMilestones.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">No upcoming milestones</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingMilestones.map((milestone) => {
                const daysUntil = getDaysUntil(milestone.dueDate);
                const isOverdue = daysUntil < 0;
                return (
                  <Card
                    key={milestone.id}
                    className="border-border/50 bg-card/30"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`p-1.5 rounded border ${
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
                            <h4 className="text-foreground font-medium">
                              {milestone.title}
                            </h4>
                            <Badge
                              className={
                                isOverdue
                                  ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
                              }
                            >
                              {isOverdue ? "Overdue" : "Pending"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                Due: {formatDate(milestone.dueDate)}
                                {isOverdue
                                  ? ` (${Math.abs(daysUntil)} days overdue)`
                                  : daysUntil === 0
                                    ? " (Due today)"
                                    : ` (${daysUntil} days left)`}
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
              {completedMilestones.map((milestone) => (
                <Card
                  key={milestone.id}
                  className="border-border/50 bg-card/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-foreground font-medium">
                          {milestone.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {milestone.description}
                        </p>
                        {milestone.completedDate && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Completed on {formatDate(milestone.completedDate)}
                          </p>
                        )}
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
