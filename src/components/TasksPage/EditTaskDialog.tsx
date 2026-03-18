"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pencil } from "lucide-react";
import {
  Task,
  TaskAttachment,
  TaskMilestoneRef,
  TaskPriority,
  TaskProjectRef,
  TaskStatus,
  TaskUserRef,
} from "@/types/task";
import { UpdateTaskFormValues, updateTaskSchema } from "@/lib/validations/task";
import { AttachmentList, FileUploadArea, SelectedFile } from "./FileUploadArea";
import { DatePicker } from "@/components/ui/date-picker";
import { useEffect, useState } from "react";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSubmit: (
    taskId: string,
    data: UpdateTaskFormValues,
    newAttachments: TaskAttachment[]
  ) => void;
  employeeView?: boolean;
  projects: TaskProjectRef[];
  teamMembers: TaskUserRef[];
  milestones?: TaskMilestoneRef[];
}

export function EditTaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  employeeView = false,
  projects,
  teamMembers,
  milestones = [],
}: EditTaskDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFiles, setNewFiles] = useState<SelectedFile[]>([]);

  const form = useForm<UpdateTaskFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zodResolver type compatibility with react-hook-form
    resolver: zodResolver(updateTaskSchema) as any,
  });

  useEffect(() => {
    if (task && open) {
      setNewFiles([]);
      form.reset({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo._id,
        project: task.project._id,
        milestone: task.milestone?._id,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : undefined,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
      });
    }
  }, [task, open, form]);

  const handleSubmit = async (data: UpdateTaskFormValues) => {
    if (!task) {
      return;
    }
    setIsSubmitting(true);
    const attachments: TaskAttachment[] = newFiles.map((f) => ({
      id: f.id,
      name: f.file.name,
      url: f.preview || URL.createObjectURL(f.file),
      type: f.file.type,
      size: f.file.size,
      uploadedBy: "u1",
      uploadedAt: new Date().toISOString(),
    }));
    onSubmit(task._id, data, attachments);
    setNewFiles([]);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!task) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[calc(100%-2rem)] sm:max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col backdrop-blur-xl bg-white/95 dark:bg-black/95">
        {/* Header - pinned */}
        <div className="relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-white/5 dark:to-white/10 border-b border-purple-100/50 dark:border-white/10 flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none" />
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
              <Pencil className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {employeeView ? "Update Task" : "Edit Task"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {employeeView
                  ? "Update your progress on this task."
                  : "Modify the task details below."}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <form
          id="edit-task-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar"
        >
          <div className="space-y-4 bg-white dark:bg-black/40 p-3 sm:p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                {...form.register("title")}
                className="bg-white/50 dark:bg-white/5"
                disabled={employeeView}
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={3}
                {...form.register("description")}
                className="bg-white/50 dark:bg-white/5"
                disabled={employeeView}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project (disabled in edit) */}
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={form.watch("project") || ""}
                  onValueChange={(v) => {
                    form.setValue("project", v);
                    form.setValue("milestone", "");
                  }}
                  disabled={employeeView}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-white/5">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee */}
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select
                  value={form.watch("assignedTo") || ""}
                  onValueChange={(v) => form.setValue("assignedTo", v)}
                  disabled={employeeView}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-white/5">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((m) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.firstName} {m.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Milestone */}
              <div className="space-y-2">
                <Label>Milestone</Label>
                <Select
                  value={form.watch("milestone") || ""}
                  onValueChange={(v) => form.setValue("milestone", v)}
                  disabled={employeeView || milestones.length === 0}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-white/5">
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {milestones.map((m) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={form.watch("priority") || TaskPriority.MEDIUM}
                  onValueChange={(v) =>
                    form.setValue("priority", v as TaskPriority)
                  }
                  disabled={employeeView}
                >
                  <SelectTrigger className="bg-white/50 dark:bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                    <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status (display only) */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={task.status} disabled>
                  <SelectTrigger className="bg-white/50 dark:bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                      In Progress
                    </SelectItem>
                    <SelectItem value={TaskStatus.REVIEW}>In Review</SelectItem>
                    <SelectItem value={TaskStatus.DONE}>Completed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Use the status controls on the task to change status.
                </p>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                <DatePicker
                  date={
                    form.watch("dueDate")
                      ? new Date(`${form.watch("dueDate")}T00:00:00`)
                      : undefined
                  }
                  onDateChange={(date) => {
                    form.setValue(
                      "dueDate",
                      date ? date.toISOString().split("T")[0] : undefined
                    );
                  }}
                  placeholder="Select due date"
                  fromYear={new Date().getFullYear()}
                  toYear={new Date().getFullYear() + 5}
                  disabled={employeeView}
                  className="bg-white/50 dark:bg-white/5"
                />
              </div>

              {/* Estimated Hours */}
              <div className="space-y-2">
                <Label htmlFor="edit-estimatedHours">Estimated Hours</Label>
                <Input
                  id="edit-estimatedHours"
                  type="number"
                  min="0"
                  step="0.5"
                  {...form.register("estimatedHours")}
                  className="bg-white/50 dark:bg-white/5"
                  disabled={employeeView}
                />
              </div>

              {/* Actual Hours (employee can edit) */}
              <div className="space-y-2">
                <Label htmlFor="edit-actualHours">Actual Hours</Label>
                <Input
                  id="edit-actualHours"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Log your hours"
                  {...form.register("actualHours")}
                  className="bg-white/50 dark:bg-white/5"
                />
                {form.formState.errors.actualHours && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.actualHours.message}
                  </p>
                )}
              </div>
            </div>

            {/* Existing Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Current Attachments</Label>
                <AttachmentList attachments={task.attachments} />
              </div>
            )}

            {/* Add More Attachments */}
            <div className="space-y-2">
              <Label>Add Attachments</Label>
              <FileUploadArea files={newFiles} onChange={setNewFiles} />
            </div>
          </div>
        </form>

        {/* Footer - pinned */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 dark:border-white/10 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-task-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 border-0 shadow-lg"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
