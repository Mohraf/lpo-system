import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["bcryptjs", "jose"],
    middlewarePrefetch: "flexible",
  },
  runtime: "nodejs",
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