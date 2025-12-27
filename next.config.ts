import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google avatars
      'firebasestorage.googleapis.com', // Firebase storage
    ],
  },
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
  // Socket.io compatibility
  experimental: {
    // serverActions is not a valid property here; removed to fix type error
  },
};

export default nextConfig;
