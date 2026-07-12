/** @type {import('next').NextConfig} */
const nextConfig = {
  // Treat Stellar SDK as external on server to avoid sodium-native WASM issues
  serverExternalPackages: ["@stellar/stellar-sdk", "@stellar/stellar-base", "sodium-native"],

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

  // TODO: fix remaining TS errors before v1 launch
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
