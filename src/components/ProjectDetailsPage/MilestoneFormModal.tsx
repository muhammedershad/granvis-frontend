"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Checkbox } from "../ui/checkbox";
import { Slider } from "../ui/slider";
import { Loader2, Plus, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { getAuthDetails } from "@/store/slices/authSlice";
import {
  Milestone,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  MilestoneStatus,
  RateType,
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

const scopeItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  rateType: z.nativeEnum(RateType),
  rate: z.number().min(0, "Rate must be non-negative"),
  quantity: z.number().min(0, "Quantity must be non-negative").optional(),
});

const additionalChargeSchema = z.object({
  description: z.string().min(1, "Description is required"),
  ratePerUnit: z.number().min(0, "Rate must be non-negative"),
  quantity: z.number().min(0, "Quantity must be non-negative").optional(),
});

const milestoneFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  stageNumber: z.number().int().min(1, "Stage number must be at least 1"),
  scopeOfWork: z.array(scopeItemSchema).min(1, "At least one scope item required"),
  additionalCharges: z.array(additionalChargeSchema).optional(),
  useProjectBuiltUpArea: z.boolean(),
  customBuiltUpArea: z.number().min(0).optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  progressPercentage: z.number().min(0).max(100).optional(),
  status: z.nativeEnum(MilestoneStatus).optional(),
});

