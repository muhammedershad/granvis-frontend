import { apiSlice } from "./apiSlice";

export interface UploadResult {
  key: string;
  url: string;
  cloudFrontUrl: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  objectKey: string;
  cloudFrontUrl: string;
}

/**
 * Upload a file directly to S3 using a presigned URL
 * This bypasses the backend and uploads directly from the browser
 */
export async function uploadToS3WithPresignedUrl(
  presignedUrl: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed due to network error"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Upload a single file
    uploadFile: builder.mutation<UploadResult, { file: File; folder?: string }>(
      {
        query: ({ file, folder }) => {
          const formData = new FormData();
          formData.append("file", file);
          if (folder) {
            formData.append("folder", folder);
          }
          return {
            url: "/upload/single",
            method: "POST",
            body: formData,
          };
        },
      }
    ),

    // Upload multiple files
    uploadFiles: builder.mutation<
      UploadResult[],
      { files: File[]; folder?: string }
    >({
      query: ({ files, folder }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        if (folder) {
          formData.append("folder", folder);
        }
        return {
          url: "/upload/multiple",
          method: "POST",
          body: formData,
        };
      },
    }),

    // Get presigned URL for direct upload
    getPresignedUrl: builder.mutation<
      PresignedUrlResponse,
      { fileName: string; contentType: string; folder?: string }
    >({
      query: (body) => ({
        url: "/upload/presigned-url",
        method: "POST",
        body,
      }),
    }),

    // Delete a file
    deleteFile: builder.mutation<void, string>({
      query: (key) => ({
        url: "/upload/delete",
        method: "POST",
        body: { key },
      }),
    }),
  }),
});

export const {
  useUploadFileMutation,
  useUploadFilesMutation,
  useGetPresignedUrlMutation,
  useDeleteFileMutation,
} = uploadApi;
