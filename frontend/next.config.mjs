/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for bb.js WASM loading
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
  // Allow Stellar horizon/RPC images (for future use)
  images: {
    domains: ["firebasestorage.googleapis.com"],
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
