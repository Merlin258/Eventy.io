import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Run before filesystem (including API routes) so the Python
      // backend takes priority over any leftover Next.js API routes.
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "http://localhost:8000/api/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
