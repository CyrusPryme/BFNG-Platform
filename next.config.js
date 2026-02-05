/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      's3.amazonaws.com',
    ],
    // Allow images from bfngfiless folder
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/bfngfiless/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

module.exports = nextConfig;
