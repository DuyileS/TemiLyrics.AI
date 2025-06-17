/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  env: {
    GENIUS_ACCESS_TOKEN: process.env.GENIUS_ACCESS_TOKEN,
  },
};

module.exports = nextConfig;