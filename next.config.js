/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['raw.githubusercontent.com'],
  },
}

module.exports = nextConfig 