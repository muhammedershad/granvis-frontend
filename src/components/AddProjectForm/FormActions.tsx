import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  isLoading: boolean;
  uploadProgress?: number;
  onCancel: () => void;
}

export function FormActions({
  isLoading,
  uploadProgress,
  onCancel,
}: FormActionsProps) {
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
            {uploadProgress !== undefined && uploadProgress > 0
              ? `Uploading... ${uploadProgress}%`
              : "Creating..."}
          </>
        ) : (
          "Create Project"
        )}
      </Button>
    </div>
  );
}
