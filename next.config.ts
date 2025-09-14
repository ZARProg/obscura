import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "image.tmdb.org",       // untuk poster/cover TMDB
      "developers.google.com", // untuk logo Google
      "lh3.googleusercontent.com",
    ],
  },
  reactStrictMode: true, // opsional, biar dapat warning dev lebih detail
};

export default nextConfig;
