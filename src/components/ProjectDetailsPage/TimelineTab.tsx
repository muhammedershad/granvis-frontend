import {
  Activity,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Flag,
  Plus,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { ProjectMilestone } from "@/types/project";
import type { TimelineItem } from "./types";

interface TimelineTabProps {
  milestones: ProjectMilestone[];
  onSelectItem: (item: TimelineItem) => void;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "N/A";
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getMilestoneStatus = (milestone: ProjectMilestone) => {
  if (milestone.completed) {
    return "completed";
  }
  const dueDate = new Date(milestone.dueDate);
  const now = new Date();
  if (dueDate < now) {
    return "overdue";
  }
  return "pending";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800";
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case "overdue":
      return <Clock className="h-4 w-4 text-red-600" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export function TimelineTab({ milestones, onSelectItem }: TimelineTabProps) {
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const handleMilestoneClick = (milestone: ProjectMilestone) => {
    const status = getMilestoneStatus(milestone);
    const timelineItem: TimelineItem = {
      id: milestone.id,
      title: milestone.title,
      description: milestone.description,
      status: status === "overdue" ? "pending" : status,
      assignedTo: "",
      assignedBy: "",
      startDate: milestone.dueDate,
      endDate: milestone.completedDate,
      category: "milestone" as TimelineItem["category"],
    };
    onSelectItem(timelineItem);
  };

  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-foreground">
              Project Milestones
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
        {sortedMilestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Flag className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No milestones yet</p>
            <p className="text-sm">Add milestones to track project progress</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedMilestones.map((milestone, index) => {
              const status = getMilestoneStatus(milestone);
              return (
                <div key={milestone.id} className="relative">
                  {index !== sortedMilestones.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-px bg-border"></div>
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                        milestone.completed
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : status === "overdue"
                            ? "bg-red-500/10 border-red-500/30"
                            : "bg-muted/30 border-border"
                      }`}
                    >
                      {milestone.completed ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Target className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => handleMilestoneClick(milestone)}
                    >
                      <Card className="hover:shadow-md transition-shadow border-border/50 hover:border-border bg-card/30 hover:bg-card/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-foreground font-medium">
                                  {milestone.title}
                                </h4>
                                <Badge
                                  className={`${getStatusColor(status)} text-xs`}
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {milestone.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    Due: {formatDate(milestone.dueDate)}
                                  </span>
                                </div>
                                {milestone.completed &&
                                  milestone.completedDate && (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                                      <span>
                                        Completed:{" "}
                                        {formatDate(milestone.completedDate)}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
