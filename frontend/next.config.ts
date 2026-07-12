import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for bb.js WASM loading
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  // Allow external image sources
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "api.qrserver.com",  // QR code generation service
    ],
  },
};

export default nextConfig;
