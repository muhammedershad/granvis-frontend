"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, Pencil, Target, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DatePicker } from "../ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  useCreatePaymentTargetMutation,
  useDeletePaymentTargetMutation,
  useGetPaymentTargetsQuery,
  useUpdatePaymentTargetMutation,
} from "@/lib/api/paymentTargetsApi";
import { getAuthDetails } from "@/store/slices/authSlice";
import {
  type CreatePaymentTargetFormData,
  createPaymentTargetSchema,
} from "@/lib/validations/payment-target";
import type { PaymentTarget, TargetCategory } from "@/types/payment-target";

const formatCurrency = (amount: number | undefined) => {
  if (!amount && amount !== 0) {
    return "\u20B90";
  }
  if (amount >= 10000000) {
    return `\u20B9${(amount / 10000000).toFixed(2)}Cr`;
  }
  if (amount >= 100000) {
    return `\u20B9${(amount / 100000).toFixed(2)}L`;
  }
  return `\u20B9${amount.toLocaleString("en-IN")}`;
};

const getTargetProgress = (target: PaymentTarget) => {
  if (target.targetAmount === 0) {
    return 0;
  }
  if (target.category === "receivables") {
    return Math.min(100, (target.currentAmount / target.targetAmount) * 100);
  }
  return (target.currentAmount / target.targetAmount) * 100;
};

const getTargetStatus = (target: PaymentTarget) => {
  const progress = getTargetProgress(target);
  if (target.category === "receivables") {
    return progress > 100 ? "warning" : "good";
  }
  if (progress >= 90) {
    return "good";
  }
  if (progress >= 70) {
    return "warning";
  }
  return "poor";
};

const getStatusBadgeClass = (status: string) => {
  if (status === "good") {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
  }
  if (status === "warning") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
  }
  return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
};

const categoryLabels: Record<string, string> = {
  quarterly: "Quarterly",
  monthly: "Monthly",
  annual: "Annual",
  receivables: "Receivables",
};

