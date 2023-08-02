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
        hostname: "**",
      },
    ],
  },
  swcMinify: true,
  reactStrictMode: true,
  // webpack: (config, { dev }) => {
  //   config.infrastructureLogging = { debug: /PackFileCache/ };
  //   if (dev) {
  //     config.devtool = "cheap-module-source-map";
  //   }
  //   return config;
  // },
};

module.exports = nextConfig;
