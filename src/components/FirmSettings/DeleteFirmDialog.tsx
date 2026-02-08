"use client";

import { Loader2 } from "lucide-react";
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
import { useDeleteFirmSettingsMutation } from "@/lib/api/firmSettingsApi";
import { FirmSettings } from "@/types/firm-settings";
import { toast } from "sonner";

interface DeleteFirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firm: FirmSettings | null;
}

export function DeleteFirmDialog({
  open,
  onOpenChange,
  firm,
}: DeleteFirmDialogProps) {
  const [deleteFirm, { isLoading }] = useDeleteFirmSettingsMutation();

  const handleDelete = async () => {
    if (!firm) return;

    try {
      await deleteFirm(firm.id).unwrap();
      toast.success(`"${firm.name}" has been deleted`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to delete firm settings");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Firm Settings</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{firm?.name}</strong>? This
            action cannot be undone. Existing invoices using this firm will not
            be affected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
