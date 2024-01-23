/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
    displayName: false,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'ipfs.infura.io', 'storage.googleapis.com', 'arweave.net'],
  },
  optimizeFonts: true,
}

module.exports = nextConfig
