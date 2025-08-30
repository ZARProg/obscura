import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["image.tmdb.org"], // izinkan load image dari TMDB
  },
  reactStrictMode: true, // opsional, biar dapat warning dev lebih detail
};

export default nextConfig;
