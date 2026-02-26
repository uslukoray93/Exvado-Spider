import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Sadece client-side için ayarlar
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // WASM ve ONNX hatalarını ignore et
    config.ignoreWarnings = [
      { module: /node_modules\/@imgly\/background-removal/ },
      { module: /node_modules\/onnxruntime-web/ },
      /Critical dependency/,
      /Can't resolve/,
    ];

    return config;
  },
};

export default nextConfig;
