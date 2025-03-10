/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "refashioned.onrender.com", // ✅ Django backend
      "res.cloudinary.com", // ✅ Cloudinary images
      "images.pexels.com", // ✅ Pexels images
      "images.unsplash.com", // ✅ Unsplash images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "refashioned.onrender.com",
        pathname: "/media/**", // ✅ Django images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/image/upload/**", // ✅ Cloudinary images
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**", // ✅ Pexels images
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*/**", // ✅ Unsplash images
      },
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