function TargetsList({
  isLoading,
  isError,
  targets,
  onEdit,
  onDelete,
}: {
  isLoading: boolean;
  isError: boolean;
  targets: PaymentTarget[];
  onEdit: (target: PaymentTarget) => void;
  onDelete: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50"
          >
            <CardContent className="p-6">
              <div className="h-40 animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-full mt-4"></div>
                <div className="h-2 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <CardContent className="relative flex flex-col items-center justify-center py-12 text-center">
          <Target className="h-12 w-12 text-red-400/50 mb-4" />
          <p className="text-sm text-red-500">
            Failed to load targets. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (targets.length === 0) {
    return (
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        <CardContent className="relative flex flex-col items-center justify-center py-12 text-center">
          <Target className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No targets yet
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first financial target using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {targets.map((target) => {
        const progress = getTargetProgress(target);
        const status = getTargetStatus(target);

        return (
          <Card
            key={target.id}
            className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-purple-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

            <CardContent className="relative p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
                    {target.title}
                  </h3>
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {categoryLabels[target.category] || target.category}
                  </span>
                </div>
                <Badge
                  className={`text-[10px] shrink-0 ${getStatusBadgeClass(status)}`}
                >
                  {status}
                </Badge>
              </div>

              {/* Amounts */}
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current</span>
                  <span className="text-foreground font-medium">
                    {formatCurrency(target.currentAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Target</span>
                  <span className="text-foreground font-medium">
                    {formatCurrency(target.targetAmount)}
                  </span>
                </div>

                {/* Progress Bar */}
                <Progress value={Math.min(100, progress)} className="h-1.5" />
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">
                    {progress.toFixed(1)}%
                  </span>
                </div>

                {/* Dates */}
                <div className="pt-2.5 border-t border-white/30 dark:border-white/10">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>
                      {format(new Date(target.startDate), "MMM dd, yyyy")}
                    </span>
                    <span>
                      {format(new Date(target.deadline), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground/70 mt-0.5">
                    <span>Start</span>
                    <span>Deadline</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-1 mt-3 pt-2.5 border-t border-white/30 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEdit(target)}
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Target</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete &quot;
                        {target.title}
                        &quot;? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(target.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function TargetsTab() {
  const [editingTarget, setEditingTarget] = useState<PaymentTarget | null>(
    null
  );

  const { user } = useSelector(getAuthDetails);

  // API hooks
  const {
    data: targetsResponse,
    isLoading,
    isError,
  } = useGetPaymentTargetsQuery();
  const [createTarget, { isLoading: isCreating }] =
    useCreatePaymentTargetMutation();
  const [updateTarget, { isLoading: isUpdating }] =
    useUpdatePaymentTargetMutation();
  const [deleteTarget] = useDeletePaymentTargetMutation();

  const targets = targetsResponse?.data || [];

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreatePaymentTargetFormData>({
    resolver: zodResolver(createPaymentTargetSchema),
    defaultValues: {
      title: "",
      targetAmount: undefined as unknown as number,
      startDate: undefined as unknown as Date,
      deadline: undefined as unknown as Date,
      category: undefined as unknown as CreatePaymentTargetFormData["category"],
    },
  });

  const startDateValue = watch("startDate");
  const deadlineValue = watch("deadline");
  const categoryValue = watch("category");

  const isSubmitting = isCreating || isUpdating;

  const onSubmit = async (data: CreatePaymentTargetFormData) => {
    try {
      if (editingTarget) {
        await updateTarget({
          id: editingTarget.id,
          data: {
            title: data.title,
            targetAmount: data.targetAmount,
            startDate: data.startDate.toISOString(),
            deadline: data.deadline.toISOString(),
            category: data.category as TargetCategory,
          },
        }).unwrap();
        toast.success("Target updated successfully!");
        setEditingTarget(null);
      } else {
        await createTarget({
          title: data.title,
          targetAmount: data.targetAmount,
          startDate: data.startDate.toISOString(),
          deadline: data.deadline.toISOString(),
          category: data.category as TargetCategory,
          createdBy: user?.email || "",
          createdById: user?._id,
        }).unwrap();
        toast.success("Target created successfully!", {
          description: `"${data.title}" has been added to your targets.`,
        });
      }
      reset();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(
        editingTarget ? "Failed to update target" : "Failed to create target",
        {
          description: err?.data?.message || "Please try again.",
        }
      );
    }
  };

  const handleEdit = (target: PaymentTarget) => {
    setEditingTarget(target);
    reset({
      title: target.title,
      targetAmount: target.targetAmount,
      startDate: new Date(target.startDate),
      deadline: new Date(target.deadline),
      category: target.category as CreatePaymentTargetFormData["category"],
    });
  };

  const handleCancelEdit = () => {
    setEditingTarget(null);
    reset({
      title: "",
      targetAmount: undefined as unknown as number,
      startDate: undefined as unknown as Date,
      deadline: undefined as unknown as Date,
      category: undefined as unknown as CreatePaymentTargetFormData["category"],
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTarget(id).unwrap();
      toast.success("Target deleted successfully");
    } catch {
      toast.error("Failed to delete target");
    }
  };

  return (
    <div className="space-y-6">
      {/* Set New Target Form - TOP */}
      <Card className="backdrop-blur-xl bg-white/70 dark:bg-black/20 border-white/20 dark:border-white/10 relative overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-indigo-50/40 to-blue-50/60 opacity-100 dark:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>

        <CardHeader className="relative pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-sm font-semibold tracking-tight">
                {editingTarget ? "Edit Target" : "Set New Target"}
              </CardTitle>
              <CardDescription className="text-xs">
                {editingTarget
                  ? "Update the target details below"
                  : "Create financial goals and track performance"}
              </CardDescription>
            </div>
            {editingTarget && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="bg-background/50 hover:bg-muted/50"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative p-4 pt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Target Title *
                  </Label>
                  <Input
                    {...register("title")}
                    placeholder="e.g., Q1 2025 Revenue"
                    className="h-10"
                  />
                  {errors.title && (
                    <p className="text-[10px] text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Target Amount *
                  </Label>
                  <Input
                    type="number"
                    {...register("targetAmount", { valueAsNumber: true })}
                    placeholder="e.g., 2500000"
                    className="h-10"
                  />
                  {errors.targetAmount && (
                    <p className="text-[10px] text-red-500">
                      {errors.targetAmount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Start Date *
                  </Label>
                  <DatePicker
                    date={startDateValue}
                    onDateChange={(date) =>
                      setValue("startDate", date as Date, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Select start date"
                    fromYear={2020}
                    toYear={2035}
                  />
                  {errors.startDate && (
                    <p className="text-[10px] text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Deadline *
                  </Label>
                  <DatePicker
                    date={deadlineValue}
                    onDateChange={(date) =>
                      setValue("deadline", date as Date, {
                        shouldValidate: true,
                      })
                    }
                    placeholder="Select deadline"
                    fromYear={2020}
                    toYear={2035}
                  />
                  {errors.deadline && (
                    <p className="text-[10px] text-red-500">
                      {errors.deadline.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Category *
                  </Label>
                  <Select
                    value={categoryValue || ""}
                    onValueChange={(v) =>
                      setValue(
                        "category",
                        v as CreatePaymentTargetFormData["category"],
                        { shouldValidate: true }
                      )
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="receivables">Receivables</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-[10px] text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {editingTarget && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="bg-background/50 hover:bg-muted/50"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                {editingTarget ? "Update Target" : "Create Target"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <TargetsList
        isLoading={isLoading}
        isError={isError}
        targets={targets}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
