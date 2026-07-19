import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@prisma/client', '@supabase/supabase-js'],
  },
  compress: true,
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
