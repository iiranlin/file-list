import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 跳过类型检查和 ESLint 检查以加快构建速度
  typescript: {
    // 在构建时忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
