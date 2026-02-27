import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.svgrepo.com", port: "" }],
  },
};

export default nextConfig;
