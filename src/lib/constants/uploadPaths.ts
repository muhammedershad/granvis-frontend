/**
 * Central configuration for S3 upload paths
 * These paths are used when requesting presigned URLs for file uploads
 */

export const UPLOAD_PATHS = {
  EMPLOYEE_AVATARS: "griha-local/employee-avatars",
  CLIENT_AVATARS: "griha-local/client-avatars",
} as const;
