import {
  Activity,
  Calendar,
  CheckCircle,
  Eye,
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
  Target,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDateTime, getStatusColor } from "./utils";
import type { ScheduleItem } from "./types";

interface ScheduleTabProps {
  schedule: ScheduleItem[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "meeting":
      return <Users className="h-4 w-4" />;
    case "task":
      return <Activity className="h-4 w-4" />;
    case "milestone":
      return <Target className="h-4 w-4" />;
    case "review":
      return <Eye className="h-4 w-4" />;
    case "deadline":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function ScheduleTab({ schedule }: ScheduleTabProps) {
  return (
    <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-indigo-500/[0.02] dark:from-purple-400/[0.05] dark:to-indigo-400/[0.05]"></div>
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle className="text-foreground">Upcoming Schedule</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          {schedule.map((item) => (
            <Card key={item.id} className="border-border/50 bg-card/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-1.5 bg-purple-500/10 rounded border border-purple-500/20">
                        {getCategoryIcon(item.type)}
                      </div>
                      <h4 className="text-foreground">{item.title}</h4>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDateTime(item.startDate)}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      {item.attendees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{item.attendees.length} attendees</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Event</DropdownMenuItem>
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
