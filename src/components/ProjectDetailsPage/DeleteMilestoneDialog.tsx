"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge } from "../ui/badge";
import { AlertTriangle, DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Milestone, MilestonePaymentStatus } from "@/types/milestone";
import { useDeleteMilestoneMutation } from "@/lib/api/milestonesApi";

interface DeleteMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: Milestone | null;
  projectId: string;
}

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function DeleteMilestoneDialog({
  open,
  onOpenChange,
  milestone,
  projectId,
}: DeleteMilestoneDialogProps) {
  const [deleteMilestone, { isLoading }] = useDeleteMilestoneMutation();

  const handleDelete = async () => {
    if (!milestone) {
      return;
    }

    try {
      await deleteMilestone({ id: milestone.id, projectId }).unwrap();
      toast.success("Milestone deleted successfully");
      onOpenChange(false);
    } catch (error: any) {
      const message = error?.data?.message || "Failed to delete milestone";
      toast.error(message);
      console.error("Delete milestone error:", error);
    }
  };

  if (!milestone) {
    return null;
  }

  const hasPayments = milestone.paidAmount > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Milestone
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Are you sure you want to delete the milestone{" "}
                <span className="font-semibold text-foreground">
                  {milestone.title}
                </span>
                ?
              </p>

              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold text-red-900 dark:text-red-200">
                      This action cannot be undone.
                    </p>
                    <p className="text-red-800 dark:text-red-300">
                      This will permanently delete the milestone and all
                      associated data including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400 ml-2">
                      <li>Scope of work items</li>
                      <li>Additional charges</li>
                      <li>Progress history</li>
                      <li>Timeline information</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Milestone Details:</p>
                <div className="p-3 rounded-lg bg-muted/50 border space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stage Number:</span>
                    <Badge variant="outline">
                      Stage {milestone.stageNumber}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">
                      {formatCurrency(milestone.totalAmount)}
                    </span>
                  </div>
                  {hasPayments && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Paid Amount:
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(milestone.paidAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Payment Status:
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            milestone.paymentStatus ===
                            MilestonePaymentStatus.PAID
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30"
                              : milestone.paymentStatus ===
                                  MilestonePaymentStatus.PARTIALLY_PAID
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30"
                                : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30"
                          }
                        >
                          <DollarSign className="h-3 w-3 mr-1" />
                          {milestone.paymentStatus ===
                          MilestonePaymentStatus.PAID
                            ? "Paid"
                            : milestone.paymentStatus ===
                                MilestonePaymentStatus.PARTIALLY_PAID
                              ? "Partially Paid"
                              : "Unpaid"}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {hasPayments && (
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    <span className="font-semibold">Warning:</span> This
                    milestone has received payments. Deleting it will not affect
                    the payment records, but the milestone reference will be
                    lost.
                  </p>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Type the milestone title or click confirm to proceed with
                deletion.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Milestone"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
