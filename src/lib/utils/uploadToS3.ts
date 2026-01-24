/**
 * Upload a blob/file directly to S3 using a presigned URL
 * @param presignedUrl - The presigned URL from backend
 * @param blob - The blob or file to upload
 * @param contentType - MIME type of the file
 * @param onProgress - Optional progress callback
 * @returns Promise that resolves when upload is complete
 */
export async function uploadToS3(
  presignedUrl: string,
  blob: Blob,
  contentType: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    // Handle successful upload
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    // Handle upload abort
    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    // Open connection and send the blob
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(blob);
  });
}
