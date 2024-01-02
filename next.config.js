const { hostname } = require("os");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
      },
      {
        hostname: "f8n-production-collection-assets.imgix.net",
      },
      {
        hostname: "f8n-production.imgix.net",
      },
    ],
  },
};

module.exports = nextConfig;
