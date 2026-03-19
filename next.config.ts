import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // ✅ BỎ QUA LỖI TYPESCRIPT KHI BUILD
  typescript: {
    ignoreBuildErrors: true,
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  env: {
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME || 'Modern Next.js App',
  },
};

export default nextConfig;