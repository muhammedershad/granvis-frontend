"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";
import { Calendar, Flag, Loader2, TrendingUp, User } from "lucide-react";
import { toast } from "sonner";
import { getAuthDetails } from "@/store/slices/authSlice";
import {
  CreateMilestoneDto,
  Milestone,
  MilestoneStatus,
  UpdateMilestoneDto,
} from "@/types/milestone";
import type { Project } from "@/types/project";
import {
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
} from "@/lib/api/milestonesApi";

interface MilestoneFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  milestone?: Milestone | null;
  existingMilestones?: Milestone[];
}

const milestoneFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignedTo: z.string().optional(),
  category: z.string().optional(),
  stageNumber: z.number().int().min(1, "Stage number must be at least 1"),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  progressPercentage: z.number().min(0).max(100),
  status: z.nativeEnum(MilestoneStatus),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

export function MilestoneFormModal({
  open,
  onOpenChange,
  project,
  milestone,
  existingMilestones = [],
}: MilestoneFormModalProps) {
  const { user } = useSelector(getAuthDetails);
  const [createMilestone, { isLoading: isCreating }] =
    useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] =
    useUpdateMilestoneMutation();

  const isEditMode = !!milestone;
  const isLoading = isCreating || isUpdating;

  // Calculate next stage number
  const nextStageNumber =
    existingMilestones.length > 0
      ? Math.max(...existingMilestones.map((m) => m.stageNumber)) + 1
      : 1;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedTo: "",
      category: "",
      stageNumber: nextStageNumber,
      startDate: "",
      dueDate: "",
      progressPercentage: 0,
      status: MilestoneStatus.NOT_STARTED,
    },
  });

  // Watch form values
  const watchProgressPercentage = watch("progressPercentage");

  // Auto-update status based on progress
  useEffect(() => {
    if (watchProgressPercentage === 100) {
      setValue("status", MilestoneStatus.COMPLETED);
    } else if (watchProgressPercentage > 0) {
      setValue("status", MilestoneStatus.IN_PROGRESS);
    }
  }, [watchProgressPercentage, setValue]);

  // Initialize form with milestone data when editing
  useEffect(() => {
    if (open && milestone) {
      reset({
        title: milestone.title,
        description: milestone.description || "",
        assignedTo: milestone.assignedTo || "",
        category: milestone.category || "",
        stageNumber: milestone.stageNumber,
        startDate: milestone.startDate?.split("T")[0] || "",
        dueDate: milestone.dueDate?.split("T")[0] || "",
        progressPercentage: milestone.progressPercentage,
        status: milestone.status,
      });
    } else if (open && !milestone) {
      reset({
        title: "",
        description: "",
        assignedTo: "",
        category: "",
        stageNumber: nextStageNumber,
        startDate: "",
        dueDate: "",
        progressPercentage: 0,
        status: MilestoneStatus.NOT_STARTED,
      });
    }
  }, [open, milestone, reset, nextStageNumber]);

  const onSubmit = async (data: MilestoneFormData) => {
    if (!user) {
      return;
    }

    try {
      const payload = {
        projectId: project.id,
        title: data.title,
        description: data.description,
        assignedTo: data.assignedTo,
        category: data.category,
        stageNumber: data.stageNumber,
        // Provide empty arrays for payment-related fields
        scopeOfWork: [],
        additionalCharges: [],
        useProjectBuiltUpArea: true,
        startDate: data.startDate || undefined,
        dueDate: data.dueDate || undefined,
        progressPercentage: data.progressPercentage,
        createdBy: `${user.firstName} ${user.lastName}`,
        createdById: user._id,
      };

      if (isEditMode && milestone) {
        await updateMilestone({
          id: milestone.id,
          data: {
            ...payload,
            status: data.status,
          } as UpdateMilestoneDto,
        }).unwrap();
        toast.success("Milestone updated successfully");
      } else {
        await createMilestone(payload as CreateMilestoneDto).unwrap();
        toast.success("Milestone created successfully");
      }

      onOpenChange(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const message =
        err?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} milestone`;
      toast.error(message);
      console.error("Milestone form error:", error);
    }
  };

  const getStatusFromProgress = (progress: number): string => {
    if (progress === 0) {
      return "Not Started";
    }
    if (progress === 100) {
      return "Completed";
    }
    return "In Progress";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-purple-600" />
            {isEditMode ? "Edit Milestone" : "Create New Milestone"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the milestone details below"
              : "Add a new milestone to track your project progress"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 py-4">
            {/* Basic Information Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Flag className="h-4 w-4 text-purple-500" />
                Basic Information
              </Label>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Milestone Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Foundation Work, Electrical Installation"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about this milestone..."
                    rows={3}
                    className="resize-none"
                    {...register("description")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stageNumber">
                    Stage Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stageNumber"
                    type="number"
                    min="1"
                    className="w-full md:w-48"
                    {...register("stageNumber", { valueAsNumber: true })}
                  />
                  {errors.stageNumber && (
                    <p className="text-sm text-red-500">
                      {errors.stageNumber.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Determines the order of this milestone in the timeline
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Assignment & Category Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-blue-500" />
                Assignment & Classification
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    placeholder="e.g., John Doe, Team A"
                    {...register("assignedTo")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Design, Construction"
                    {...register("category")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Timeline Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Timeline
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" {...register("dueDate")} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Progress & Status Section */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Progress & Status
              </Label>
              <div className="space-y-4">
                {/* Progress Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Progress Percentage</Label>
                    <span className="text-xl font-bold text-purple-600">
                      {watchProgressPercentage}%
                    </span>
                  </div>
                  <Controller
                    name="progressPercentage"
                    control={control}
                    render={({ field }) => (
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="py-2"
                      />
                    )}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Progress Preview */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Preview</span>
                      <span className="font-semibold text-purple-600">
                        {getStatusFromProgress(watchProgressPercentage)}
                      </span>
                    </div>
                    <Progress value={watchProgressPercentage} className="h-2" />
                  </div>
                </div>

                {/* Status Selector */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={MilestoneStatus.NOT_STARTED}>
                            Not Started
                          </SelectItem>
                          <SelectItem value={MilestoneStatus.IN_PROGRESS}>
                            In Progress
                          </SelectItem>
                          <SelectItem value={MilestoneStatus.COMPLETED}>
                            Completed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Save Changes" : "Create Milestone"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
