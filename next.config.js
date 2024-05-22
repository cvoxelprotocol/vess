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
        destination: '/creds/receive/54541374-c7c4-4c0e-abcc-b749ddbf03a7',
        permanent: true,
      },
    ]
  },
}

//module.exports = nextConfig
module.exports = withBundleAnalyzer(nextConfig)
