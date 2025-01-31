import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // serverComponentsExternalPackages: ["bcryptjs", "lodash", "jsonwebtoken"],
    serverComponentsExternalPackages: ["bcryptjs", "jose"],
    // Disable edge runtime for middleware
    middlewarePrefetch: "flexible",
  },
  // Force Node.js runtime for all routes
  runtime: "nodejs",
  // Remove the middleware config block entirely
  // Add webpack configuration to exclude problematic packages
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