import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  trailingSlash: true,
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
