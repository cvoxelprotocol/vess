const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'ipfs.infura.io', 'storage.googleapis.com', 'arweave.net'],
  },
  optimizeFonts: true,
}

//module.exports = nextConfig
module.exports = withBundleAnalyzer(nextConfig)
