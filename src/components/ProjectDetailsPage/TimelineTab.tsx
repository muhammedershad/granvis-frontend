import {
  Activity,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Plus,
  Target,
  User,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDate, getStatusColor } from "./utils";
import type { TimelineItem } from "./types";

interface TimelineTabProps {
  timeline: TimelineItem[];
  onSelectItem: (item: TimelineItem) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "design":
      return <FileText className="h-4 w-4" />;
    case "construction":
      return <Building2 className="h-4 w-4" />;
    case "approval":
      return <CheckCircle className="h-4 w-4" />;
    case "meeting":
      return <Users className="h-4 w-4" />;
    case "review":
      return <Eye className="h-4 w-4" />;
    case "delivery":
      return <Target className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case "in-progress":
      return <Activity className="h-4 w-4 text-blue-600 animate-pulse" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case "cancelled":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export function TimelineTab({ timeline, onSelectItem }: TimelineTabProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] dark:from-blue-400/[0.05] dark:to-purple-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-foreground">Project Timeline</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <div key={item.id} className="relative">
              {index !== timeline.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-px bg-border"></div>
              )}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted/30 border-2 border-border">
                  {getCategoryIcon(item.category)}
                </div>
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => onSelectItem(item)}
                >
                  <Card className="hover:shadow-md transition-shadow border-border/50 hover:border-border bg-card/30 hover:bg-card/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-foreground">{item.title}</h4>
                            <Badge
                              className={`${getStatusColor(item.status)} text-xs`}
                            >
                              {item.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{item.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(item.startDate)}</span>
                              {item.endDate && (
                                <span> - {formatDate(item.endDate)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
