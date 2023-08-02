/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mysql2"],
    forceSwcTransforms: true,
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  swcMinify: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config, { dev }) => {
    config.infrastructureLogging = { debug: /PackFileCache/ };
    if (dev) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
