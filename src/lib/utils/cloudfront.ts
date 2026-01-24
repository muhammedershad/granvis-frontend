/**
 * Get CloudFront URL from S3 object key
 * @param objectKey - S3 object key (e.g., 'employee-avatars/1234567890-uuid.jpg')
 * @returns CloudFront URL or null if no key or domain configured
 */
export function getCloudFrontUrl(
  objectKey: string | undefined | null
): string | null {
  if (!objectKey) {
    return null;
  }

  const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
  if (!cloudfrontDomain) {
    console.warn("NEXT_PUBLIC_CLOUDFRONT_DOMAIN not configured");
    return null;
  }

  return `${cloudfrontDomain}/${objectKey}`;
}

/**
 * Get avatar URL from avatarKey
 * Falls back to avatar field if avatarKey is not available
 * @param avatarKey - S3 object key for avatar
 * @param avatar - Legacy avatar URL (fallback)
 * @returns Avatar URL or null
 */
export function getAvatarUrl(
  avatarKey: string | undefined | null,
  avatar?: string | undefined | null
): string | null {
  // Prefer avatarKey with CloudFront
  if (avatarKey) {
    return getCloudFrontUrl(avatarKey);
  }

  // Fallback to legacy avatar field
  if (avatar) {
    return avatar;
  }

  return null;
}
