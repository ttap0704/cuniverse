/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mysql2"],
    forceSwcTransforms: true,
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  swcMinify: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

module.exports = nextConfig;
