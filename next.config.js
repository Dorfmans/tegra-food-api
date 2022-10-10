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

module.exports = nextConfig, eslint
