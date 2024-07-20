/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
};

module.exports = nextConfig;
