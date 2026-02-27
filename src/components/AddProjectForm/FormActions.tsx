import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  uploadProgress?: number;
  onCancel: () => void;
  mode?: "create" | "edit";
}

function getLoadingLabel(
  uploadProgress: number | undefined,
  isEditMode: boolean
) {
  if (uploadProgress !== undefined && uploadProgress > 0) {
    return `Uploading... ${uploadProgress}%`;
  }
  if (isEditMode) {
    return "Updating...";
  }
  return "Creating...";
}

function getSubmitLabel(isEditMode: boolean) {
  if (isEditMode) {
    return "Update Project";
  }
  return "Create Project";
}

export function FormActions({
  isLoading,
  uploadProgress,
  onCancel,
  mode = "create",
}: FormActionsProps) {
  const isEditMode = mode === "edit";

  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {getLoadingLabel(uploadProgress, isEditMode)}
          </>
        ) : (
          getSubmitLabel(isEditMode)
        )}
      </Button>
    </div>
  );
}
