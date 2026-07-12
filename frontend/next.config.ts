import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for bb.js WASM loading
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  // Allow Stellar horizon/RPC images (for future use)
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
