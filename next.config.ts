import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Catalogue photography changes only when the owner edits it.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  poweredByHeader: false,
  trailingSlash: true,
  allowedDevOrigins: ["*.e2b.app"],
  experimental: {
    // Ship only the icons/motion code each page actually imports.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