type MilestoneFormData = z.infer<typeof milestoneFormSchema>;

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function MilestoneFormModal({
  open,
  onOpenChange,
  project,
  milestone,
  existingMilestones = [],
}: MilestoneFormModalProps) {
  const { user } = useSelector(getAuthDetails);
  const [createMilestone, { isLoading: isCreating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] = useUpdateMilestoneMutation();

  const isEditMode = !!milestone;
  const isLoading = isCreating || isUpdating;

  // Calculate next stage number
  const nextStageNumber = existingMilestones.length > 0
    ? Math.max(...existingMilestones.map(m => m.stageNumber)) + 1
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
      stageNumber: nextStageNumber,
      scopeOfWork: [{ description: "", rateType: RateType.FIXED, rate: 0, quantity: 1 }],
      additionalCharges: [],
      useProjectBuiltUpArea: true,
      customBuiltUpArea: undefined,
      startDate: "",
      dueDate: "",
      progressPercentage: 0,
      status: MilestoneStatus.NOT_STARTED,
    },
  });

  const {
    fields: scopeFields,
    append: appendScope,
    remove: removeScope,
  } = useFieldArray({
    control,
    name: "scopeOfWork",
  });

  const {
    fields: chargeFields,
    append: appendCharge,
    remove: removeCharge,
  } = useFieldArray({
    control,
    name: "additionalCharges",
  });

  // Watch form values for calculations
  const watchScopeOfWork = watch("scopeOfWork");
  const watchAdditionalCharges = watch("additionalCharges");
  const watchUseProjectBuiltUpArea = watch("useProjectBuiltUpArea");
  const watchCustomBuiltUpArea = watch("customBuiltUpArea");
  const watchProgressPercentage = watch("progressPercentage");

  // Calculate scope amount
  const scopeAmount = watchScopeOfWork?.reduce((total, item) => {
    if (item.rateType === RateType.PER_SQFT) {
      const area = watchUseProjectBuiltUpArea
        ? (project as any).builtUpArea || 0
        : watchCustomBuiltUpArea || 0;
      return total + (item.rate * area);
    } else {
      return total + (item.rate * (item.quantity || 1));
    }
  }, 0) || 0;

  // Calculate additional charges amount
  const additionalChargesAmount = watchAdditionalCharges?.reduce((total, charge) => {
    return total + (charge.ratePerUnit * (charge.quantity || 1));
  }, 0) || 0;

  // Total amount
  const totalAmount = scopeAmount + additionalChargesAmount;

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
        stageNumber: milestone.stageNumber,
        scopeOfWork: milestone.scopeOfWork.map(item => ({
          description: item.description,
          rateType: item.rateType,
          rate: item.rate,
          quantity: item.quantity,
        })),
        additionalCharges: milestone.additionalCharges?.map(charge => ({
          description: charge.description,
          ratePerUnit: charge.ratePerUnit,
          quantity: charge.quantity,
        })) || [],
        useProjectBuiltUpArea: milestone.useProjectBuiltUpArea,
        customBuiltUpArea: milestone.customBuiltUpArea,
        startDate: milestone.startDate?.split("T")[0] || "",
        dueDate: milestone.dueDate?.split("T")[0] || "",
        progressPercentage: milestone.progressPercentage,
        status: milestone.status,
      });
    } else if (open && !milestone) {
      reset({
        title: "",
        description: "",
        stageNumber: nextStageNumber,
        scopeOfWork: [{ description: "", rateType: RateType.FIXED, rate: 0, quantity: 1 }],
        additionalCharges: [],
        useProjectBuiltUpArea: true,
        customBuiltUpArea: undefined,
        startDate: "",
        dueDate: "",
        progressPercentage: 0,
        status: MilestoneStatus.NOT_STARTED,
      });
    }
  }, [open, milestone, reset, nextStageNumber]);

  const onSubmit = async (data: MilestoneFormData) => {
    if (!user) return;

    try {
      const payload = {
        projectId: project.id,
        title: data.title,
        description: data.description,
        stageNumber: data.stageNumber,
        scopeOfWork: data.scopeOfWork.map(item => ({
          id: crypto.randomUUID(),
          description: item.description,
          rateType: item.rateType,
          rate: item.rate,
          quantity: item.quantity || 1,
        })),
        additionalCharges: data.additionalCharges?.map(charge => ({
          id: crypto.randomUUID(),
          description: charge.description,
          ratePerUnit: charge.ratePerUnit,
          quantity: charge.quantity || 1,
        })) || [],
        useProjectBuiltUpArea: data.useProjectBuiltUpArea,
        customBuiltUpArea: data.customBuiltUpArea,
        startDate: data.startDate || undefined,
        dueDate: data.dueDate || undefined,
        progressPercentage: data.progressPercentage || 0,
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
    } catch (error: any) {
      const message = error?.data?.message || `Failed to ${isEditMode ? "update" : "create"} milestone`;
      toast.error(message);
      console.error("Milestone form error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Milestone" : "Create New Milestone"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the milestone details below"
              : "Add a new milestone to the project timeline"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Foundation Work"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stageNumber">
                  Stage Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stageNumber"
                  type="number"
                  min="1"
                  {...register("stageNumber", { valueAsNumber: true })}
                />
                {errors.stageNumber && (
                  <p className="text-sm text-red-500">{errors.stageNumber.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the milestone..."
                rows={3}
                {...register("description")}
              />
            </div>
          </div>

          <Separator />

          {/* Scope of Work */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Scope of Work <span className="text-red-500">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendScope({ description: "", rateType: RateType.FIXED, rate: 0, quantity: 1 })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {scopeFields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg bg-muted/30 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    {scopeFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600"
                        onClick={() => removeScope(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="e.g., RCC work"
                      {...register(`scopeOfWork.${index}.description`)}
                    />
                    {errors.scopeOfWork?.[index]?.description && (
                      <p className="text-sm text-red-500">
                        {errors.scopeOfWork[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Rate Type</Label>
                      <Controller
                        name={`scopeOfWork.${index}.rateType`}
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={RateType.FIXED}>Fixed</SelectItem>
                              <SelectItem value={RateType.PER_SQFT}>Per Sq.Ft</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rate (₹)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0"
                        {...register(`scopeOfWork.${index}.rate`, { valueAsNumber: true })}
                      />
                    </div>

                    {watch(`scopeOfWork.${index}.rateType`) === RateType.FIXED && (
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="1"
                          {...register(`scopeOfWork.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errors.scopeOfWork && typeof errors.scopeOfWork === "object" && "message" in errors.scopeOfWork && (
              <p className="text-sm text-red-500">{errors.scopeOfWork.message as string}</p>
            )}

            {/* Built-up Area Configuration */}
            <div className="p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20 space-y-3">
              <div className="flex items-center space-x-2">
                <Controller
                  name="useProjectBuiltUpArea"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="useProjectBuiltUpArea"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="useProjectBuiltUpArea" className="cursor-pointer">
                  Use Project Built-up Area
                  {(project as any).builtUpArea && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({(project as any).builtUpArea} sq.ft)
                    </span>
                  )}
                </Label>
              </div>

              {!watchUseProjectBuiltUpArea && (
                <div className="space-y-2">
                  <Label htmlFor="customBuiltUpArea">Custom Built-up Area (sq.ft)</Label>
                  <Input
                    id="customBuiltUpArea"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter area in sq.ft"
                    {...register("customBuiltUpArea", { valueAsNumber: true })}
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scope Amount:</span>
                <span className="text-lg font-bold">{formatCurrency(scopeAmount)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Charges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Additional Charges</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendCharge({ description: "", ratePerUnit: 0, quantity: 1 })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Charge
              </Button>
            </div>

            {chargeFields.length > 0 && (
              <div className="space-y-3">
                {chargeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 border rounded-lg bg-muted/30 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium">Charge {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600"
                        onClick={() => removeCharge(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="e.g., Transportation"
                        {...register(`additionalCharges.${index}.description`)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Rate per Unit (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          {...register(`additionalCharges.${index}.ratePerUnit`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="1"
                          {...register(`additionalCharges.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {chargeFields.length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Additional Charges Amount:</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(additionalChargesAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Total Amount */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="text-base font-semibold">Total Amount:</span>
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Timeline</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" {...register("dueDate")} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Progress & Status */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Progress & Status</Label>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Progress Percentage</Label>
                  <span className="text-sm font-semibold">{watchProgressPercentage}%</span>
                </div>
                <Controller
                  name="progressPercentage"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value || 0]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
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
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditMode ? "Update Milestone" : "Create Milestone"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
