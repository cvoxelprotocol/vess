/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'ipfs.infura.io', 'storage.googleapis.com', 'arweave.net'],
  },
}

module.exports = nextConfig
