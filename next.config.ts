import type { NextConfig } from "next";

// Extract hostname from CloudFront domain URL
const cloudfrontDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
const cloudfrontHostname = cloudfrontDomain
  ? new URL(cloudfrontDomain).hostname
  : null;

const nextConfig: NextConfig = {
  // Use separate output dir for builds so it doesn't clobber the dev server's .next
  ...(process.env.BUILD_DIR ? { distDir: process.env.BUILD_DIR } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      ...(cloudfrontHostname
        ? [
            {
              protocol: "https" as const,
              hostname: cloudfrontHostname,
              port: "",
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Timeout static generation quickly to prevent hanging
  staticPageGenerationTimeout: 5,
};

export default nextConfig;
