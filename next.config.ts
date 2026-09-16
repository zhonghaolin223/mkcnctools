import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product photos are uploaded through the protected admin console. Keep this
  // comfortably below Cloudflare's request limits while allowing high-quality
  // catalogue images during the pre-launch review stage.
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
