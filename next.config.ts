import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: '100mb', // or a higher value depending on your file size
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
