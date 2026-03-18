"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  FolderOpen,
  History,
  Milestone,
  Paperclip,
  Pencil,
  Send,
  Timer,
  Trash2,
  User,
} from "lucide-react";
import { Task, TaskAttachment, TaskComment, TaskStatus } from "@/types/task";
import { TaskHistory } from "./TaskHistory";
import { AttachButton, AttachmentList, SelectedFile } from "./FileUploadArea";
import { TaskStatusBadge, TaskStatusSelect } from "./TaskStatusSelect";
import {
  formatDueDate,
  formatRelativeDate,
  isOverdue,
  priorityConfig,
  statusProgressMap,
} from "./taskUtils";
import { cn } from "@/components/ui/utils";
import { useState } from "react";

interface TaskDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAddComment: (
    taskId: string,
    text: string,
    attachments?: TaskAttachment[]
  ) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  employeeView?: boolean;
}

const statusSteps = [
  { key: TaskStatus.TODO, label: "To Do", icon: Circle },
  { key: TaskStatus.IN_PROGRESS, label: "In Progress", icon: Timer },
  { key: TaskStatus.REVIEW, label: "Review", icon: Eye },
  { key: TaskStatus.DONE, label: "Done", icon: CheckCircle2 },
];

// eslint-disable-next-line complexity -- detail sheet renders many conditional sections
export function TaskDetailSheet({
  open,
  onOpenChange,
  task,
  onStatusChange,
  onAddComment,
  onEdit,
  onDelete,
  employeeView = false,
}: TaskDetailSheetProps) {
  const [commentText, setCommentText] = useState("");
  const [commentFiles, setCommentFiles] = useState<SelectedFile[]>([]);

  if (!task) {
    return null;
  }

  const overdue = isOverdue(task.dueDate, task.status);
  const progress = statusProgressMap[task.status];
  const pConfig = priorityConfig[task.priority];
  const statusIdx = statusSteps.findIndex((s) => s.key === task.status);

  const handleAddComment = () => {
    if (!commentText.trim() && commentFiles.length === 0) {
      return;
    }
    const attachments: TaskAttachment[] = commentFiles.map((f) => ({
      id: f.id,
      name: f.file.name,
      url: f.preview || URL.createObjectURL(f.file),
      type: f.file.type,
      size: f.file.size,
      uploadedBy: "u1",
      uploadedAt: new Date().toISOString(),
    }));
    onAddComment(
      task._id,
      commentText.trim(),
      attachments.length > 0 ? attachments : undefined
    );
    setCommentText("");
    setCommentFiles([]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] overflow-y-auto p-0"
      >
        {/* Header */}
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <TaskStatusBadge status={task.status} />
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                pConfig.bgColor,
                pConfig.textColor,
                pConfig.borderColor
              )}
            >
              {pConfig.label}
            </span>
            {overdue && (
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30">
                Overdue
              </span>
            )}
          </div>
          <SheetTitle className="text-xl leading-tight">
            {task.title}
          </SheetTitle>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>
          )}
        </SheetHeader>

        <Separator />

        <div className="p-6 space-y-6">
          {/* Status Stepper */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Progress
            </h4>
            <div className="flex items-center justify-between mb-2">
              {statusSteps.map((step, idx) => {
                const isCompleted = idx <= statusIdx;
                const Icon = step.icon;
                return (
                  <div
                    key={step.key}
                    className="flex flex-col items-center gap-1"
                  >
                    <button
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                        isCompleted
                          ? "bg-gradient-to-br from-purple-500 to-blue-500 border-purple-500 text-white"
                          : "border-gray-300 dark:border-gray-600 text-muted-foreground"
                      )}
                      onClick={() => onStatusChange(task._id, step.key)}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                    <span
                      className={cn(
                        "text-[10px]",
                        isCompleted
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Status Select */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Change Status</span>
            <TaskStatusSelect
              value={task.status}
              onChange={(status) => onStatusChange(task._id, status)}
              compact
            />
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={FolderOpen}
              label="Project"
              value={task.project.name}
            />
            <DetailItem
              icon={Milestone}
              label="Milestone"
              value={task.milestone?.title || "None"}
            />
            <DetailItem
              icon={User}
              label="Assigned To"
              value={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}
              avatar={task.assignedTo}
            />
            <DetailItem
              icon={User}
              label="Assigned By"
              value={`${task.assignedBy.firstName} ${task.assignedBy.lastName}`}
              avatar={task.assignedBy}
            />
            <DetailItem
              icon={Calendar}
              label="Due Date"
              value={task.dueDate ? formatDueDate(task.dueDate) : "No due date"}
              highlight={overdue}
            />
            <DetailItem
              icon={Calendar}
              label="Created"
              value={formatRelativeDate(task.createdAt)}
            />
          </div>

          {/* Time Tracking */}
          {(task.estimatedHours || task.actualHours) && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Time Tracking
                </h4>
                <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 border border-white/20 dark:border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Estimated
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {task.estimatedHours || 0}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Actual
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {task.actualHours || 0}h
                    </span>
                  </div>
                  {task.estimatedHours && (
                    <Progress
                      value={Math.min(
                        ((task.actualHours || 0) / task.estimatedHours) * 100,
                        100
                      )}
                      className="h-2"
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                  <Paperclip className="h-4 w-4" />
                  Attachments ({task.attachments.length})
                </h4>
                <AttachmentList attachments={task.attachments} />
              </div>
            </>
          )}

          <Separator />

          {/* Comments */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">
              Comments ({task.comments?.length || 0})
            </h4>

            {!task.comments || task.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No comments yet. Start the conversation.
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {task.comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}

            {/* Add Comment */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  rows={2}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-white/50 dark:bg-white/5 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      handleAddComment();
                    }
                  }}
                />
                <div className="flex flex-col gap-1">
                  <AttachButton
                    onFiles={(files) =>
                      setCommentFiles((prev) => [...prev, ...files])
                    }
                  />
                  <Button
                    size="icon"
                    className="shrink-0 h-8 w-8 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0"
                    onClick={handleAddComment}
                    disabled={!commentText.trim() && commentFiles.length === 0}
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {commentFiles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {commentFiles.map((f) => (
                    <span
                      key={f.id}
                      className="inline-flex items-center gap-1 text-[11px] bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-md px-2 py-0.5"
                    >
                      <Paperclip className="h-3 w-3" />
                      {f.file.name.length > 20
                        ? `${f.file.name.slice(0, 17)}...`
                        : f.file.name}
                      <button
                        type="button"
                        className="ml-0.5 hover:text-red-500"
                        onClick={() => {
                          if (f.preview) {
                            URL.revokeObjectURL(f.preview);
                          }
                          setCommentFiles((prev) =>
                            prev.filter((cf) => cf.id !== f.id)
                          );
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* History / Activity Log */}
          {task.history && task.history.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                  <History className="h-4 w-4" />
                  Activity History ({task.history.length})
                </h4>
                <TaskHistory history={task.history} />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <Separator />
        <div className="p-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4 mr-1" />
            {employeeView ? "Update" : "Edit"}
          </Button>
          {!employeeView && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
              onClick={() => onDelete(task)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  avatar,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  avatar?: { firstName: string; lastName: string };
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {avatar && (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px] bg-gradient-to-br from-purple-500 to-blue-500 text-white">
              {avatar.firstName[0]}
              {avatar.lastName[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <span
          className={cn(
            "text-sm font-medium",
            highlight ? "text-red-600 dark:text-red-400" : "text-foreground"
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function CommentItem({ comment }: { comment: TaskComment }) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
          {comment.userName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-foreground">
            {comment.userName}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        {comment.text && (
          <p className="text-sm text-muted-foreground">{comment.text}</p>
        )}
        {comment.attachments && comment.attachments.length > 0 && (
          <AttachmentList attachments={comment.attachments} compact />
        )}
      </div>
    </div>
  );
}
