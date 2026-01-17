import {
  Activity,
  Building2,
  CheckCircle,
  Download,
  Edit,
  Eye,
  FileText,
  Target,
  Users,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { formatDate, getStatusColor } from "./utils";
import type { TimelineItem } from "./types";

interface TimelineItemModalProps {
  item: TimelineItem | null;
  onClose: () => void;
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

export function TimelineItemModal({ item, onClose }: TimelineItemModalProps) {
  if (!item) {
    return null;
  }

  return (
    <Dialog open={!!item} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-card/95 border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getCategoryIcon(item.category)}
            <DialogTitle className="text-foreground">{item.title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm text-muted-foreground mb-2">Description</h4>
            <p className="text-foreground">{item.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Status</h4>
              <Badge className={getStatusColor(item.status)}>
                {item.status.replace("-", " ")}
              </Badge>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Category</h4>
              <Badge variant="outline" className="bg-muted/30">
                {item.category}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">
                Assigned To
              </h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${item.assignedTo}`}
                  />
                  <AvatarFallback className="text-xs">
                    {item.assignedTo
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground text-sm">
                  {item.assignedTo}
                </span>
              </div>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">
                Assigned By
              </h4>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${item.assignedBy}`}
                  />
                  <AvatarFallback className="text-xs">
                    {item.assignedBy
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground text-sm">
                  {item.assignedBy}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">Start Date</h4>
              <p className="text-foreground">{formatDate(item.startDate)}</p>
            </div>
            <div>
              <h4 className="text-sm text-muted-foreground mb-2">
                {item.status === "completed" ? "Completed Date" : "End Date"}
              </h4>
              <p className="text-foreground">
                {item.completedDate
                  ? formatDate(item.completedDate)
                  : item.endDate
                    ? formatDate(item.endDate)
                    : "Not set"}
              </p>
            </div>
          </div>

          {item.attachments && item.attachments.length > 0 && (
            <div>
              <h4 className="text-sm text-muted-foreground mb-3">
                Attachments
              </h4>
              <div className="space-y-2">
                {item.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted/30 rounded border"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground text-sm">
                      {attachment}
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.comments && item.comments.length > 0 && (
            <div>
              <h4 className="text-sm text-muted-foreground mb-3">Comments</h4>
              <div className="space-y-3">
                {item.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-3 bg-muted/20 rounded border border-border/30"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${comment.author}`}
                      />
                      <AvatarFallback className="text-xs">
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-foreground">
                          {comment.author}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Edit className="h-4 w-4 mr-2" />
              Edit Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
