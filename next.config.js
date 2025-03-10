/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // ✅ Allow Cloudinary images
    // domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dnqsiqqu9/**", // ✅ Allow all images from your Cloudinary account
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
