/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const eslint = {
  eslint: {
    ignoreDuringBuilds: true
  }
}

const typescript = {
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig, eslint, typescript
