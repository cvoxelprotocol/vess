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
    domains: ['ipfs.io', 'ipfs.infura.io', 'storage.googleapis.com', 'arweave.net', 'localhost'],
  },
  optimizeFonts: true,
  redirects: async () => {
    return [
      {
        source: '/campaign/pizza2024/recieve',
        destination: '/creds/receive/7bf452f0-3b2f-46d2-b4f7-ca4656b2b85a',
        permanent: true,
      },
    ]
  },
}

//module.exports = nextConfig
module.exports = withBundleAnalyzer(nextConfig)
