/**
 * Image validation utilities for file uploads
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ImageValidationOptions {
  maxSizeInMB?: number;
  allowedFormats?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
  maxSizeInMB: 1,
  allowedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  minWidth: 100,
  minHeight: 100,
  maxWidth: 4000,
  maxHeight: 4000,
};

/**
 * Validate file before processing
 */
export const validateImageFile = (
  file: File,
  options: ImageValidationOptions = {}
): ImageValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check if file exists
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  // Check file size
  const maxSizeInBytes = opts.maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds ${opts.maxSizeInMB}MB limit`,
    };
  }

  // Check MIME type
  if (!opts.allowedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file format. Allowed formats: ${opts.allowedFormats
        .map((f) => f.replace("image/", "").toUpperCase())
        .join(", ")}`,
    };
  }

  // Check for fake extensions (real MIME type vs file extension)
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const mimeExtension = file.type.split("/")[1];

  if (
    fileExtension &&
    !["jpg", "jpeg", "png", "webp"].includes(fileExtension)
  ) {
    return {
      isValid: false,
      error: "Invalid file extension",
    };
  }

  // Additional check for spoofed MIME types
  if (fileExtension === "jpg" && !["jpeg", "jpg"].includes(mimeExtension)) {
    return {
      isValid: false,
      error: "File type mismatch detected",
    };
  }

  return { isValid: true };
};

/**
 * Validate image dimensions after loading
 */
export const validateImageDimensions = (
  width: number,
  height: number,
  options: ImageValidationOptions = {}
): ImageValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (width < opts.minWidth || height < opts.minHeight) {
    return {
      isValid: false,
      error: `Image dimensions (${width}x${height}) are too small. Minimum: ${opts.minWidth}x${opts.minHeight}`,
    };
  }

  if (width > opts.maxWidth || height > opts.maxHeight) {
    return {
      isValid: false,
      error: `Image dimensions (${width}x${height}) are too large. Maximum: ${opts.maxWidth}x${opts.maxHeight}`,
    };
  }

  return { isValid: true };
};

/**
 * Read file as Data URL for preview
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
};

/**
 * Convert Blob to File
 */
export const blobToFile = (blob: Blob, fileName: string): File => {
  return new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });
};

/**
 * Get image dimensions from file
 */
export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

/**
 * Compress image if it exceeds size limit
 */
export const compressImage = async (
  file: File,
  maxSizeInMB: number = 1,
  quality: number = 0.9
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width } = img;
        let { height } = img;

        // Calculate new dimensions if image is too large
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to compress image"));
              return;
            }

            // Check if compressed size is acceptable
            const maxSize = maxSizeInMB * 1024 * 1024;
            if (blob.size > maxSize && quality > 0.1) {
              // Recursively compress with lower quality
              const newFile = blobToFile(blob, file.name);
              compressImage(newFile, maxSizeInMB, quality - 0.1)
                .then(resolve)
                .catch(reject);
            } else {
              resolve(blob);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};
