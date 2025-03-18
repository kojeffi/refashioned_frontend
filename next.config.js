/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Allow Cloudinary images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dnqsiqqu9/**", // Allow all images from your Cloudinary account
      },
    ],
  },
  reactStrictMode: true,
  // Add custom Webpack configuration
  webpack: (config, { isServer }) => {
    // Ensure autoprefixer is resolved correctly
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        autoprefixer: require.resolve('autoprefixer'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;