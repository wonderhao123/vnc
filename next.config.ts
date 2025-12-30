import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'export',
  basePath: isProd ? '/vnc' : '',
  assetPrefix: isProd ? '/vnc/' : '',
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
