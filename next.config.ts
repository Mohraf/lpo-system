import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  serverExternalPackages: ["bcryptjs", "jose", "@prisma/client"], // Updated key
  experimental: {
    middlewarePrefetch: "flexible",
  },
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
  // Configure headers to avoid automatic auth routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "x-middleware-ratelimit",
            value: "none",
          },
        ],
      },
    ];
  },
};

export default nextConfig;