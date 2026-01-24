import { useCallback, useState } from "react";
import {
  ImageValidationOptions,
  blobToFile,
  readFileAsDataURL,
  validateImageFile,
} from "@/lib/imageValidation";

interface UseImageCropOptions extends ImageValidationOptions {
  onError?: (error: string) => void;
}

export function useImageCrop(options: UseImageCropOptions = {}) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle file selection and validation
   */
  const handleFileSelect = useCallback(
    async (file: File | null) => {
      if (!file) {
        setError("No file selected");
        options.onError?.("No file selected");
        return;
      }

      // Validate file
      const validation = validateImageFile(file, options);
      if (!validation.isValid) {
        setError(validation.error || "Invalid file");
        options.onError?.(validation.error || "Invalid file");
        return;
      }

      try {
        // Read file as data URL
        const dataUrl = await readFileAsDataURL(file);
        setOriginalImage(dataUrl);
        setImageFile(file);
        setError(null);
        setIsDialogOpen(true);
      } catch (_err) {
        const errorMessage = "Failed to read image file";
        setError(errorMessage);
        options.onError?.(errorMessage);
      }
    },
    [options]
  );

  /**
   * Handle input change event
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFileSelect(file);

      // Reset input value to allow selecting same file again
      e.target.value = "";
    },
    [handleFileSelect]
  );

  /**
   * Handle crop completion
   */
  const handleCropComplete = useCallback(
    (blob: Blob, url: string) => {
      setCroppedBlob(blob);
      setCroppedImage(url);
      setError(null);

      // Convert blob to file for potential upload
      if (imageFile) {
        const croppedFile = blobToFile(blob, imageFile.name);
        setImageFile(croppedFile);
      }
    },
    [imageFile]
  );

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setOriginalImage(null);
    setCroppedImage(null);
    setCroppedBlob(null);
    setImageFile(null);
    setError(null);
    setIsDialogOpen(false);
  }, []);

  /**
   * Remove cropped image
   */
  const removeCroppedImage = useCallback(() => {
    // Revoke object URL to free memory
    if (croppedImage) {
      URL.revokeObjectURL(croppedImage);
    }
    setCroppedImage(null);
    setCroppedBlob(null);
    setImageFile(null);
    setOriginalImage(null);
    setError(null);
  }, [croppedImage]);

  /**
   * Open crop dialog with existing image
   */
  const openCropDialog = useCallback(() => {
    if (originalImage) {
      setIsDialogOpen(true);
    }
  }, [originalImage]);

  return {
    // State
    originalImage,
    croppedImage,
    croppedBlob,
    imageFile,
    isDialogOpen,
    error,

    // Actions
    handleInputChange,
    handleFileSelect,
    handleCropComplete,
    setIsDialogOpen,
    reset,
    removeCroppedImage,
    openCropDialog,
  };
}
